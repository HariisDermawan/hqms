<?php

namespace Database\Factories;

use App\Models\Dokter;
use App\Models\Pasien;
use App\Models\Pemeriksaan;
use App\Models\Poli;
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
            'pasien_id' => Pasien::factory(),
            'poli_id' => Poli::factory(),
            'dokter_id' => Dokter::factory(),
            'category' => fake()->randomElement([
                'Umum',
                'Gigi',
                'Anak',
                'Mata',
                'THT',
                'Kandungan',
                'Bedah',
            ]),
            'examined_at' => now(),
            'complaint' => $this->faker->sentence(),
            'diagnosis' => $this->faker->sentence(),
            'treatment' => $this->faker->sentence(),
            'notes' => $this->faker->sentence(),
        ];
    }
}
