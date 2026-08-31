<?php

namespace Database\Seeders;

use App\Models\Faq;
use Illuminate\Database\Seeder;

class FaqSeeder extends Seeder
{
    public function run(): void
    {
        $faqs = [
            [
                'question' => 'Bagaimana cara melakukan pendaftaran pasien?',
                'answer' => 'Pasien dapat melakukan pendaftaran melalui layanan yang tersedia atau datang langsung ke fasilitas kesehatan.',
                'sort_order' => 1,
                'is_active' => true,
            ],
            [
                'question' => 'Bagaimana cara mengetahui nomor antrian?',
                'answer' => 'Nomor antrian dapat dilihat setelah proses pendaftaran berhasil dilakukan.',
                'sort_order' => 2,
                'is_active' => true,
            ],
            [
                'question' => 'Apakah saya dapat memilih poli saat mendaftar?',
                'answer' => 'Ya, pasien dapat memilih poli sesuai dengan kebutuhan layanan kesehatan yang tersedia.',
                'sort_order' => 3,
                'is_active' => true,
            ],
            [
                'question' => 'Bagaimana cara mengetahui jadwal dokter?',
                'answer' => 'Jadwal dokter dapat dilihat melalui halaman jadwal dokter pada sistem.',
                'sort_order' => 4,
                'is_active' => true,
            ],
            [
                'question' => 'Apakah data pasien aman?',
                'answer' => 'Data pasien dikelola dan disimpan oleh sistem dengan mekanisme keamanan yang diterapkan pada aplikasi.',
                'sort_order' => 5,
                'is_active' => true,
            ],
        ];

        foreach ($faqs as $faq) {
            Faq::updateOrCreate(
                [
                    'question' => $faq['question'],
                ],
                [
                    'answer' => $faq['answer'],
                    'sort_order' => $faq['sort_order'],
                    'is_active' => $faq['is_active'],
                ]
            );
        }

        $this->command->info('FaqSeeder berhasil dijalankan.');
    }
}
