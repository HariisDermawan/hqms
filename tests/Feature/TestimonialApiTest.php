<?php

use App\Models\Pasien;
use App\Models\Testimonial;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->user = User::factory()->create();

    Sanctum::actingAs($this->user);
});

it('requires authentication to access testimonial endpoints', function () {
    auth()->forgetGuards();

    $this->getJson('/api/v1/testimonials')->assertUnauthorized();
    $this->postJson('/api/v1/testimonials')->assertUnauthorized();
    $this->getJson('/api/v1/testimonials/1')->assertUnauthorized();
    $this->putJson('/api/v1/testimonials/1')->assertUnauthorized();
    $this->deleteJson('/api/v1/testimonials/1')->assertUnauthorized();
});

it('can list testimonials', function () {
    Testimonial::factory()->count(3)->create();

    $this->getJson('/api/v1/testimonials')
        ->assertOk()
        ->assertJsonPath('success', true)
        ->assertJsonCount(3, 'data.items');
});

it('can create a testimonial', function () {
    $this->postJson('/api/v1/testimonials', [
        'name' => 'Budi Santoso',
        'role' => 'Pasien',
        'message' => 'Pelayanan sangat baik.',
        'rating' => 5,
        'sort_order' => 2,
        'is_active' => true,
    ])
        ->assertCreated()
        ->assertJsonPath('success', true)
        ->assertJsonPath('data.testimonial.name', 'Budi Santoso')
        ->assertJsonPath('data.testimonial.rating', 5)
        ->assertJsonPath('data.testimonial.sort_order', 2)
        ->assertJsonPath('data.testimonial.is_active', true);

    $this->assertDatabaseHas('testimonials', [
        'name' => 'Budi Santoso',
        'rating' => 5,
    ]);
});

it('validates required fields when creating a testimonial', function () {
    $this->postJson('/api/v1/testimonials', [])
        ->assertStatus(422)
        ->assertJsonValidationErrors(['name', 'message', 'rating']);
});

it('rejects a rating outside the valid range', function () {
    $this->postJson('/api/v1/testimonials', [
        'name' => 'Budi Santoso',
        'message' => 'Pelayanan sangat baik.',
        'rating' => 6,
    ])
        ->assertStatus(422)
        ->assertJsonValidationErrors(['rating']);
});

it('links a testimonial to a pasien', function () {
    $pasien = Pasien::factory()->create();

    $this->postJson('/api/v1/testimonials', [
        'pasien_id' => $pasien->id,
        'name' => $pasien->name,
        'role' => 'Pasien',
        'message' => 'Pelayanan sangat baik.',
        'rating' => 5,
    ])
        ->assertCreated()
        ->assertJsonPath(
            'data.testimonial.pasien.id',
            $pasien->id,
        )
        ->assertJsonPath(
            'data.testimonial.pasien.name',
            $pasien->name,
        );

    $this->assertDatabaseHas('testimonials', [
        'pasien_id' => $pasien->id,
    ]);
});

it('can show a testimonial', function () {
    $testimonial = Testimonial::factory()->create([
        'name' => 'Siti Aminah',
    ]);

    $this->getJson("/api/v1/testimonials/{$testimonial->id}")
        ->assertOk()
        ->assertJsonPath('data.testimonial.id', $testimonial->id)
        ->assertJsonPath('data.testimonial.name', 'Siti Aminah')
        ->assertJsonPath(
            'data.testimonial.pasien.id',
            $testimonial->pasien_id,
        );
});

it('can update a testimonial', function () {
    $testimonial = Testimonial::factory()->create();

    $this->putJson("/api/v1/testimonials/{$testimonial->id}", [
        'name' => 'Nama Baru',
        'message' => 'Pesan baru.',
        'rating' => 4,
        'is_active' => false,
    ])
        ->assertOk()
        ->assertJsonPath('data.testimonial.name', 'Nama Baru')
        ->assertJsonPath('data.testimonial.rating', 4)
        ->assertJsonPath('data.testimonial.is_active', false);

    $this->assertDatabaseHas('testimonials', [
        'id' => $testimonial->id,
        'name' => 'Nama Baru',
    ]);
});

it('can delete a testimonial', function () {
    $testimonial = Testimonial::factory()->create();

    $this->deleteJson("/api/v1/testimonials/{$testimonial->id}")
        ->assertOk()
        ->assertJsonPath('success', true);

    $this->assertSoftDeleted('testimonials', ['id' => $testimonial->id]);
});
