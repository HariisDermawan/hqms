<?php

namespace Database\Factories;

use App\Models\Obat;
use App\Models\Pemeriksaan;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Obat>
 */
class ObatFactory extends Factory
{
    public function definition(): array
    {
        return [
            'pemeriksaan_id' => Pemeriksaan::factory(),
            'nama_obat' => fake()->randomElement([
                'Paracetamol',
                'Amoxicillin',
                'Ibuprofen',
                'Omeprazole',
                'Cetirizine',
                'Vitamin C',
                'Salbutamol',
                'Metformin',
            ]),
            'dosis' => fake()->randomElement([
                '3x1',
                '2x1',
                '1x1',
                'sesuai anjuran',
            ]),
            'jumlah' => fake()->numberBetween(1, 10),
            'satuan' => fake()->randomElement([
                'strip',
                'botol',
                'blister',
                'tablet',
            ]),
            'harga' => fake()->randomFloat(2, 5000, 150000),
            'keterangan' => fake()->optional()->sentence(),
        ];
    }
}
