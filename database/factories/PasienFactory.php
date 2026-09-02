<?php

namespace Database\Factories;

use App\Models\Pasien;
use App\Models\Poli;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Pasien>
 */
class PasienFactory extends Factory
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
            'medical_record_number' => fake()->unique()->numerify('RM######'),
            'name' => fake()->name(),
            'nik' => fake()->unique()->numerify('16################'),
            'gender' => fake()->randomElement(['L', 'P']),
            'birth_date' => fake()->date(),
            'age' => fake()->numberBetween(1, 90),
            'phone' => fake()->optional()->numerify('08##########'),
            'address' => fake()->optional()->address(),
            'is_active' => true,
        ];
    }
}
