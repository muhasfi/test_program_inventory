<?php

namespace App\Http\Controllers\Api;

use App\Models\StokGudang;
use Illuminate\Http\Request;

class StokGudangController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = StokGudang::with('barang')
            ->whereHas('barang');

        if ($request->search) {
            $query->whereHas('barang', function ($q) use ($request) {
                $q->where('nama_barang', 'like', '%' . $request->search . '%')
                ->orWhere('kode_barang', 'like', '%' . $request->search . '%');
            });
        }

        if ($request->minim == 'true') {
            $query->whereRaw('stok <= stok_minimum');
        }

        $stok = $query->get();

        return response()->json([
            'success' => true,
            'data'    => $stok,
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(StokGudang $stokGudang)
    {
        return response()->json([
            'success' => true,
            'data'    => $stokGudang->load('barang'),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, StokGudang $stokGudang)
    {
        $validated = $request->validate([
            'stok'         => 'required|integer|min:0',
            'stok_minimum' => 'nullable|integer|min:0',
        ]);

        $stokGudang->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Stok berhasil diperbarui.',
            'data'    => $stokGudang->fresh()->load('barang'),
        ]);
    }
}
