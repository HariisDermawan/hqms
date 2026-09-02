<?php

namespace Database\Factories;

use App\Models\Antrian;
use App\Models\Dokter;
use App\Models\Pemeriksaan;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Pemeriksaan>
 */
class PemeriksaanFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'antrian_id' => Antrian::factory(),
            'dokter_id' => Dokter::factory(),
            'examined_at' => now(),
            'complaint' => $this->faker->sentence(),
            'diagnosis' => $this->faker->sentence(),
            'treatment' => $this->faker->sentence(),
            'notes' => $this->faker->sentence(),
        ];
    }
}
