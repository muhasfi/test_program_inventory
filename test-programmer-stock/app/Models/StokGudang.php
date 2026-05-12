<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StokGudang extends Model
{
    use HasFactory;

    protected $table = 'stok_gudang';

    protected $fillable = [
        'barang_id',
        'stok',
        'stok_minimum',
    ];

    protected $casts = [
        'stok'         => 'integer',
        'stok_minimum' => 'integer',
    ];

    public function barang()
    {
        return $this->belongsTo(Barang::class);
    }

    public function isCukup(int $jumlah): bool
    {
        return $this->stok >= $jumlah;
    }

    public function kurangi(int $jumlah): void
    {
        if (!$this->isCukup($jumlah)) {
            throw new \Exception("Stok tidak mencukupi. Stok tersedia: {$this->stok}");
        }
        $this->decrement('stok', $jumlah);
    }

    public function kembalikan(int $jumlah): void
    {
        $this->increment('stok', $jumlah);
    }
}
