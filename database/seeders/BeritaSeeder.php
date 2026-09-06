<?php

namespace Database\Seeders;

use App\Models\Berita;
use Illuminate\Database\Seeder;

class BeritaSeeder extends Seeder
{
    public function run(): void
    {
        $beritas = [
            [
                'title' => 'RS Merdeka Luncurkan Layanan Kesehatan Digital',
                'slug' => 'rs-merdeka-luncurkan-layanan-kesehatan-digital',
                'description' => 'Rumah Sakit Merdeka kini menghadirkan layanan kesehatan digital yang memudahkan pasien mengakses antrean, pendaftaran, dan konsultasi secara online.',
                'image' => 'beritas/default.jpg',
            ],
            [
                'title' => 'Dokter Spesialis Baru Hadir di Poli Jantung',
                'slug' => 'dokter-spesialis-baru-hadir-di-poli-jantung',
                'description' => 'Poli Jantung RS Merdeka kedatangan dokter spesialis jantung baru untuk mempercepat pelayanan penanganan penyakit kardiovaskular.',
                'image' => 'beritas/default.jpg',
            ],
            [
                'title' => 'Program Skrining Kesehatan Gratis Setiap Sabtu',
                'slug' => 'program-skrining-kesehatan-gratis-setiap-sabtu',
                'description' => 'RS Merdeka mengadakan program skrining kesehatan gratis setiap hari Sabtu untuk warga sekitar. Daftar melalui loket pendaftaran.',
                'image' => 'beritas/default.jpg',
            ],
        ];

        foreach ($beritas as $berita) {
            Berita::updateOrCreate(
                ['slug' => $berita['slug']],
                $berita
            );
        }
    }
}
