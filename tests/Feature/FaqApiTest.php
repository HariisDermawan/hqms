<?php

use App\Models\Faq;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->user = User::factory()->create();

    Sanctum::actingAs($this->user);
});

it('requires authentication to access faq endpoints', function () {
    auth()->forgetGuards();

    $this->getJson('/api/v1/faqs')->assertUnauthorized();
    $this->postJson('/api/v1/faqs')->assertUnauthorized();
    $this->getJson('/api/v1/faqs/1')->assertUnauthorized();
    $this->putJson('/api/v1/faqs/1')->assertUnauthorized();
    $this->deleteJson('/api/v1/faqs/1')->assertUnauthorized();
});

it('can list faqs', function () {
    Faq::factory()->count(3)->create();

    $this->getJson('/api/v1/faqs')
        ->assertOk()
        ->assertJsonPath('success', true)
        ->assertJsonCount(3, 'data.items');
});

it('can create a faq', function () {
    $this->postJson('/api/v1/faqs', [
        'question' => 'Bagaimana cara mendaftar?',
        'answer' => 'Datang langsung ke layanan pendaftaran.',
        'sort_order' => 2,
        'is_active' => true,
    ])
        ->assertCreated()
        ->assertJsonPath('success', true)
        ->assertJsonPath('data.faq.question', 'Bagaimana cara mendaftar?')
        ->assertJsonPath('data.faq.sort_order', 2)
        ->assertJsonPath('data.faq.is_active', true);

    $this->assertDatabaseHas('faqs', [
        'question' => 'Bagaimana cara mendaftar?',
    ]);
});

it('validates required fields when creating a faq', function () {
    $this->postJson('/api/v1/faqs', [])
        ->assertStatus(422)
        ->assertJsonValidationErrors(['question', 'answer']);
});

it('applies default values when optional fields are omitted', function () {
    $this->postJson('/api/v1/faqs', [
        'question' => 'Pertanyaan?',
        'answer' => 'Jawaban.',
    ])
        ->assertCreated()
        ->assertJsonPath('data.faq.sort_order', 0)
        ->assertJsonPath('data.faq.is_active', true);
});

it('can show a faq', function () {
    $faq = Faq::factory()->create();

    $this->getJson("/api/v1/faqs/{$faq->id}")
        ->assertOk()
        ->assertJsonPath('data.faq.id', $faq->id)
        ->assertJsonPath('data.faq.question', $faq->question);
});

it('can update a faq', function () {
    $faq = Faq::factory()->create();

    $this->putJson("/api/v1/faqs/{$faq->id}", [
        'question' => 'Pertanyaan baru',
        'answer' => 'Jawaban baru',
        'sort_order' => 5,
        'is_active' => false,
    ])
        ->assertOk()
        ->assertJsonPath('data.faq.question', 'Pertanyaan baru')
        ->assertJsonPath('data.faq.is_active', false);

    $this->assertDatabaseHas('faqs', [
        'id' => $faq->id,
        'question' => 'Pertanyaan baru',
    ]);
});

it('can delete a faq', function () {
    $faq = Faq::factory()->create();

    $this->deleteJson("/api/v1/faqs/{$faq->id}")
        ->assertOk()
        ->assertJsonPath('success', true);

    $this->assertSoftDeleted('faqs', ['id' => $faq->id]);
});
