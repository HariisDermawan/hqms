<?php

use App\Models\Penawaran;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Laravel\Sanctum\Sanctum;
use Spatie\Permission\Models\Permission;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->user = User::factory()->create();

    collect(['offer.view', 'offer.create', 'offer.update', 'offer.delete'])
        ->each(fn (string $permission) => Permission::findOrCreate(
            $permission,
            'web'
        ));

    $this->user->givePermissionTo([
        'offer.view',
        'offer.create',
        'offer.update',
        'offer.delete',
    ]);

    Sanctum::actingAs($this->user);
});

it('requires authentication to access penawaran endpoints', function () {
    auth()->forgetGuards();

    $this->getJson('/api/v1/penawarans')->assertUnauthorized();
});

it('can list penawarans', function () {
    Penawaran::factory()->count(3)->create();

    $this->getJson('/api/v1/penawarans')
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

it('can show a single penawaran', function () {
    $penawaran = Penawaran::factory()->create();

    $this->getJson("/api/v1/penawarans/{$penawaran->id}")
        ->assertOk()
        ->assertJsonPath('data.penawaran.id', $penawaran->id)
        ->assertJsonPath('data.penawaran.title', $penawaran->title)
        ->assertJsonPath('data.penawaran.slug', $penawaran->slug);
});

it('can create a penawaran with image', function () {
    $payload = [
        'title' => 'Promo Paket Medical Check-Up',
        'slug' => 'promo-paket-medical-check-up',
        'description' => 'Dapatkan harga spesial untuk pemeriksaan kesehatan.',
        'image' => UploadedFile::fake()->image('penawaran.jpg', 800, 400),
    ];

    $this->post('/api/v1/penawarans', $payload)
        ->assertCreated()
        ->assertJsonPath('data.penawaran.title', 'Promo Paket Medical Check-Up')
        ->assertJsonPath('data.penawaran.slug', 'promo-paket-medical-check-up');

    $this->assertDatabaseHas('penawarans', [
        'title' => 'Promo Paket Medical Check-Up',
        'slug' => 'promo-paket-medical-check-up',
    ]);
});

it('validates required fields when creating a penawaran', function () {
    $this->postJson('/api/v1/penawarans', [])
        ->assertStatus(422)
        ->assertJsonValidationErrors(['title', 'slug', 'image']);
});

it('validates slug format when creating a penawaran', function () {
    $this->postJson('/api/v1/penawarans', [
        'title' => 'Judul Penawaran',
        'slug' => 'Judul Dengan Spasi',
        'image' => UploadedFile::fake()->image('penawaran.jpg'),
    ])
        ->assertStatus(422)
        ->assertJsonValidationErrors(['slug']);
});

it('can update a penawaran', function () {
    $penawaran = Penawaran::factory()->create();

    $this->putJson("/api/v1/penawarans/{$penawaran->id}", [
        'title' => 'Judul Penawaran Diperbarui',
        'slug' => 'judul-penawaran-diperbarui',
    ])
        ->assertOk()
        ->assertJsonPath('data.penawaran.id', $penawaran->id)
        ->assertJsonPath('data.penawaran.title', 'Judul Penawaran Diperbarui');
});

it('can delete a penawaran', function () {
    $penawaran = Penawaran::factory()->create();

    $this->deleteJson("/api/v1/penawarans/{$penawaran->id}")
        ->assertOk()
        ->assertJsonPath('success', true);

    $this->assertSoftDeleted('penawarans', [
        'id' => $penawaran->id,
    ]);
});

it('denies access without permission', function () {
    $user = User::factory()->create();

    Sanctum::actingAs($user);

    $this->getJson('/api/v1/penawarans')->assertForbidden();
});
