<?php

namespace Database\Seeders;

use App\Models\Perawat;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;

class PerawatSeeder extends Seeder
{
    public function run(): void
    {
        $perawats = [
            [
                'code' => 'PRW001',
                'name' => 'Ns. Rina Marlina, S.Kep',
                'gender' => 'P',
                'str_number' => 'STR-001-2026',
                'rfid_id' => 'RFID001',
                'phone' => '081234567201',
                'image' => 'perawats/prw1.png',
                'is_active' => true,
            ],
            [
                'code' => 'PRW002',
                'name' => 'Ns. Andriyanto, S.Kep',
                'gender' => 'L',
                'str_number' => 'STR-002-2026',
                'rfid_id' => 'RFID002',
                'phone' => '081234567202',
                'image' => 'perawats/prw2.png',
                'is_active' => true,
            ],
            [
                'code' => 'PRW003',
                'name' => 'Ns. Sari Dewi, S.Kep',
                'gender' => 'P',
                'str_number' => 'STR-003-2026',
                'rfid_id' => 'RFID003',
                'phone' => '081234567203',
                'image' => 'perawats/prw3.png',
                'is_active' => true,
            ],
            [
                'code' => 'PRW004',
                'name' => 'Ns. Bambang, S.Kep',
                'gender' => 'L',
                'str_number' => 'STR-004-2026',
                'rfid_id' => 'RFID004',
                'phone' => '081234567204',
                'image' => 'perawats/prw4.png',
                'is_active' => true,
            ],
        ];

        foreach ($perawats as $perawat) {
            $path = $perawat['image'];
            $source = public_path('assets/'.basename($path));

            if (is_file($source) && ! Storage::disk('public')->exists($path)) {
                Storage::disk('public')->put(
                    $path,
                    file_get_contents($source)
                );
            }

            Perawat::updateOrCreate(
                [
                    'code' => $perawat['code'],
                ],
                $perawat
            );
        }

        $this->command->info(
            'PerawatSeeder berhasil dijalankan.'
        );
    }
}
