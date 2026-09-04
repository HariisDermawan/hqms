<?php

use App\Models\Obat;
use App\Models\Pemeriksaan;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->user = User::factory()->create();

    Sanctum::actingAs($this->user);
});

it('requires authentication to access obat endpoints', function () {
    auth()->forgetGuards();

    $this->getJson('/api/v1/obats')->assertUnauthorized();
});

it('can list obats', function () {
    Obat::factory()->count(3)->create();

    $this->getJson('/api/v1/obats')
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

it('can show a single obat', function () {
    $obat = Obat::factory()->create();

    $this->getJson("/api/v1/obats/{$obat->id}")
        ->assertOk()
        ->assertJsonPath('data.obat.id', $obat->id)
        ->assertJsonPath('data.obat.pemeriksaan.id', $obat->pemeriksaan->id)
        ->assertJsonPath('data.obat.nama_obat', $obat->nama_obat);
});

it('can create an obat', function () {
    $pemeriksaan = Pemeriksaan::factory()->create();

    $payload = [
        'pemeriksaan_id' => $pemeriksaan->id,
        'nama_obat' => 'Paracetamol 500mg',
        'dosis' => '3x1',
        'jumlah' => 2,
        'satuan' => 'strip',
        'harga' => 15000,
        'keterangan' => 'Minum setelah makan',
    ];

    $this->postJson('/api/v1/obats', $payload)
        ->assertCreated()
        ->assertJsonPath('data.obat.pemeriksaan.id', $pemeriksaan->id)
        ->assertJsonPath('data.obat.nama_obat', 'Paracetamol 500mg')
        ->assertJsonPath('data.obat.jumlah', 2)
        ->assertJsonPath('data.obat.harga', '15000.00');

    $this->assertDatabaseHas('obats', [
        'pemeriksaan_id' => $pemeriksaan->id,
        'nama_obat' => 'Paracetamol 500mg',
        'jumlah' => 2,
        'harga' => 15000,
    ]);
});

it('validates required fields when creating an obat', function () {
    $this->postJson('/api/v1/obats', [])
        ->assertStatus(422)
        ->assertJsonValidationErrors(['pemeriksaan_id', 'nama_obat']);
});

it('can update an obat', function () {
    $obat = Obat::factory()->create();

    $this->putJson("/api/v1/obats/{$obat->id}", [
        'pemeriksaan_id' => $obat->pemeriksaan_id,
        'nama_obat' => 'Ibuprofen 400mg',
        'dosis' => '2x1',
    ])
        ->assertOk()
        ->assertJsonPath('data.obat.id', $obat->id)
        ->assertJsonPath('data.obat.nama_obat', 'Ibuprofen 400mg');
});

it('can delete an obat', function () {
    $obat = Obat::factory()->create();

    $this->deleteJson("/api/v1/obats/{$obat->id}")
        ->assertOk()
        ->assertJsonPath('success', true);

    $this->assertSoftDeleted('obats', [
        'id' => $obat->id,
    ]);
});
