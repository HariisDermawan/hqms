<?php

namespace Database\Factories;

use App\Models\Perawat;
use Illuminate\Database\Eloquent\Factories\Factory;

class PresensiFactory extends Factory
{
    public function definition(): array
    {
        return [
            'perawat_id' => Perawat::factory(),
            'date' => fake()->date(),
            'time_in' => $this->faker->time('H:i'),
            'time_out' => $this->faker->time('H:i'),
            'status' => 'hadir',
            'note' => null,
        ];
    }
}
