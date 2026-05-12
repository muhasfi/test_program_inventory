<?php

namespace App\Http\Controllers\Api;

use App\Models\Barang;
use App\Models\TransaksiKeluar;
use App\Models\TransaksiKeluarDetail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TransaksiKeluarController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = TransaksiKeluar::with(['user', 'details.barang']);

        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('no_transaksi', 'like', '%' . $request->search . '%')
                ->orWhere('keperluan', 'like', '%' . $request->search . '%');
            });
        }
        if ($request->tanggal_dari) {
            $query->whereDate('tanggal', '>=', $request->tanggal_dari);
        }
        if ($request->tanggal_sampai) {
            $query->whereDate('tanggal', '<=', $request->tanggal_sampai);
        }

        $query->orderBy('created_at', 'desc');

        if ($request->per_page) {
            $transaksi = $query->paginate($request->per_page);
        } else {
            $transaksi = $query->get();
        }

        return response()->json([
            'success' => true,
            'data' => $transaksi,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'tanggal'          => 'required|date',
            'keperluan'        => 'required|string|max:255',
            'catatan'          => 'nullable|string',
            'items'            => 'required|array|min:1',
            'items.*.barang_id' => 'required|exists:barang,id',
            'items.*.jumlah'    => 'required|integer|min:1',
        ]);

        $errors = [];
        $stokMap = [];

        foreach ($validated['items'] as $index => $item) {
            $barang = Barang::with('stokGudang')->find($item['barang_id']);

            if (!$barang->stokGudang) {
                $errors[] = "Barang '{$barang->nama_barang}' belum memiliki data stok.";
                continue;
            }

            if (!$barang->stokGudang->isCukup($item['jumlah'])) {
                $errors[] = "Stok '{$barang->nama_barang}' tidak mencukupi. "
                    . "Diminta: {$item['jumlah']} {$barang->satuan}, "
                    . "Tersedia: {$barang->stokGudang->stok} {$barang->satuan}.";
            }

            $stokMap[$item['barang_id']] = $barang;
        }

        if (!empty($errors)) {
            return response()->json([
                'success' => false,
                'message' => 'Transaksi ditolak. Stok tidak mencukupi.',
                'errors'  => $errors,
            ], 422);
        }

        DB::beginTransaction();
        try {
            $transaksi = TransaksiKeluar::create([
                'no_transaksi' => TransaksiKeluar::generateNoTransaksi(),
                'tanggal'      => $validated['tanggal'],
                'keperluan'    => $validated['keperluan'],
                'catatan'      => $validated['catatan'] ?? null,
                'user_id'      => $request->user()->id,
            ]);

            foreach ($validated['items'] as $item) {
                $barang     = $stokMap[$item['barang_id']];
                $stokGudang = $barang->stokGudang;
                $stokSebelum = $stokGudang->stok;

                $stokGudang->kurangi($item['jumlah']);
                $stokSesudah = $stokGudang->fresh()->stok;

                TransaksiKeluarDetail::create([
                    'transaksi_keluar_id' => $transaksi->id,
                    'barang_id'           => $item['barang_id'],
                    'jumlah'              => $item['jumlah'],
                    'stok_sebelum'        => $stokSebelum,
                    'stok_sesudah'        => $stokSesudah,
                ]);
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Transaksi berhasil disimpan.',
                'data'    => $transaksi->load(['user', 'details.barang']),
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Gagal menyimpan transaksi: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(TransaksiKeluar $transaksiKeluar)
    {
        return response()->json([
            'success' => true,
            'data'    => $transaksiKeluar->load(['user', 'details.barang']),
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(TransaksiKeluar $transaksiKeluar)
    {
        DB::beginTransaction();
        try {
            foreach ($transaksiKeluar->details as $detail) {
                $stokGudang = $detail->barang->stokGudang;
                if ($stokGudang) {
                    $stokGudang->kembalikan($detail->jumlah);
                }
            }
            $transaksiKeluar->delete();

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Transaksi dibatalkan dan stok telah dikembalikan.',
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Gagal membatalkan transaksi: ' . $e->getMessage(),
            ], 500);
        }
    }
}
