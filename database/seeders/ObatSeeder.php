<?php

namespace Database\Seeders;

use App\Models\Obat;
use App\Models\Pemeriksaan;
use Illuminate\Database\Seeder;

class ObatSeeder extends Seeder
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

        $obats = [
            [
                'nama_obat' => 'Paracetamol',
                'dosis' => '3x1',
                'jumlah' => 2,
                'satuan' => 'strip',
                'harga' => 25000,
                'keterangan' => 'Diminum setelah makan.',
            ],
            [
                'nama_obat' => 'Amoxicillin',
                'dosis' => '2x1',
                'jumlah' => 1,
                'satuan' => 'strip',
                'harga' => 45000,
                'keterangan' => 'Habiskan sesuai resep.',
            ],
            [
                'nama_obat' => 'Vitamin C',
                'dosis' => '1x1',
                'jumlah' => 1,
                'satuan' => 'botol',
                'harga' => 30000,
                'keterangan' => 'Untuk pemulihan daya tahan tubuh.',
            ],
        ];

        foreach ($obats as $obat) {
            Obat::updateOrCreate(
                [
                    'pemeriksaan_id' => $pemeriksaan->id,
                    'nama_obat' => $obat['nama_obat'],
                ],
                $obat
            );
        }

        $this->command->info(
            'ObatSeeder berhasil dijalankan.'
        );
    }
}
