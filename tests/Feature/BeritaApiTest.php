<?php

use App\Models\Berita;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Laravel\Sanctum\Sanctum;
use Spatie\Permission\Models\Permission;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->user = User::factory()->create();

    collect(['news.view', 'news.create', 'news.update', 'news.delete'])
        ->each(fn (string $permission) => Permission::findOrCreate(
            $permission,
            'web'
        ));

    $this->user->givePermissionTo([
        'news.view',
        'news.create',
        'news.update',
        'news.delete',
    ]);

    Sanctum::actingAs($this->user);
});

it('requires authentication to access berita endpoints', function () {
    auth()->forgetGuards();

    $this->getJson('/api/v1/beritas')->assertUnauthorized();
});

it('can list beritas', function () {
    Berita::factory()->count(3)->create();

    $this->getJson('/api/v1/beritas')
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

it('can show a single berita', function () {
    $berita = Berita::factory()->create();

    $this->getJson("/api/v1/beritas/{$berita->id}")
        ->assertOk()
        ->assertJsonPath('data.berita.id', $berita->id)
        ->assertJsonPath('data.berita.title', $berita->title)
        ->assertJsonPath('data.berita.slug', $berita->slug);
});

it('can create a berita with image', function () {
    $payload = [
        'title' => 'RS Merdeka Luncurkan Layanan Baru',
        'slug' => 'rs-merdeka-luncurkan-layanan-baru',
        'description' => 'Layanan baru untuk pasien.',
        'image' => UploadedFile::fake()->image('berita.jpg', 800, 400),
    ];

    $this->post('/api/v1/beritas', $payload)
        ->assertCreated()
        ->assertJsonPath('data.berita.title', 'RS Merdeka Luncurkan Layanan Baru')
        ->assertJsonPath('data.berita.slug', 'rs-merdeka-luncurkan-layanan-baru');

    $this->assertDatabaseHas('beritas', [
        'title' => 'RS Merdeka Luncurkan Layanan Baru',
        'slug' => 'rs-merdeka-luncurkan-layanan-baru',
    ]);
});

it('validates required fields when creating a berita', function () {
    $this->postJson('/api/v1/beritas', [])
        ->assertStatus(422)
        ->assertJsonValidationErrors(['title', 'slug', 'image']);
});

it('validates slug format when creating a berita', function () {
    $this->postJson('/api/v1/beritas', [
        'title' => 'Judul Berita',
        'slug' => 'Judul Dengan Spasi',
        'image' => UploadedFile::fake()->image('berita.jpg'),
    ])
        ->assertStatus(422)
        ->assertJsonValidationErrors(['slug']);
});

it('can update a berita', function () {
    $berita = Berita::factory()->create();

    $this->putJson("/api/v1/beritas/{$berita->id}", [
        'title' => 'Judul Berita Diperbarui',
        'slug' => 'judul-berita-diperbarui',
    ])
        ->assertOk()
        ->assertJsonPath('data.berita.id', $berita->id)
        ->assertJsonPath('data.berita.title', 'Judul Berita Diperbarui');
});

it('can delete a berita', function () {
    $berita = Berita::factory()->create();

    $this->deleteJson("/api/v1/beritas/{$berita->id}")
        ->assertOk()
        ->assertJsonPath('success', true);

    $this->assertSoftDeleted('beritas', [
        'id' => $berita->id,
    ]);
});

it('denies access without permission', function () {
    $user = User::factory()->create();

    Sanctum::actingAs($user);

    $this->getJson('/api/v1/beritas')->assertForbidden();
});
