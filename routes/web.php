<?php

use App\Models\Pasien;
use App\Models\Poli;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::inertia('/', 'welcome')->name('home');
Route::get('/register', function () {
    return Inertia::render('Auth/Register');
})->name('register');
Route::get('/login', function () {
    return Inertia::render('Auth/Login');
})->name('login');

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->name('dashboard');

Route::get('/pasiens/create', function () {
    return Inertia::render('Pasien/Create');
})->name('pasiens.create');

Route::get('/pasiens/{pasien}/edit', function (Pasien $pasien) {
    return Inertia::render('Pasien/Edit', [
        'id' => $pasien->id,
    ]);
})->name('pasiens.edit');

Route::get('/pasiens/{pasien}', function (Pasien $pasien) {
    return Inertia::render('Pasien/Show', [
        'id' => $pasien->id,
    ]);
})->name('pasiens.show');

Route::get('/pasiens', function () {
    return Inertia::render('Pasien/Index');
})->name('pasiens.index');

Route::get('/polis/create', function () {
    return Inertia::render('Poli/Create');
})->name('polis.create');

Route::get('/polis/{poli}/edit', function (Poli $poli) {
    return Inertia::render('Poli/Edit', [
        'id' => $poli->id,
    ]);
})->name('polis.edit');

Route::get('/polis/{poli}', function (Poli $poli) {
    return Inertia::render('Poli/Show', [
        'id' => $poli->id,
    ]);
})->name('polis.show');

Route::get('/polis', function () {
    return Inertia::render('Poli/Index');
})->name('polis.index');
