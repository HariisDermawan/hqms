<?php

namespace Database\Factories;

use App\Models\Poli;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Poli>
 */
class PoliFactory extends Factory
{
    public function definition(): array
    {
        $prefixes = range('A', 'Z');

        return [
            'code' => fake()->unique()->regexify('[A-Z]{3}[0-9]{2}'),
            'queue_prefix' => fake()->unique()->randomElement($prefixes),
            'name' => fake()->unique()->words(2, true),
            'description' => fake()->optional()->sentence(),
            'is_active' => true,
        ];
    }
}
