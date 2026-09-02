<?php

namespace Database\Factories;

use App\Models\Dokter;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Dokter>
 */
class DokterFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'code' => strtoupper(fake()->unique()->bothify('DR###')),
            'name' => $this->faker->name(),
            'specialization' => $this->faker->jobTitle(),
            'sip_number' => (string) $this->faker->unique()->numberBetween(
                100_000,
                999_999
            ),
            'phone' => $this->faker->numerify('08##########'),
            'image' => null,
            'is_active' => true,
        ];
    }
}
