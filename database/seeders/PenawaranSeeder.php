<?php

namespace Database\Seeders;

use App\Models\Penawaran;
use Illuminate\Database\Seeder;

class PenawaranSeeder extends Seeder
{
    public function run(): void
    {
        $penawarans = [
            [
                'title' => 'Paket Medical Check-Up Hemat',
                'slug' => 'paket-medical-check-up-hemat',
                'description' => 'Dapatkan pemeriksaan kesehatan menyeluruh dengan harga spesial selama bulan ini. Konsultasikan kebutuhan Anda dengan tim medis kami.',
            ],
            [
                'title' => 'Diskon Konsultasi Dokter Spesialis',
                'slug' => 'diskon-konsultasi-dokter-spesialis',
                'description' => 'Nikmati potongan biaya konsultasi untuk dokter spesialis jantung, kandungan, dan anak. Berlaku untuk pendaftaran online.',
            ],
            [
                'title' => 'Promo Vaksinasi Gratis',
                'slug' => 'promo-vaksinasi-gratis',
                'description' => 'Vaksinasi gratis untuk warga yang memenuhi kriteria. Daftar melalui loket pendaftaran atau aplikasi RS Merdeka.',
            ],
        ];

        foreach ($penawarans as $penawaran) {
            Penawaran::updateOrCreate(
                ['slug' => $penawaran['slug']],
                $penawaran
            );
        }
    }
}
