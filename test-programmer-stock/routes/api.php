<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BarangController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\StokGudangController;
use App\Http\Controllers\Api\TransaksiKeluarController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {

    Route::post('/logout',[AuthController::class, 'logout']);
    Route::get('/me',[AuthController::class, 'me']);

    Route::get('/dashboard',[DashboardController::class, 'index']);

    Route::apiResource('barang', BarangController::class);

    Route::get('/stok-gudang',[StokGudangController::class, 'index']);
    Route::get('/stok-gudang/{stokGudang}',[StokGudangController::class, 'show']);
    Route::put('/stok-gudang/{stokGudang}',[StokGudangController::class, 'update']);

    Route::apiResource('transaksi-keluar', TransaksiKeluarController::class)->only(['index', 'store', 'show', 'destroy']);
});
