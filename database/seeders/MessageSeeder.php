<?php

namespace Database\Seeders;

use App\Models\Message;
use Illuminate\Database\Seeder;

class MessageSeeder extends Seeder
{
    public function run(): void
    {
        $messages = [
            [
                'name' => 'Andi Saputra',
                'email' => 'andi@example.com',
                'phone' => '081234567890',
                'subject' => 'Pertanyaan Jadwal Dokter',
                'message' => 'Saya ingin mengetahui jadwal praktik dokter umum.',
                'status' => 'unread',
                'admin_reply' => null,
                'replied_at' => null,
            ],
            [
                'name' => 'Siti Rahma',
                'email' => 'siti@example.com',
                'phone' => '082345678901',
                'subject' => 'Informasi Pendaftaran',
                'message' => 'Apakah pendaftaran pasien baru bisa dilakukan secara online?',
                'status' => 'read',
                'admin_reply' => null,
                'replied_at' => null,
            ],
            [
                'name' => 'Budi Santoso',
                'email' => 'budi@example.com',
                'phone' => '083456789012',
                'subject' => 'Keluhan Pelayanan',
                'message' => 'Saya ingin menyampaikan masukan mengenai pelayanan.',
                'status' => 'replied',
                'admin_reply' => 'Terima kasih atas masukannya. Kami akan melakukan evaluasi terhadap pelayanan kami.',
                'replied_at' => now(),
            ],
        ];

        foreach ($messages as $message) {
            Message::updateOrCreate(
                [
                    'email' => $message['email'],
                    'subject' => $message['subject'],
                ],
                $message
            );
        }

        $this->command->info(
            'MessageSeeder berhasil dijalankan.'
        );
    }
}

