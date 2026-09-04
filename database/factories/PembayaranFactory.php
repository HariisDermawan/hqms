<?php

namespace Database\Factories;

use App\Models\Pembayaran;
use App\Models\Pemeriksaan;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Pembayaran>
 */
class PembayaranFactory extends Factory
{
    public function definition(): array
    {
        return [
            'pemeriksaan_id' => Pemeriksaan::factory(),
            'invoice_number' => fake()->unique()->regexify(
                'INV-[0-9]{8}-[0-9]{3}'
            ),
            'total' => fake()->randomFloat(2, 50000, 2000000),
            'metode' => fake()->randomElement([
                'cash',
                'transfer',
                'debit',
                'credit',
                'qris',
            ]),
            'status' => fake()->randomElement([
                'unpaid',
                'paid',
                'refunded',
                'cancelled',
            ]),
            'tanggal' => now()->toDateString(),
            'detail_items' => [
                [
                    'description' => 'Jasa pemeriksaan',
                    'quantity' => 1,
                    'unit_price' => 150000,
                ],
                [
                    'description' => 'Obat Paracetamol',
                    'quantity' => 2,
                    'unit_price' => 25000,
                ],
            ],
            'keterangan' => fake()->optional()->sentence(),
        ];
    }
}
