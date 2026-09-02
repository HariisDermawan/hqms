<?php

use App\Models\Antrian;
use App\Models\Dokter;
use App\Models\Pemeriksaan;
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
            'data.pemeriksaan.antrian.queue_number',
            $pemeriksaan->antrian->queue_number
        )
        ->assertJsonPath(
            'data.pemeriksaan.pasien.name',
            $pemeriksaan->antrian->pendaftaran->pasien->name
        )
        ->assertJsonPath(
            'data.pemeriksaan.dokter.id',
            $pemeriksaan->dokter->id
        );
});

it('can create a pemeriksaan', function () {
    $antrian = Antrian::factory()->create();
    $dokter = Dokter::factory()->create();

    $payload = [
        'antrian_id' => $antrian->id,
        'dokter_id' => $dokter->id,
        'examined_at' => now()->toDateTimeString(),
        'complaint' => 'Demam tinggi',
        'diagnosis' => 'Demam berdarah',
        'treatment' => 'Paracetamol 3x1',
        'notes' => 'Pantau suhu harian',
    ];

    $this->postJson('/api/v1/pemeriksaans', $payload)
        ->assertCreated()
        ->assertJsonPath('data.pemeriksaan.antrian.id', $antrian->id)
        ->assertJsonPath('data.pemeriksaan.dokter.id', $dokter->id)
        ->assertJsonPath('data.pemeriksaan.diagnosis', 'Demam berdarah');

    $this->assertDatabaseHas('pemeriksaans', [
        'antrian_id' => $antrian->id,
        'diagnosis' => 'Demam berdarah',
    ]);
});

it('validates required fields when creating a pemeriksaan', function () {
    $this->postJson('/api/v1/pemeriksaans', [])
        ->assertStatus(422)
        ->assertJsonValidationErrors([
            'antrian_id',
            'dokter_id',
            'examined_at',
        ]);
});

it('can update a pemeriksaan', function () {
    $pemeriksaan = Pemeriksaan::factory()->create();
    $dokter = Dokter::factory()->create();

    $this->putJson("/api/v1/pemeriksaans/{$pemeriksaan->id}", [
        'antrian_id' => $pemeriksaan->antrian_id,
        'dokter_id' => $dokter->id,
        'examined_at' => now()->toDateTimeString(),
        'diagnosis' => 'Diagnosis diperbarui',
    ])
        ->assertOk()
        ->assertJsonPath('data.pemeriksaan.id', $pemeriksaan->id)
        ->assertJsonPath('data.pemeriksaan.dokter.id', $dokter->id)
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
