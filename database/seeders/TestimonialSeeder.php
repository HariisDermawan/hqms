<?php

namespace Database\Seeders;

use App\Models\Testimonial;
use Illuminate\Database\Seeder;

class TestimonialSeeder extends Seeder
{
    public function run(): void
    {
        $testimonials = [
            [
                'name' => 'Budi Santoso',
                'role' => 'Pasien',
                'message' => 'Pelayanan sangat baik dan proses pendaftaran mudah.',
                'rating' => 5,
                'photo' => 'https://i.pravatar.cc/300?img=12',
                'sort_order' => 1,
                'is_active' => true,
            ],
            [
                'name' => 'Siti Aminah',
                'role' => 'Pasien',
                'message' => 'Informasi jadwal dokter sangat membantu saya.',
                'rating' => 5,
                'photo' => 'https://i.pravatar.cc/300?img=47',
                'sort_order' => 2,
                'is_active' => true,
            ],
            [
                'name' => 'Andi Wijaya',
                'role' => 'Pasien',
                'message' => 'Sistemnya mudah digunakan dan informasi antrian jelas.',
                'rating' => 4,
                'photo' => 'https://i.pravatar.cc/300?img=33',
                'sort_order' => 3,
                'is_active' => true,
            ],
        ];

        foreach ($testimonials as $testimonial) {
            Testimonial::updateOrCreate(
                [
                    'name' => $testimonial['name'],
                    'message' => $testimonial['message'],
                ],
                [
                    'role' => $testimonial['role'],
                    'rating' => $testimonial['rating'],
                    'photo' => $testimonial['photo'],
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

