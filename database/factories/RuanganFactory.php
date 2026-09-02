<?php

namespace Database\Factories;

use App\Models\Ruangan;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Ruangan>
 */
class RuanganFactory extends Factory
{
    public function definition(): array
    {
        $categories = [
            'Poli',
            'IGD',
            'Ruang Rawat Inap',
            'Kamar VIP',
            'Kamar Kelas 1',
            'Kamar Kelas 2',
            'Kamar Kelas 3',
            'Isolasi',
            'ICU',
            'NICU',
            'PICU',
            'Ruang Operasi',
        ];

        return [
            'code' => fake()->unique()->regexify('[A-Z]{2}-[0-9]{2}'),
            'name' => fake()->unique()->words(2, true),
            'category' => fake()->randomElement($categories),
            'description' => fake()->optional()->sentence(),
            'is_active' => true,
        ];
    }
}
