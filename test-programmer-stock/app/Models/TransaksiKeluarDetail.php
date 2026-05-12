<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TransaksiKeluarDetail extends Model
{
    use HasFactory;

    protected $table = 'transaksi_keluar_detail';

    protected $fillable = [
        'transaksi_keluar_id',
        'barang_id',
        'jumlah',
        'stok_sebelum',
        'stok_sesudah',
    ];

    protected $casts = [
        'jumlah'       => 'integer',
        'stok_sebelum' => 'integer',
        'stok_sesudah' => 'integer',
    ];

    public function transaksiKeluar()
    {
        return $this->belongsTo(TransaksiKeluar::class);
    }

    public function barang()
    {
        return $this->belongsTo(Barang::class);
    }
}
