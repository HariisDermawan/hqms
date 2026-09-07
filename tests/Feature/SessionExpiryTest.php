<?php

use App\Http\Middleware\EnsureSessionFreshness;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->user = User::factory()->create();
});

it('redirects to login when session has exceeded its lifetime', function () {
    Sanctum::actingAs($this->user);

    $this->withSession([
        EnsureSessionFreshness::LOGINED_AT_KEY =>
            now()->subMinutes(config('session.lifetime') + 1)->timestamp,
    ])->get('/dashboard')
        ->assertRedirect();
});

it('returns 401 JSON when session has exceeded its lifetime', function () {
    Sanctum::actingAs($this->user);

    $this->withSession([
        EnsureSessionFreshness::LOGINED_AT_KEY =>
            now()->subMinutes(config('session.lifetime') + 1)->timestamp,
    ])->getJson('/api/v1/me')
        ->assertUnauthorized()
        ->assertJsonStructure([
            'success',
            'message',
            'data',
        ]);
});

it('keeps fresh session alive', function () {
    Sanctum::actingAs($this->user);

    $this->withSession([
        EnsureSessionFreshness::LOGINED_AT_KEY => now()->timestamp,
    ])->getJson('/api/v1/me')
        ->assertOk();
});
