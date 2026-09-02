<?php

use App\Models\Antrian;
use App\Models\Pasien;
use App\Models\Poli;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->user = User::factory()->create();

    Sanctum::actingAs($this->user);
});

it('requires authentication to access pendaftaran endpoints', function () {
    auth()->forgetGuards();

    $this->getJson('/api/v1/pendaftarans')->assertUnauthorized();
});

it('can create a pendaftaran from a queue ticket and mark it called', function () {
    $pasien = Pasien::factory()->create();
    $poli = Poli::factory()->create(['queue_prefix' => 'B']);
    $antrian = Antrian::factory()->create([
        'poli_id' => $poli->id,
        'queue_number' => 'B-007',
    ]);

    $this->postJson('/api/v1/pendaftarans', [
        'antrian_id' => $antrian->id,
        'pasien_id' => $pasien->id,
        'registration_date' => now()->toDateString(),
    ])
        ->assertCreated()
        ->assertJsonPath('data.pendaftaran.status', 'waiting')
        ->assertJsonPath('data.pendaftaran.queue_number', 'B-007')
        ->assertJsonPath('data.pendaftaran.poli.id', $poli->id);

    $this->assertDatabaseHas('pendaftarans', [
        'antrian_id' => $antrian->id,
        'pasien_id' => $pasien->id,
        'poli_id' => $poli->id,
        'queue_number' => 'B-007',
        'status' => 'waiting',
    ]);

    expect($antrian->fresh()->status)->toBe('called');
});

it('reuses the ticket queue number and marks the antrian called', function () {
    $pasien = Pasien::factory()->create();
    $poli = Poli::factory()->create(['queue_prefix' => 'C']);
    $antrian = Antrian::factory()->create([
        'poli_id' => $poli->id,
        'queue_number' => 'C-004',
    ]);

    $this->postJson('/api/v1/pendaftarans', [
        'antrian_id' => $antrian->id,
        'pasien_id' => $pasien->id,
        'registration_date' => now()->toDateString(),
    ])->assertCreated();

    $pendaftaran = $antrian->fresh()->pendaftaran;

    $this->assertNotNull($pendaftaran);
    $this->assertSame($pendaftaran->queue_number, $antrian->queue_number);
    $this->assertMatchesRegularExpression('/^C-\d{3}$/', $antrian->queue_number);
    expect($antrian->fresh()->status)->toBe('called');
});
