<?php

namespace Database\Seeders;

use App\Models\Barang;
use App\Models\StokGudang;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'name'     => 'Administrator',
            'email'    => 'admin@gmail.com',
            'password' => Hash::make('password'),
        ]);

        $barangList = [
            ['nama' => 'Tepung Terigu',  'satuan' => 'kg',  'stok' => 500,  'min' => 50],
            ['nama' => 'Gula Pasir',     'satuan' => 'kg',  'stok' => 300,  'min' => 30],
            ['nama' => 'Minyak Goreng',  'satuan' => 'liter', 'stok' => 200, 'min' => 20],
            ['nama' => 'Garam',          'satuan' => 'kg',  'stok' => 100,  'min' => 10],
            ['nama' => 'Kemasan Plastik', 'satuan' => 'pcs', 'stok' => 1000, 'min' => 100],
            ['nama' => 'Karton Box',     'satuan' => 'pcs', 'stok' => 200,  'min' => 20],
            ['nama' => 'Label Produk',   'satuan' => 'pcs', 'stok' => 15,   'min' => 50],
        ];

        foreach ($barangList as $index => $item) {
            $barang = Barang::create([
                'kode_barang' => 'BRG-' . str_pad($index + 1, 5, '0', STR_PAD_LEFT),
                'nama_barang' => $item['nama'],
                'satuan'      => $item['satuan'],
                'is_active'   => true,
            ]);

            StokGudang::create([
                'barang_id'    => $barang->id,
                'stok'         => $item['stok'],
                'stok_minimum' => $item['min'],
            ]);
        }
    }
}
