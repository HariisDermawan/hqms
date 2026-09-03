<?php

use App\Http\Controllers\Api\AntrianController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DokterController;
use App\Http\Controllers\Api\FaqController;
use App\Http\Controllers\Api\JadwalDokterController;
use App\Http\Controllers\Api\KioskController;
use App\Http\Controllers\Api\MessageController;
use App\Http\Controllers\Api\MonitoringController;
use App\Http\Controllers\Api\PasienController;
use App\Http\Controllers\Api\PemeriksaanController;
use App\Http\Controllers\Api\PendaftaranController;
use App\Http\Controllers\Api\PerawatController;
use App\Http\Controllers\Api\PoliController;
use App\Http\Controllers\Api\PresensiController;
use App\Http\Controllers\Api\RuanganController;
use App\Http\Controllers\Api\TestimonialController;
use Illuminate\Session\Middleware\StartSession;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->middleware(StartSession::class)->group(function () {
    Route::prefix('auth')->group(function () {
        Route::post('/register', [AuthController::class, 'register']);
        Route::post('/login', [AuthController::class, 'login']);
    });

    Route::prefix('kiosk')->group(function () {
        Route::get('/polis', [KioskController::class, 'polis']);
        Route::post('/tickets', [KioskController::class, 'store']);
        Route::get('/now-serving', [KioskController::class, 'nowServing']);
        Route::post('/attendance/scan', [
            KioskController::class,
            'scanAttendance',
        ]);
    });

    Route::middleware('auth:sanctum')->group(function () {
        Route::prefix('auth')->group(function () {
            Route::get('/me', [AuthController::class, 'me']);
            Route::put('/me', [AuthController::class, 'updateProfile']);
            Route::post('/me/password', [AuthController::class, 'updatePassword']);
            Route::post('/logout', [AuthController::class, 'logout']);
        });

        Route::apiResource('polis', PoliController::class);
        Route::apiResource('ruangans', RuanganController::class);
        Route::post('ruangans/{ruangan}/pasiens', [
            RuanganController::class,
            'assignPasien',
        ]);
        Route::delete('ruangans/{ruangan}/pasiens/{ruanganPasien}', [
            RuanganController::class,
            'removePasien',
        ]);
        Route::apiResource('pasiens', PasienController::class);
        Route::apiResource('pendaftarans', PendaftaranController::class);
        Route::apiResource('antrians', AntrianController::class);
        Route::apiResource('dokters', DokterController::class);
        Route::apiResource('perawats', PerawatController::class);
        Route::apiResource('presensis', PresensiController::class);
        Route::apiResource('jadwal-dokters', JadwalDokterController::class);
        Route::apiResource('pemeriksaans', PemeriksaanController::class);
        Route::apiResource('faqs', FaqController::class);
        Route::apiResource('testimonials', TestimonialController::class);
        Route::apiResource('messages', MessageController::class);

        Route::get('monitoring', [
            MonitoringController::class,
            'index',
        ]);
    });
});
