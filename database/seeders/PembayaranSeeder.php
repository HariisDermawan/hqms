<?php

namespace Database\Seeders;

use App\Models\Pembayaran;
use App\Models\Pemeriksaan;
use Illuminate\Database\Seeder;

class PembayaranSeeder extends Seeder
{
    public function run(): void
    {
        $pemeriksaan = Pemeriksaan::first();

        if (! $pemeriksaan) {
            $this->command->warn(
                'Belum ada data pemeriksaan. Jalankan PemeriksaanSeeder terlebih dahulu.'
            );

            return;
        }

        $pembayaran = Pembayaran::updateOrCreate(
            [
                'pemeriksaan_id' => $pemeriksaan->id,
            ],
            [
                'invoice_number' => 'INV-'.now()->format('Ymd').'-001',
                'total' => 250000,
                'metode' => 'cash',
                'status' => 'paid',
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
                    [
                        'description' => 'Obat Vitamin C',
                        'quantity' => 1,
                        'unit_price' => 30000,
                    ],
                ],
                'keterangan' => 'Pembayaran tunai di kasir.',
            ]
        );

        $this->command->info(
            'PembayaranSeeder berhasil dijalankan: '.$pembayaran->invoice_number
        );
    }
}
