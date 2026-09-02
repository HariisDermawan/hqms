<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\Sanctum;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->user = User::factory()->create([
        'name' => 'Haris Darmawan',
        'email' => 'haris@hqms',
    ]);

    Sanctum::actingAs($this->user);
});

it('requires authentication to access profile endpoints', function () {
    auth()->forgetGuards();

    $this->getJson('/api/v1/auth/me')->assertUnauthorized();
    $this->putJson('/api/v1/auth/me')->assertUnauthorized();
    $this->postJson('/api/v1/auth/me/password')->assertUnauthorized();
});

it('can view the authenticated user profile', function () {
    $this->getJson('/api/v1/auth/me')
        ->assertOk()
        ->assertJsonPath('data.user.id', $this->user->id)
        ->assertJsonPath('data.user.name', 'Haris Darmawan')
        ->assertJsonPath('data.user.email', 'haris@hqms');
});

it('can update the profile name and email', function () {
    $this->putJson('/api/v1/auth/me', [
        'name' => 'Nama Baru',
        'email' => 'baru@hqms',
    ])
        ->assertOk()
        ->assertJsonPath('data.user.name', 'Nama Baru')
        ->assertJsonPath('data.user.email', 'baru@hqms');

    $this->assertDatabaseHas('users', [
        'id' => $this->user->id,
        'name' => 'Nama Baru',
        'email' => 'baru@hqms',
    ]);
});

it('validates required fields when updating the profile', function () {
    $this->putJson('/api/v1/auth/me', [])
        ->assertStatus(422)
        ->assertJsonValidationErrors(['name', 'email']);
});

it('rejects a duplicate email owned by another user', function () {
    User::factory()->create(['email' => 'saingan@hqms']);

    $this->putJson('/api/v1/auth/me', [
        'name' => 'Haris Darmawan',
        'email' => 'saingan@hqms',
    ])
        ->assertStatus(422)
        ->assertJsonValidationErrors(['email']);
});

it('allows keeping the current email when updating profile', function () {
    $this->putJson('/api/v1/auth/me', [
        'name' => 'Haris Darmawan',
        'email' => 'haris@hqms',
    ])
        ->assertOk()
        ->assertJsonPath('data.user.email', 'haris@hqms');
});

it('can update the password with the correct current password', function () {
    $this->postJson('/api/v1/auth/me/password', [
        'current_password' => 'password',
        'password' => 'password-baru',
        'password_confirmation' => 'password-baru',
    ])
        ->assertOk()
        ->assertJsonPath('success', true);

    $this->user->refresh();

    expect(Hash::check('password-baru', $this->user->password))->toBeTrue();
});

it('rejects an update password with a wrong current password', function () {
    $this->postJson('/api/v1/auth/me/password', [
        'current_password' => 'salah',
        'password' => 'password-baru',
        'password_confirmation' => 'password-baru',
    ])
        ->assertStatus(422)
        ->assertJsonValidationErrors(['current_password']);

    $this->user->refresh();

    expect(Hash::check('password', $this->user->password))->toBeTrue();
});

it('rejects a short new password', function () {
    $this->postJson('/api/v1/auth/me/password', [
        'current_password' => 'password',
        'password' => 'short',
        'password_confirmation' => 'short',
    ])
        ->assertStatus(422)
        ->assertJsonValidationErrors(['password']);
});
