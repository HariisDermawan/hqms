<?php

use App\Models\Pembayaran;
use App\Models\Pemeriksaan;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->user = User::factory()->create();

    Sanctum::actingAs($this->user);
});

it('requires authentication to access pembayaran endpoints', function () {
    auth()->forgetGuards();

    $this->getJson('/api/v1/pembayarans')->assertUnauthorized();
});

it('can list pembayarans', function () {
    Pembayaran::factory()->count(3)->create();

    $this->getJson('/api/v1/pembayarans')
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

it('can show a single pembayaran', function () {
    $pembayaran = Pembayaran::factory()->create();

    $this->getJson("/api/v1/pembayarans/{$pembayaran->id}")
        ->assertOk()
        ->assertJsonPath('data.pembayaran.id', $pembayaran->id)
        ->assertJsonPath('data.pembayaran.invoice_number', $pembayaran->invoice_number)
        ->assertJsonPath('data.pembayaran.pemeriksaan.id', $pembayaran->pemeriksaan->id)
        ->assertJsonPath('data.pembayaran.metode', $pembayaran->metode)
        ->assertJsonPath('data.pembayaran.status', $pembayaran->status);
});

it('can create a pembayaran and computes total from items', function () {
    $pemeriksaan = Pemeriksaan::factory()->create();

    $payload = [
        'pemeriksaan_id' => $pemeriksaan->id,
        'metode' => 'cash',
        'status' => 'paid',
        'tanggal' => now()->toDateString(),
        'detail_items' => [
            [
                'description' => 'Jasa pemeriksaan',
                'quantity' => 1,
                'unit_price' => 150000,
            ],
            [
                'description' => 'Obat Paracetamol',
                'quantity' => 2,
                'unit_price' => 25000,
            ],
        ],
    ];

    $this->postJson('/api/v1/pembayarans', $payload)
        ->assertCreated()
        ->assertJsonPath('data.pembayaran.pemeriksaan.id', $pemeriksaan->id)
        ->assertJsonPath('data.pembayaran.metode', 'cash')
        ->assertJsonPath('data.pembayaran.status', 'paid')
        ->assertJsonPath('data.pembayaran.total', '200000.00');

    $this->assertDatabaseHas('pembayarans', [
        'pemeriksaan_id' => $pemeriksaan->id,
        'metode' => 'cash',
        'status' => 'paid',
        'total' => 200000,
    ]);
});

it('can create a pembayaran with an explicit total', function () {
    $pemeriksaan = Pemeriksaan::factory()->create();

    $payload = [
        'pemeriksaan_id' => $pemeriksaan->id,
        'total' => 999999,
        'metode' => 'qris',
        'status' => 'unpaid',
        'tanggal' => now()->toDateString(),
    ];

    $this->postJson('/api/v1/pembayarans', $payload)
        ->assertCreated()
        ->assertJsonPath('data.pembayaran.total', '999999.00')
        ->assertJsonPath('data.pembayaran.metode', 'qris')
        ->assertJsonPath('data.pembayaran.status', 'unpaid');
});

it('validates required fields when creating a pembayaran', function () {
    $this->postJson('/api/v1/pembayarans', [])
        ->assertStatus(422)
        ->assertJsonValidationErrors([
            'pemeriksaan_id',
            'metode',
            'status',
            'tanggal',
        ]);
});

it('can update a pembayaran', function () {
    $pembayaran = Pembayaran::factory()->create();

    $this->putJson("/api/v1/pembayarans/{$pembayaran->id}", [
        'pemeriksaan_id' => $pembayaran->pemeriksaan_id,
        'total' => 75000,
        'metode' => 'transfer',
        'status' => 'paid',
        'tanggal' => now()->toDateString(),
    ])
        ->assertOk()
        ->assertJsonPath('data.pembayaran.id', $pembayaran->id)
        ->assertJsonPath('data.pembayaran.total', '75000.00')
        ->assertJsonPath('data.pembayaran.metode', 'transfer');
});

it('can delete a pembayaran', function () {
    $pembayaran = Pembayaran::factory()->create();

    $this->deleteJson("/api/v1/pembayarans/{$pembayaran->id}")
        ->assertOk()
        ->assertJsonPath('success', true);

    $this->assertSoftDeleted('pembayarans', [
        'id' => $pembayaran->id,
    ]);
});
