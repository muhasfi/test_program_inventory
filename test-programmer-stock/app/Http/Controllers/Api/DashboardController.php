<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Barang;
use App\Models\StokGudang;
use App\Models\TransaksiKeluar;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index()
    {
        $totalBarang   = Barang::count();
        $barangAktif   = Barang::where('is_active', true)->count();
        $barangNonAktif = Barang::where('is_active', false)->count();

        $totalStok      = StokGudang::sum('stok');
        $stokHabis      = StokGudang::where('stok', 0)->count();
        $stokMenipis    = StokGudang::whereRaw('stok > 0 AND stok <= stok_minimum')->count();

        $barangMenipis = StokGudang::with('barang')
            ->whereRaw('stok <= stok_minimum')
            ->orderBy('stok', 'asc')
            ->limit(5)
            ->get();

        $totalTransaksi       = TransaksiKeluar::count();
        $transaksiHariIni     = TransaksiKeluar::whereDate('tanggal', today())->count();
        $transaksiBulanIni    = TransaksiKeluar::whereMonth('tanggal', now()->month)
            ->whereYear('tanggal', now()->year)
            ->count();

        $transaksiTerbaru = TransaksiKeluar::with(['user', 'details.barang'])
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get();


        return response()->json([
            'success' => true,
            'data'    => [
                'ringkasan_barang' => [
                    'total'    => $totalBarang,
                    'aktif'    => $barangAktif,
                    'nonaktif' => $barangNonAktif,
                ],
                'ringkasan_stok' => [
                    'total_stok'   => $totalStok,
                    'stok_habis'   => $stokHabis,
                    'stok_menipis' => $stokMenipis,
                ],
                'ringkasan_transaksi' => [
                    'total'       => $totalTransaksi,
                    'hari_ini'    => $transaksiHariIni,
                    'bulan_ini'   => $transaksiBulanIni,
                ],
                'barang_menipis'   => $barangMenipis,
                'transaksi_terbaru' => $transaksiTerbaru,
            ],
        ]);
    }
}
