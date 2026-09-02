<?php

namespace Database\Seeders;

use App\Models\Dokter;
use App\Models\Pasien;
use App\Models\Pemeriksaan;
use App\Models\Poli;
use Illuminate\Database\Seeder;

class PemeriksaanSeeder extends Seeder
{
    public function run(): void
    {
        $pasien = Pasien::first();

        if (! $pasien) {
            $this->command->warn(
                'Belum ada data pasien. Jalankan PasienSeeder terlebih dahulu.'
            );

            return;
        }

        $poli = $pasien->poli ?? Poli::first();

        if (! $poli) {
            $this->command->warn(
                'Belum ada data poli. Jalankan PoliSeeder terlebih dahulu.'
            );

            return;
        }

        $dokter = Dokter::first();

        Pemeriksaan::updateOrCreate(
            [
                'pasien_id' => $pasien->id,
                'poli_id' => $poli->id,
            ],
            [
                'dokter_id' => $dokter?->id,
                'category' => 'Umum',
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
