<?php

use App\Models\Antrian;
use App\Models\Poli;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('lists only active polis publicly', function () {
    $active = Poli::factory()->create(['is_active' => true]);
    $inactive = Poli::factory()->create(['is_active' => false]);

    $this->getJson('/api/v1/kiosk/polis')
        ->assertOk()
        ->assertJsonPath('success', true)
        ->assertJsonCount(1, 'data.items')
        ->assertJsonPath('data.items.0.id', $active->id)
        ->assertJsonMissing(['id' => $inactive->id]);
});

it('creates a queue ticket publicly', function () {
    $poli = Poli::factory()->create(['queue_prefix' => 'B', 'is_active' => true]);

    $this->postJson('/api/v1/kiosk/tickets', [
        'poli_id' => $poli->id,
    ])
        ->assertCreated()
        ->assertJsonPath('success', true)
        ->assertJsonPath('data.antrian.queue_number', 'B-001')
        ->assertJsonPath('data.antrian.status', 'waiting');

    $this->assertDatabaseHas('antrians', [
        'poli_id' => $poli->id,
        'queue_number' => 'B-001',
        'status' => 'waiting',
    ]);
});

it('requires a valid poli when creating a ticket', function () {
    $this->postJson('/api/v1/kiosk/tickets', [
        'poli_id' => 999,
    ])
        ->assertStatus(422)
        ->assertJsonValidationErrors('poli_id');
});

it('returns now serving tickets per poli', function () {
    $poli = Poli::factory()->create(['queue_prefix' => 'A', 'is_active' => true]);

    $called = Antrian::factory()->create([
        'poli_id' => $poli->id,
        'status' => 'called',
    ]);

    $serving = Antrian::factory()->create([
        'poli_id' => $poli->id,
        'status' => 'serving',
    ]);

    $this->getJson('/api/v1/kiosk/now-serving')
        ->assertOk()
        ->assertJsonPath('success', true)
        ->assertJsonCount(1, 'data.items')
        ->assertJsonPath('data.items.0.queue_number', $serving->queue_number)
        ->assertJsonPath('data.items.0.status', 'serving');
});

it('exposes public kiosk routes without authentication', function () {
    auth()->forgetGuards();

    $this->getJson('/api/v1/kiosk/polis')->assertOk();
    $this->getJson('/api/v1/kiosk/now-serving')->assertOk();
});
