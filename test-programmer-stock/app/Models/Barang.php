<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Barang extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'barang';

    protected $fillable = [
        'kode_barang',
        'nama_barang',
        'satuan',
        'deskripsi',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function stokGudang()
    {
        return $this->hasOne(StokGudang::class);
    }

    public function transaksiKeluar()
    {
        return $this->hasMany(TransaksiKeluarDetail::class);
    }

    public static function generateKode(): string
    {
        $last = self::withTrashed()->orderBy('id', 'desc')->first();
        $number = $last ? ($last->id + 1) : 1;
        return 'BRG-' . str_pad($number, 5, '0', STR_PAD_LEFT);
    }
}
