<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class TransaksiKeluar extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'transaksi_keluar';

    protected $fillable = [
        'no_transaksi',
        'tanggal',
        'keperluan',
        'user_id',
        'catatan',
    ];

    protected $casts = [
        'tanggal' => 'date',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function details()
    {
        return $this->hasMany(TransaksiKeluarDetail::class);
    }

    public static function generateNoTransaksi(): string
    {
        $tanggal = now()->format('Ymd');
        $prefix  = 'TRX-' . $tanggal . '-';

        $lastTransaction = self::withTrashed()
            ->where('no_transaksi', 'like', $prefix . '%')
            ->latest('id')
            ->first();

        $next = 1;

        if ($lastTransaction) {
            $lastNumber = (int) substr($lastTransaction->no_transaksi, -5);
            $next = $lastNumber + 1;
        }

        return $prefix . sprintf('%05d', $next);
    }
}
