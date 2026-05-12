<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Barang;
use App\Models\StokGudang;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class BarangController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Barang::with('stokGudang')
            ->when($request->search, fn($q) => $q
                ->where('nama_barang', 'like', "%{$request->search}%")
                ->orWhere('kode_barang', 'like', "%{$request->search}%")
            )
            ->when($request->has('is_active'), fn($q) => $q
                ->where('is_active', filter_var($request->is_active, FILTER_VALIDATE_BOOLEAN))
            );

        $barang = $request->per_page
            ? $query->paginate($request->per_page)
            : $query->get();

        return response()->json([
            'success' => true,
            'data'    => $barang,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama_barang'   => 'required|string|max:255',
            'satuan'        => 'required|string|max:50',
            'deskripsi'     => 'nullable|string',
            'stok_awal'     => 'required|integer|min:0',
            'stok_minimum'  => 'nullable|integer|min:0',
            'is_active'     => 'nullable|boolean',
        ]);

        DB::beginTransaction();
        try {
            $barang = Barang::create([
                'kode_barang' => Barang::generateKode(),
                'nama_barang' => $validated['nama_barang'],
                'satuan'      => $validated['satuan'],
                'deskripsi'   => $validated['deskripsi'] ?? null,
                'is_active'   => $validated['is_active'] ?? true,
            ]);

            StokGudang::create([
                'barang_id'    => $barang->id,
                'stok'         => $validated['stok_awal'],
                'stok_minimum' => $validated['stok_minimum'] ?? 0,
            ]);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Barang berhasil ditambahkan.',
                'data'    => $barang->load('stokGudang'),
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Gagal menyimpan barang: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Barang $barang)
    {
        return response()->json([
            'success' => true,
            'data'    => $barang->load('stokGudang'),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Barang $barang)
    {
        $validated = $request->validate([
            'nama_barang'  => 'sometimes|required|string|max:255',
            'satuan'       => 'sometimes|required|string|max:50',
            'deskripsi'    => 'nullable|string',
            'stok_minimum' => 'nullable|integer|min:0',
            'is_active'    => 'nullable|boolean',
        ]);

        DB::transaction(function () use ($validated, $barang) {

            $data = [];

            if (isset($validated['nama_barang'])) {
                $data['nama_barang'] = $validated['nama_barang'];
            }

            if (isset($validated['satuan'])) {
                $data['satuan'] = $validated['satuan'];
            }

            if (array_key_exists('deskripsi', $validated)) {
                $data['deskripsi'] = $validated['deskripsi'];
            }

            if (isset($validated['is_active'])) {
                $data['is_active'] = $validated['is_active'];
            }

            $barang->update($data);

            if (isset($validated['stok_minimum'])) {
                $barang->stokGudang()->update([
                    'stok_minimum' => $validated['stok_minimum']
                ]);
            }
        });

        return response()->json([
            'message' => 'Barang berhasil diperbarui',
            'data' => $barang->fresh('stokGudang')
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Barang $barang)
    {
        $adaTransaksi = $barang->transaksiKeluar()->exists();
        if ($adaTransaksi) {
            return response()->json([
                'success' => false,
                'message' => 'Barang tidak dapat dihapus karena sudah memiliki riwayat transaksi.',
            ], 422);
        }

        $barang->delete();

        return response()->json([
            'success' => true,
            'message' => 'Barang berhasil dihapus.',
        ]);
    }
}
