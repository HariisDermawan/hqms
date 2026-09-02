<?php

use App\Models\Antrian;
use App\Models\Pendaftaran;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->user = User::factory()->create();

    Sanctum::actingAs($this->user);
});

it('requires authentication to access antrian endpoints', function () {
    auth()->forgetGuards();

    $this->getJson('/api/v1/antrians')->assertUnauthorized();
});

it('can list antrians', function () {
    Antrian::factory()->count(3)->create();

    $this->getJson('/api/v1/antrians')
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

it('can show a single antrian', function () {
    $antrian = Antrian::factory()->create();

    $this->getJson("/api/v1/antrians/{$antrian->id}")
        ->assertOk()
        ->assertJsonPath('data.antrian.id', $antrian->id)
        ->assertJsonPath('data.antrian.queue_number', $antrian->queue_number)
        ->assertJsonPath('data.antrian.status', 'waiting');
});

it('can create an antrian from a waiting pendaftaran', function () {
    $pendaftaran = Pendaftaran::factory()->create();

    $this->postJson('/api/v1/antrians', [
        'pendaftaran_id' => $pendaftaran->id,
    ])
        ->assertCreated()
        ->assertJsonPath('data.antrian.pendaftaran.id', $pendaftaran->id)
        ->assertJsonPath('data.antrian.queue_number', $pendaftaran->queue_number)
        ->assertJsonPath('data.antrian.status', 'waiting');

    $this->assertDatabaseHas('antrians', [
        'pendaftaran_id' => $pendaftaran->id,
        'status' => 'waiting',
    ]);
});

it('cannot create an antrian for a pendaftaran that is already queued', function () {
    $antrian = Antrian::factory()->create();

    $this->postJson('/api/v1/antrians', [
        'pendaftaran_id' => $antrian->pendaftaran_id,
    ])
        ->assertStatus(422)
        ->assertJsonValidationErrors('pendaftaran_id');
});

it('cannot create an antrian for a nonexistent pendaftaran', function () {
    $this->postJson('/api/v1/antrians', [
        'pendaftaran_id' => 99999,
    ])
        ->assertStatus(422)
        ->assertJsonValidationErrors('pendaftaran_id');
});

it('records called_at when status is changed to called', function () {
    $antrian = Antrian::factory()->create();

    $this->putJson("/api/v1/antrians/{$antrian->id}", [
        'status' => 'called',
    ])
        ->assertOk()
        ->assertJsonPath('data.antrian.status', 'called');

    $this->assertNotNull($antrian->fresh()->called_at);
    $this->assertNull($antrian->fresh()->started_at);
    $this->assertNull($antrian->fresh()->completed_at);
});

it('keeps pendaftaran status in sync with the antrian status', function () {
    $antrian = Antrian::factory()->create();
    $pendaftaran = $antrian->pendaftaran;

    expect($pendaftaran->status)->toBe('waiting');

    $this->putJson("/api/v1/antrians/{$antrian->id}", ['status' => 'called'])
        ->assertOk();
    expect($pendaftaran->fresh()->status)->toBe('called');

    $this->putJson("/api/v1/antrians/{$antrian->id}", ['status' => 'serving'])
        ->assertOk();
    expect($pendaftaran->fresh()->status)->toBe('serving');

    $this->putJson("/api/v1/antrians/{$antrian->id}", ['status' => 'completed'])
        ->assertOk();
    expect($pendaftaran->fresh()->status)->toBe('completed');
});

it('resets pendaftaran status to waiting when antrian is skipped', function () {
    $antrian = Antrian::factory()->create();
    $pendaftaran = $antrian->pendaftaran;

    $this->putJson("/api/v1/antrians/{$antrian->id}", ['status' => 'called'])
        ->assertOk();
    expect($pendaftaran->fresh()->status)->toBe('called');

    $this->putJson("/api/v1/antrians/{$antrian->id}", ['status' => 'skipped'])
        ->assertOk()
        ->assertJsonPath('data.antrian.status', 'skipped');

    expect($pendaftaran->fresh()->status)->toBe('waiting');
});

it('resets pendaftaran status to waiting when antrian is deleted', function () {
    $antrian = Antrian::factory()->create();
    $pendaftaran = $antrian->pendaftaran;

    $this->putJson("/api/v1/antrians/{$antrian->id}", ['status' => 'called'])
        ->assertOk();
    expect($pendaftaran->fresh()->status)->toBe('called');

    $this->deleteJson("/api/v1/antrians/{$antrian->id}")->assertOk();

    expect($pendaftaran->fresh()->status)->toBe('waiting');
});

it('records called_at and started_at when status is changed to serving', function () {
    $antrian = Antrian::factory()->create();

    $this->putJson("/api/v1/antrians/{$antrian->id}", [
        'status' => 'serving',
    ])
        ->assertOk()
        ->assertJsonPath('data.antrian.status', 'serving');

    $fresh = $antrian->fresh();

    $this->assertNotNull($fresh->called_at);
    $this->assertNotNull($fresh->started_at);
    $this->assertNull($fresh->completed_at);
});

it('records all timestamps when status is changed to completed', function () {
    $antrian = Antrian::factory()->create();

    $this->putJson("/api/v1/antrians/{$antrian->id}", [
        'status' => 'completed',
    ])
        ->assertOk()
        ->assertJsonPath('data.antrian.status', 'completed');

    $fresh = $antrian->fresh();

    $this->assertNotNull($fresh->called_at);
    $this->assertNotNull($fresh->started_at);
    $this->assertNotNull($fresh->completed_at);
});

it('updates notes when provided', function () {
    $antrian = Antrian::factory()->create();

    $this->putJson("/api/v1/antrians/{$antrian->id}", [
        'status' => 'waiting',
        'notes' => 'Pasien datang terlambat.',
    ])
        ->assertOk()
        ->assertJsonPath('data.antrian.notes', 'Pasien datang terlambat.');

    $this->assertSame('Pasien datang terlambat.', $antrian->fresh()->notes);
});

it('rejects an invalid antrian status', function () {
    $antrian = Antrian::factory()->create();

    $this->putJson("/api/v1/antrians/{$antrian->id}", [
        'status' => 'unknown',
    ])
        ->assertStatus(422)
        ->assertJsonValidationErrors('status');
});

it('can delete an antrian (soft delete)', function () {
    $antrian = Antrian::factory()->create();

    $this->deleteJson("/api/v1/antrians/{$antrian->id}")
        ->assertOk()
        ->assertJsonPath('success', true);

    $this->assertSoftDeleted('antrians', ['id' => $antrian->id]);
});
