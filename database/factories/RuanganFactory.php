<?php

namespace Database\Factories;

use App\Models\Fasilitas;
use App\Models\Ruangan;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Ruangan>
 */
class RuanganFactory extends Factory
{
    public function definition(): array
    {
        return [
            'code' => fake()->unique()->regexify('[A-Z]{2}-[0-9]{2}'),
            'name' => fake()->unique()->words(2, true),
            'facility_id' => Fasilitas::factory(),
            'description' => fake()->optional()->sentence(),
            'is_active' => true,
        ];
    }
}
