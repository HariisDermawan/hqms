<?php

namespace Database\Seeders;

use App\Models\Antrian;
use App\Models\Dokter;
use App\Models\Pemeriksaan;
use Illuminate\Database\Seeder;

class PemeriksaanSeeder extends Seeder
{
    public function run(): void
    {
        $antrian = Antrian::first();

        if (! $antrian) {
            $this->command->warn(
                'Belum ada data antrian. Jalankan AntrianSeeder terlebih dahulu.'
            );

            return;
        }

        $dokter = Dokter::first();

        if (! $dokter) {
            $this->command->warn(
                'Belum ada data dokter. Jalankan DokterSeeder terlebih dahulu.'
            );

            return;
        }

        Pemeriksaan::updateOrCreate(
            [
                'antrian_id' => $antrian->id,
            ],
            [
                'dokter_id' => $dokter->id,
                'examined_at' => now(),
                'complaint' => 'Demam dan sakit kepala',
                'diagnosis' => 'Infeksi saluran pernapasan ringan',
                'treatment' => 'Istirahat dan minum obat sesuai aturan',
                'notes' => 'Pasien disarankan kontrol kembali jika keluhan berlanjut.',
            ]
        );

        $this->command->info(
            'PemeriksaanSeeder berhasil dijalankan.'
        );
    }
}
