<?php

use App\Models\Pasien;
use App\Models\Pemeriksaan;
use App\Models\Pendaftaran;
use App\Models\Poli;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->user = User::factory()->create();

    Sanctum::actingAs($this->user);
});

it('requires authentication to access monitoring endpoint', function () {
    auth()->forgetGuards();

    $this->getJson('/api/v1/monitoring')->assertUnauthorized();
});

it('returns summary aggregates', function () {
    $poli = Poli::factory()->create();
    $pasien = Pasien::factory()->create(['poli_id' => $poli->id]);

    Pendaftaran::factory()->create([
        'pasien_id' => $pasien->id,
        'poli_id' => $poli->id,
        'registration_date' => now()->toDateString(),
    ]);

    $this->getJson('/api/v1/monitoring')
        ->assertOk()
        ->assertJsonPath('success', true)
        ->assertJsonPath('data.summary.total_pasien', 1)
        ->assertJsonPath('data.summary.total_poli', 2)
        ->assertJsonPath('data.summary.pendaftaran_hari_ini', 1)
        ->assertJsonPath('data.summary.pendaftaran_bulan_ini', 1)
        ->assertJsonPath('data.summary.pemeriksaan_hari_ini', 0);
});

it('returns chart datasets with proper shape', function () {
    $poli = Poli::factory()->create();
    Pasien::factory()->create(['poli_id' => $poli->id]);

    Pemeriksaan::factory()->create();

    $this->getJson('/api/v1/monitoring')
        ->assertOk()
        ->assertJsonStructure([
            'data' => [
                'charts' => [
                    'pasien_per_month',
                    'pasien_per_poli',
                    'pendaftaran_per_day',
                    'pendaftaran_per_poli',
                    'antrian_status',
                ],
            ],
        ])
        ->assertJsonCount(6, 'data.charts.pasien_per_month')
        ->assertJsonCount(7, 'data.charts.pendaftaran_per_day')
        ->assertJsonPath(
            'data.charts.pasien_per_poli.0.poli',
            $poli->name,
        );
});
