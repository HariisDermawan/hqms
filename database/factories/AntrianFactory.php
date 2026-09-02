<?php

namespace Database\Factories;

use App\Models\Antrian;
use App\Models\Poli;
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
            'poli_id' => Poli::factory(),
            'queue_number' => fn (array $attrs) => sprintf(
                'A-%03d',
                $this->faker->unique()->numberBetween(1, 999)
            ),
            'status' => 'waiting',
            'called_at' => null,
            'started_at' => null,
            'completed_at' => null,
            'notes' => null,
        ];
    }
}
