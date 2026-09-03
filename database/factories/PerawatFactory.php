<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class PerawatFactory extends Factory
{
    public function definition(): array
    {
        return [
            'code' => strtoupper(fake()->unique()->bothify('PRW###')),
            'name' => $this->faker->name(),
            'gender' => fake()->randomElement(['L', 'P']),
            'str_number' => (string) $this->faker->unique()->numberBetween(
                100_000,
                999_999
            ),
            'rfid_id' => null,
            'phone' => $this->faker->numerify('08##########'),
            'image' => null,
            'is_active' => true,
        ];
    }
}
