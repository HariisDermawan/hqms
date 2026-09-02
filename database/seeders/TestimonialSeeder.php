<?php

namespace Database\Seeders;

use App\Models\Pasien;
use App\Models\Testimonial;
use Illuminate\Database\Seeder;

class TestimonialSeeder extends Seeder
{
    public function run(): void
    {
        $testimonials = [
            [
                'pasien_name' => 'Budi Santoso',
                'role' => 'Pasien',
                'message' => 'Pelayanan sangat baik dan proses pendaftaran mudah.',
                'rating' => 5,
                'sort_order' => 1,
                'is_active' => true,
            ],
            [
                'pasien_name' => 'Siti Aminah',
                'role' => 'Pasien',
                'message' => 'Informasi jadwal dokter sangat membantu saya.',
                'rating' => 5,
                'sort_order' => 2,
                'is_active' => true,
            ],
            [
                'pasien_name' => 'Andi Wijaya',
                'role' => 'Pasien',
                'message' => 'Sistemnya mudah digunakan dan informasi antrian jelas.',
                'rating' => 4,
                'sort_order' => 3,
                'is_active' => true,
            ],
        ];

        foreach ($testimonials as $testimonial) {
            $pasien = Pasien::where('name', $testimonial['pasien_name'])
                ->first();

            if (! $pasien) {
                $this->command->warn(
                    "Pasien '{$testimonial['pasien_name']}' tidak ditemukan. Testimoni dilewati."
                );

                continue;
            }

            Testimonial::updateOrCreate(
                [
                    'pasien_id' => $pasien->id,
                ],
                [
                    'name' => $pasien->name,
                    'role' => $testimonial['role'],
                    'message' => $testimonial['message'],
                    'rating' => $testimonial['rating'],
                    'sort_order' => $testimonial['sort_order'],
                    'is_active' => $testimonial['is_active'],
                ]
            );
        }

        $this->command->info(
            'TestimonialSeeder berhasil dijalankan.'
        );
    }
}
