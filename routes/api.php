<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\PasienController;
use App\Http\Controllers\Api\PendaftaranController;
use App\Http\Controllers\Api\PoliController;
use Illuminate\Session\Middleware\StartSession;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->middleware(StartSession::class)->group(function () {
        Route::prefix('auth')->group(function () {
            Route::post('/register', [AuthController::class, 'register']);
            Route::post('/login', [AuthController::class, 'login']);
        });
        Route::middleware('auth:sanctum')->group(function () {
            Route::prefix('auth')->group(function () {
                Route::get('/me', [AuthController::class, 'me']);
                Route::post('/logout', [AuthController::class, 'logout']);
            });

            Route::apiResource('polis', PoliController::class);
            Route::apiResource('pasiens', PasienController::class);
            Route::apiResource('pendaftarans', PendaftaranController::class);
        });
    });
