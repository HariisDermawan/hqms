<?php

namespace Database\Seeders;

use App\Models\Fasilitas;
use Illuminate\Database\Seeder;

class FasilitasSeeder extends Seeder
{
    public function run(): void
    {
        $fasilitas = [
            ['name' => 'Unit Gawat Darurat', 'slug' => 'ugd-igd', 'description' => 'Penanganan pasien darurat 24 jam.', 'is_active' => true],
            ['name' => 'Instalasi Rawat Jalan', 'slug' => 'irj', 'description' => 'Pelayanan pemeriksaan dan pengobatan jalan.', 'is_active' => true],
            ['name' => 'Instalasi Rawat Inap', 'slug' => 'iri', 'description' => 'Perawatan pasien menginap dengan berbagai kelas kamar.', 'is_active' => true],
            ['name' => 'Unit Perawatan Intensif', 'slug' => 'icu-hdu-nicu', 'description' => 'ICU, HDU, NICU — perawatan intensif pasien kritis.', 'is_active' => true],
            ['name' => 'Kamar Operasi', 'slug' => 'ok', 'description' => 'Ruang operasi bedah umum dan spesialis.', 'is_active' => true],
            ['name' => 'Penunjang Medis', 'slug' => 'penunjang-medis', 'description' => 'Laboratorium klinik, radiologi (Rontgen, USG, CT Scan), dan farmasi/apotek 24 jam.', 'is_active' => true],
            ['name' => 'Fasilitas Umum & Pendukung', 'slug' => 'umum', 'description' => 'Fasilitas pendukung: kasir, pendaftaran, mushola, kantin, parkir.', 'is_active' => true],
        ];

        foreach ($fasilitas as $item) {
            Fasilitas::updateOrCreate(
                ['slug' => $item['slug']],
                $item,
            );
        }
    }
}
