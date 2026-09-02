<?php

use App\Models\Message;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->user = User::factory()->create();

    Sanctum::actingAs($this->user);
});

it('requires authentication to access message endpoints', function () {
    auth()->forgetGuards();

    $this->getJson('/api/v1/messages')->assertUnauthorized();
    $this->postJson('/api/v1/messages')->assertUnauthorized();
    $this->getJson('/api/v1/messages/1')->assertUnauthorized();
    $this->putJson('/api/v1/messages/1')->assertUnauthorized();
    $this->deleteJson('/api/v1/messages/1')->assertUnauthorized();
});

it('can list messages', function () {
    Message::factory()->count(3)->create();

    $this->getJson('/api/v1/messages')
        ->assertOk()
        ->assertJsonPath('success', true)
        ->assertJsonCount(3, 'data.items');
});

it('can create a message', function () {
    $this->postJson('/api/v1/messages', [
        'name' => 'Andi Saputra',
        'email' => 'andi@example.com',
        'phone' => '081234567890',
        'subject' => 'Pertanyaan Jadwal',
        'message' => 'Apakah ada jadwal praktik dokter umum?',
        'status' => 'unread',
    ])
        ->assertCreated()
        ->assertJsonPath('success', true)
        ->assertJsonPath('data.message.name', 'Andi Saputra')
        ->assertJsonPath('data.message.status', 'unread');

    $this->assertDatabaseHas('messages', [
        'email' => 'andi@example.com',
    ]);
});

it('validates required fields when creating a message', function () {
    $this->postJson('/api/v1/messages', [])
        ->assertStatus(422)
        ->assertJsonValidationErrors(['name', 'email', 'message']);
});

it('applies default status when omitted', function () {
    $this->postJson('/api/v1/messages', [
        'name' => 'Andi Saputra',
        'email' => 'andi@example.com',
        'message' => 'Pesan uji.',
    ])
        ->assertCreated()
        ->assertJsonPath('data.message.status', 'unread');
});

it('rejects an invalid status', function () {
    $this->postJson('/api/v1/messages', [
        'name' => 'Andi Saputra',
        'email' => 'andi@example.com',
        'message' => 'Pesan uji.',
        'status' => 'spam',
    ])
        ->assertStatus(422)
        ->assertJsonValidationErrors(['status']);
});

it('can show a message', function () {
    $message = Message::factory()->replied()->create();

    $this->getJson("/api/v1/messages/{$message->id}")
        ->assertOk()
        ->assertJsonPath('data.message.id', $message->id)
        ->assertJsonPath('data.message.status', 'replied')
        ->assertJsonPath('data.message.admin_reply', $message->admin_reply);
});

it('can update a message', function () {
    $message = Message::factory()->unread()->create();

    $this->putJson("/api/v1/messages/{$message->id}", [
        'status' => 'replied',
        'admin_reply' => 'Terima kasih atas pertanyaannya.',
    ])
        ->assertOk()
        ->assertJsonPath('data.message.status', 'replied')
        ->assertJsonPath(
            'data.message.admin_reply',
            'Terima kasih atas pertanyaannya.',
        );

    $this->assertDatabaseHas('messages', [
        'id' => $message->id,
        'status' => 'replied',
    ]);
});

it('can delete a message', function () {
    $message = Message::factory()->create();

    $this->deleteJson("/api/v1/messages/{$message->id}")
        ->assertOk()
        ->assertJsonPath('success', true);

    $this->assertSoftDeleted('messages', ['id' => $message->id]);
});
