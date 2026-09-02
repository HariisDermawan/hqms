<?php

use App\Models\Dokter;
use App\Models\Pasien;
use App\Models\Pemeriksaan;
use App\Models\Poli;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->user = User::factory()->create();

    Sanctum::actingAs($this->user);
});

it('requires authentication to access pemeriksaan endpoints', function () {
    auth()->forgetGuards();

    $this->getJson('/api/v1/pemeriksaans')->assertUnauthorized();
});

it('can list pemeriksaans', function () {
    Pemeriksaan::factory()->count(3)->create();

    $this->getJson('/api/v1/pemeriksaans')
        ->assertOk()
        ->assertJsonStructure([
            'success',
            'message',
            'data' => [
                'items',
                'pagination' => [
                    'current_page',
                    'per_page',
                    'total',
                    'last_page',
                ],
            ],
        ])
        ->assertJsonCount(3, 'data.items');
});

it('can show a single pemeriksaan', function () {
    $pemeriksaan = Pemeriksaan::factory()->create();

    $this->getJson("/api/v1/pemeriksaans/{$pemeriksaan->id}")
        ->assertOk()
        ->assertJsonPath('data.pemeriksaan.id', $pemeriksaan->id)
        ->assertJsonPath(
            'data.pemeriksaan.pasien.name',
            $pemeriksaan->pasien->name
        )
        ->assertJsonPath(
            'data.pemeriksaan.poli.id',
            $pemeriksaan->poli->id
        )
        ->assertJsonPath(
            'data.pemeriksaan.dokter.id',
            $pemeriksaan->dokter->id
        )
        ->assertJsonPath('data.pemeriksaan.category', $pemeriksaan->category);
});

it('can create a pemeriksaan', function () {
    $pasien = Pasien::factory()->create();
    $poli = Poli::factory()->create();
    $dokter = Dokter::factory()->create();

    $payload = [
        'pasien_id' => $pasien->id,
        'poli_id' => $poli->id,
        'dokter_id' => $dokter->id,
        'category' => 'Umum',
        'examined_at' => now()->toDateTimeString(),
        'complaint' => 'Demam tinggi',
        'diagnosis' => 'Demam berdarah',
        'treatment' => 'Paracetamol 3x1',
        'notes' => 'Pantau suhu harian',
    ];

    $this->postJson('/api/v1/pemeriksaans', $payload)
        ->assertCreated()
        ->assertJsonPath('data.pemeriksaan.pasien.id', $pasien->id)
        ->assertJsonPath('data.pemeriksaan.poli.id', $poli->id)
        ->assertJsonPath('data.pemeriksaan.dokter.id', $dokter->id)
        ->assertJsonPath('data.pemeriksaan.category', 'Umum')
        ->assertJsonPath('data.pemeriksaan.diagnosis', 'Demam berdarah');

    $this->assertDatabaseHas('pemeriksaans', [
        'pasien_id' => $pasien->id,
        'poli_id' => $poli->id,
        'dokter_id' => $dokter->id,
        'category' => 'Umum',
        'diagnosis' => 'Demam berdarah',
    ]);
});

it('validates required fields when creating a pemeriksaan', function () {
    $this->postJson('/api/v1/pemeriksaans', [])
        ->assertStatus(422)
        ->assertJsonValidationErrors([
            'pasien_id',
            'poli_id',
            'category',
            'examined_at',
        ]);
});

it('can update a pemeriksaan', function () {
    $pemeriksaan = Pemeriksaan::factory()->create();
    $poli = Poli::factory()->create();

    $this->putJson("/api/v1/pemeriksaans/{$pemeriksaan->id}", [
        'pasien_id' => $pemeriksaan->pasien_id,
        'poli_id' => $poli->id,
        'category' => 'Bedah',
        'examined_at' => now()->toDateTimeString(),
        'diagnosis' => 'Diagnosis diperbarui',
    ])
        ->assertOk()
        ->assertJsonPath('data.pemeriksaan.id', $pemeriksaan->id)
        ->assertJsonPath('data.pemeriksaan.poli.id', $poli->id)
        ->assertJsonPath('data.pemeriksaan.category', 'Bedah')
        ->assertJsonPath('data.pemeriksaan.diagnosis', 'Diagnosis diperbarui');
});

it('can delete a pemeriksaan', function () {
    $pemeriksaan = Pemeriksaan::factory()->create();

    $this->deleteJson("/api/v1/pemeriksaans/{$pemeriksaan->id}")
        ->assertOk()
        ->assertJsonPath('success', true);

    $this->assertSoftDeleted('pemeriksaans', [
        'id' => $pemeriksaan->id,
    ]);
});
