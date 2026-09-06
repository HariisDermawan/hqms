<?php

use App\Models\Dokter;

it('shows the public doctor detail page for an active doctor', function () {
    $dokter = Dokter::factory()->create([
        'is_active' => true,
        'name' => 'dr. Contoh Dokter',
        'specialization' => 'Spesialis Jantung',
    ]);

    $this->get("/dokter/{$dokter->slug}")
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('Dokter/Detail')
            ->has('dokter', fn ($res) => $res
                ->where('id', $dokter->id)
                ->where('slug', $dokter->slug)
                ->where('name', 'dr. Contoh Dokter')
                ->where('specialization', 'Spesialis Jantung')
                ->etc()));
});

it('returns 404 for an inactive doctor', function () {
    $dokter = Dokter::factory()->create(['is_active' => false]);

    $this->get("/dokter/{$dokter->slug}")->assertNotFound();
});

it('generates a slug from the doctor name when none is provided', function () {
    $dokter = Dokter::factory()->create(['name' => 'dr. Contoh Dokter']);

    expect($dokter->slug)->toBe('dr-contoh-dokter');
});

it('shows the public doctor search page', function () {
    $this->get('/cari-dokter')
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('Dokter/Cari'));
});
