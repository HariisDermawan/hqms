<?php

use App\Models\Pasien;
use App\Models\Ruangan;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->user = User::factory()->create();

    Sanctum::actingAs($this->user);
});

it('requires authentication to access ruangan endpoints', function () {
    auth()->forgetGuards();

    $this->getJson('/api/v1/ruangans')->assertUnauthorized();
    $this->postJson('/api/v1/ruangans')->assertUnauthorized();
    $this->getJson('/api/v1/ruangans/1')->assertUnauthorized();
    $this->putJson('/api/v1/ruangans/1')->assertUnauthorized();
    $this->deleteJson('/api/v1/ruangans/1')->assertUnauthorized();
});

it('can list ruangans', function () {
    Ruangan::factory()->count(3)->create();

    $this->getJson('/api/v1/ruangans')
        ->assertOk()
        ->assertJsonPath('success', true)
        ->assertJsonCount(3, 'data.items');
});

it('can create a ruangan', function () {
    $this->postJson('/api/v1/ruangans', [
        'code' => 'A-01',
        'name' => 'Ruang Anggrek 01',
        'category' => 'Kamar VIP',
        'description' => 'Kamar VIP.',
        'is_active' => true,
    ])
        ->assertCreated()
        ->assertJsonPath('success', true)
        ->assertJsonPath('data.ruangan.name', 'Ruang Anggrek 01')
        ->assertJsonPath('data.ruangan.code', 'A-01')
        ->assertJsonPath('data.ruangan.category', 'Kamar VIP')
        ->assertJsonPath('data.ruangan.is_active', true);

    $this->assertDatabaseHas('ruangans', [
        'name' => 'Ruang Anggrek 01',
        'code' => 'A-01',
    ]);
});

it('validates required fields when creating a ruangan', function () {
    $this->postJson('/api/v1/ruangans', [])
        ->assertStatus(422)
        ->assertJsonValidationErrors(['code', 'name', 'category']);
});

it('rejects a duplicate ruangan code', function () {
    Ruangan::factory()->create(['code' => 'A-01']);

    $this->postJson('/api/v1/ruangans', [
        'code' => 'A-01',
        'name' => 'Ruang Anggrek 02',
        'category' => 'Kamar VIP',
    ])
        ->assertStatus(422)
        ->assertJsonValidationErrors(['code']);
});

it('can show a ruangan', function () {
    $ruangan = Ruangan::factory()->create([
        'name' => 'Ruang ICU',
    ]);

    $this->getJson("/api/v1/ruangans/{$ruangan->id}")
        ->assertOk()
        ->assertJsonPath('data.ruangan.id', $ruangan->id)
        ->assertJsonPath('data.ruangan.name', 'Ruang ICU')
        ->assertJsonPath('data.ruangan.is_active', true);
});

it('can update a ruangan', function () {
    $ruangan = Ruangan::factory()->create();

    $this->putJson("/api/v1/ruangans/{$ruangan->id}", [
        'code' => 'B-02',
        'name' => 'Ruang Mawar 02',
        'category' => 'Kamar Kelas 1',
        'description' => 'Kamar Kelas 1 baru.',
        'is_active' => false,
    ])
        ->assertOk()
        ->assertJsonPath('data.ruangan.name', 'Ruang Mawar 02')
        ->assertJsonPath('data.ruangan.code', 'B-02')
        ->assertJsonPath('data.ruangan.is_active', false);

    $this->assertDatabaseHas('ruangans', [
        'id' => $ruangan->id,
        'name' => 'Ruang Mawar 02',
        'code' => 'B-02',
    ]);
});

it('can delete a ruangan', function () {
    $ruangan = Ruangan::factory()->create();

    $this->deleteJson("/api/v1/ruangans/{$ruangan->id}")
        ->assertOk()
        ->assertJsonPath('success', true);

    $this->assertSoftDeleted('ruangans', ['id' => $ruangan->id]);
});

it('can assign a pasien to a ruangan', function () {
    $ruangan = Ruangan::factory()->create();
    $pasien = Pasien::factory()->create();

    $this->postJson(
        "/api/v1/ruangans/{$ruangan->id}/pasiens",
        ['pasien_id' => $pasien->id],
    )
        ->assertCreated()
        ->assertJsonPath('success', true)
        ->assertJsonPath('data.item.name', $pasien->name)
        ->assertJsonPath('data.item.mrn', $pasien->medical_record_number)
        ->assertJsonPath('data.item.gender', $pasien->gender)
        ->assertJsonPath('data.item.age', $pasien->age);

    $this->assertDatabaseHas('ruangan_pasien', [
        'ruangan_id' => $ruangan->id,
        'pasien_id' => $pasien->id,
        'pasien_name' => $pasien->name,
    ]);
});

it('validates pasien_id when assigning', function () {
    $ruangan = Ruangan::factory()->create();

    $this->postJson(
        "/api/v1/ruangans/{$ruangan->id}/pasiens",
        ['pasien_id' => 9999],
    )
        ->assertStatus(422)
        ->assertJsonValidationErrors(['pasien_id']);
});

it('shows pasiens already assigned to a ruangan', function () {
    $ruangan = Ruangan::factory()->create();
    $pasien = Pasien::factory()->create();

    $ruangan->ruanganPasiens()->create([
        'pasien_id' => $pasien->id,
        'pasien_name' => $pasien->name,
        'pasien_mrn' => $pasien->medical_record_number,
        'pasien_gender' => $pasien->gender,
        'pasien_age' => $pasien->age,
        'tanggal_masuk' => now()->toDateString(),
    ]);

    $this->getJson("/api/v1/ruangans/{$ruangan->id}")
        ->assertOk()
        ->assertJsonCount(1, 'data.ruangan.pasiens')
        ->assertJsonPath('data.ruangan.pasiens.0.name', $pasien->name);
});

it('can remove a pasien from a ruangan', function () {
    $ruangan = Ruangan::factory()->create();
    $pasien = Pasien::factory()->create();

    $item = $ruangan->ruanganPasiens()->create([
        'pasien_id' => $pasien->id,
        'pasien_name' => $pasien->name,
        'pasien_mrn' => $pasien->medical_record_number,
        'pasien_gender' => $pasien->gender,
        'pasien_age' => $pasien->age,
        'tanggal_masuk' => now()->toDateString(),
    ]);

    $this->deleteJson(
        "/api/v1/ruangans/{$ruangan->id}/pasiens/{$item->id}",
    )
        ->assertOk()
        ->assertJsonPath('success', true);

    $this->assertNotNull(
        $item->fresh()->tanggal_keluar,
    );
});

it('exposes a pasien assigned room in pasien detail', function () {
    $ruangan = Ruangan::factory()->create([
        'name' => 'Ruang Mawar 01',
        'category' => 'Kamar Kelas 1',
    ]);
    $pasien = Pasien::factory()->create();

    $item = $ruangan->ruanganPasiens()->create([
        'pasien_id' => $pasien->id,
        'pasien_name' => $pasien->name,
        'pasien_mrn' => $pasien->medical_record_number,
        'pasien_gender' => $pasien->gender,
        'pasien_age' => $pasien->age,
        'tanggal_masuk' => now()->toDateString(),
    ]);

    $this->getJson("/api/v1/pasiens/{$pasien->id}")
        ->assertOk()
        ->assertJsonCount(1, 'data.pasien.ruangans')
        ->assertJsonPath('data.pasien.ruangans.0.name', 'Ruang Mawar 01')
        ->assertJsonPath('data.pasien.ruangans.0.category', 'Kamar Kelas 1');
});
