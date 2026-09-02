<?php

namespace Database\Factories;

use App\Models\Antrian;
use App\Models\Pendaftaran;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Antrian>
 */
class AntrianFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'pendaftaran_id' => Pendaftaran::factory(),
            'poli_id' => fn (array $attrs) => Pendaftaran::query()
                ->findOrFail($attrs['pendaftaran_id'])
                ->poli_id,
            'queue_number' => fn (array $attrs) => Pendaftaran::query()
                ->findOrFail($attrs['pendaftaran_id'])
                ->queue_number,
            'status' => 'waiting',
            'called_at' => null,
            'started_at' => null,
            'completed_at' => null,
            'notes' => null,
        ];
    }
}
