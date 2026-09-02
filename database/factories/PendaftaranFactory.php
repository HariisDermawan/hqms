<?php

namespace Database\Factories;

use App\Models\Pasien;
use App\Models\Pendaftaran;
use App\Models\Poli;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Pendaftaran>
 */
class PendaftaranFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $poli = Poli::factory()->create([
            'queue_prefix' => 'A',
        ]);

        $sequence = sprintf('%03d', fake()->unique()->numberBetween(1, 999));

        return [
            'pasien_id' => Pasien::factory(),
            'poli_id' => $poli->id,
            'registration_number' => 'REG-'.now()->format('Ymd').'-A'.$sequence,
            'queue_number' => "A-{$sequence}",
            'registration_date' => now()->toDateString(),
            'status' => 'waiting',
            'notes' => null,
        ];
    }
}
