<?php

use App\Models\Fasilitas;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Laravel\Sanctum\Sanctum;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->user = User::factory()->create();

    Sanctum::actingAs($this->user);
});

it('requires authentication to access fasilitas endpoints', function () {
    auth()->forgetGuards();

    $this->getJson('/api/v1/fasilitas')->assertUnauthorized();
    $this->postJson('/api/v1/fasilitas')->assertUnauthorized();
    $this->getJson('/api/v1/fasilitas/1')->assertUnauthorized();
    $this->putJson('/api/v1/fasilitas/1')->assertUnauthorized();
    $this->deleteJson('/api/v1/fasilitas/1')->assertUnauthorized();
});

it('can list fasilitas', function () {
    Fasilitas::factory()->count(3)->create();

    $this->getJson('/api/v1/fasilitas')
        ->assertOk()
        ->assertJsonPath('success', true)
        ->assertJsonCount(3, 'data.items');
});

it('can create a fasilitas', function () {
    $this->postJson('/api/v1/fasilitas', [
        'name' => 'Unit Gawat Darurat',
        'slug' => 'ugd-igd',
        'description' => 'Layanan gawat darurat 24 jam.',
        'is_active' => true,
    ])
        ->assertCreated()
        ->assertJsonPath('success', true)
        ->assertJsonPath('data.fasilitas.name', 'Unit Gawat Darurat')
        ->assertJsonPath('data.fasilitas.slug', 'ugd-igd')
        ->assertJsonPath('data.fasilitas.is_active', true)
        ->assertJsonPath('data.fasilitas.image_url', null);

    $this->assertDatabaseHas('fasilitas', [
        'name' => 'Unit Gawat Darurat',
        'slug' => 'ugd-igd',
    ]);
});

it('can create a fasilitas with an image', function () {
    $this->post('/api/v1/fasilitas', [
        'name' => 'Unit Gawat Darurat',
        'slug' => 'ugd-igd',
        'description' => 'Layanan gawat darurat 24 jam.',
        'image' => UploadedFile::fake()->image('fasilitas.jpg', 800, 400),
    ])
        ->assertCreated()
        ->assertJsonPath('success', true)
        ->assertJsonPath('data.fasilitas.name', 'Unit Gawat Darurat')
        ->assertJsonPath('data.fasilitas.image_url', fn (string $url) => str_contains($url, '/storage/fasilitas/'));

    $this->assertDatabaseHas('fasilitas', [
        'name' => 'Unit Gawat Darurat',
        'slug' => 'ugd-igd',
    ]);
});

it('validates required fields when creating a fasilitas', function () {
    $this->postJson('/api/v1/fasilitas', [])
        ->assertStatus(422)
        ->assertJsonValidationErrors(['name', 'slug']);
});

it('rejects a duplicate fasilitas slug', function () {
    Fasilitas::factory()->create(['slug' => 'ugd-igd']);

    $this->postJson('/api/v1/fasilitas', [
        'name' => 'UGD',
        'slug' => 'ugd-igd',
    ])
        ->assertStatus(422)
        ->assertJsonValidationErrors(['slug']);
});

it('can show a fasilitas with its ruangans', function () {
    $fasilitas = Fasilitas::factory()->create([
        'name' => 'Rawat Inap',
    ]);

    $this->getJson("/api/v1/fasilitas/{$fasilitas->id}")
        ->assertOk()
        ->assertJsonPath('data.fasilitas.id', $fasilitas->id)
        ->assertJsonPath('data.fasilitas.name', 'Rawat Inap')
        ->assertJsonPath('data.fasilitas.is_active', true)
        ->assertJsonCount(0, 'data.ruangans');
});

it('can show a fasilitas by slug', function () {
    $fasilitas = Fasilitas::factory()->create([
        'slug' => 'rawat-inap',
    ]);

    $this->getJson("/api/v1/fasilitas/{$fasilitas->slug}")
        ->assertOk()
        ->assertJsonPath('data.fasilitas.id', $fasilitas->id)
        ->assertJsonPath('data.fasilitas.slug', 'rawat-inap');
});

it('can update a fasilitas', function () {
    $fasilitas = Fasilitas::factory()->create();

    $this->putJson("/api/v1/fasilitas/{$fasilitas->id}", [
        'name' => 'Rawat Jalan Baru',
        'slug' => 'rawat-jalan-baru',
        'description' => 'Deskripsi baru.',
        'is_active' => false,
    ])
        ->assertOk()
        ->assertJsonPath('data.fasilitas.name', 'Rawat Jalan Baru')
        ->assertJsonPath('data.fasilitas.slug', 'rawat-jalan-baru')
        ->assertJsonPath('data.fasilitas.is_active', false)
        ->assertJsonPath('data.fasilitas.image_url', null);

    $this->assertDatabaseHas('fasilitas', [
        'id' => $fasilitas->id,
        'name' => 'Rawat Jalan Baru',
        'slug' => 'rawat-jalan-baru',
    ]);
});

it('can update a fasilitas with an image', function () {
    $fasilitas = Fasilitas::factory()->create();

    $this->put('/api/v1/fasilitas/'.$fasilitas->id, [
        'name' => 'Rawat Jalan Baru',
        'slug' => 'rawat-jalan-baru',
        'image' => UploadedFile::fake()->image('fasilitas.jpg', 800, 400),
    ])
        ->assertOk()
        ->assertJsonPath('data.fasilitas.slug', 'rawat-jalan-baru')
        ->assertJsonPath('data.fasilitas.image_url', fn (string $url) => str_contains($url, '/storage/fasilitas/'));
});

it('can delete a fasilitas', function () {
    $fasilitas = Fasilitas::factory()->create();

    $this->deleteJson("/api/v1/fasilitas/{$fasilitas->id}")
        ->assertOk()
        ->assertJsonPath('success', true);

    $this->assertDatabaseMissing('fasilitas', ['id' => $fasilitas->id]);
});

it('lists only active fasilitas publicly via kiosk', function () {
    $active = Fasilitas::factory()->create([
        'name' => 'UGD',
        'is_active' => true,
    ]);
    Fasilitas::factory()->create(['is_active' => false]);

    $this->getJson('/api/v1/kiosk/fasilitas')
        ->assertOk()
        ->assertJsonPath('success', true)
        ->assertJsonCount(1, 'data.items')
        ->assertJsonPath('data.items.0.id', $active->id);
});
