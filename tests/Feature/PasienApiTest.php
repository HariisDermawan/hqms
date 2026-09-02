<?php

use App\Models\Poli;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->user = User::factory()->create();

    Sanctum::actingAs($this->user);
});

it('requires authentication to access pasien endpoints', function () {
    auth()->forgetGuards();

    $this->getJson('/api/v1/pasiens')->assertUnauthorized();
});

it('can create a pasien and auto-generate the medical record number', function () {
    $poli = Poli::factory()->create();

    $this->postJson('/api/v1/pasiens', [
        'poli_id' => $poli->id,
        'name' => 'Budi Santoso',
        'nik' => '3273010101910001',
        'gender' => 'L',
        'birth_date' => '1991-01-01',
    ])
        ->assertCreated()
        ->assertJsonPath('data.pasien.name', 'Budi Santoso')
        ->assertJsonPath('data.pasien.medical_record_number', 'RM000001');

    $this->assertDatabaseHas('pasiens', [
        'name' => 'Budi Santoso',
        'medical_record_number' => 'RM000001',
        'nik' => '3273010101910001',
    ]);
});

it('generates an incrementing medical record number', function () {
    $poli = Poli::factory()->create();

    $this->postJson('/api/v1/pasiens', [
        'poli_id' => $poli->id,
        'name' => 'Pasien Satu',
        'nik' => '3273010101910002',
        'gender' => 'L',
        'birth_date' => '1991-01-01',
    ])->assertCreated();

    $this->postJson('/api/v1/pasiens', [
        'poli_id' => $poli->id,
        'name' => 'Pasien Dua',
        'nik' => '3273010101910003',
        'gender' => 'P',
        'birth_date' => '1992-02-02',
    ])
        ->assertCreated()
        ->assertJsonPath('data.pasien.medical_record_number', 'RM000002');
});
