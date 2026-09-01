<?php

namespace Database\Seeders;

use App\Models\Dokter;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;

class DokterSeeder extends Seeder
{
    public function run(): void
    {
        $dokters = [
            [
                'code' => 'DR001',
                'name' => 'dr. Budi Santoso',
                'specialization' => 'Dokter Umum',
                'sip_number' => 'SIP-001-2026',
                'phone' => '081234567101',
                'image' => 'dokters/dok1.png',
                'is_active' => true,
            ],
            [
                'code' => 'DR002',
                'name' => 'drg. Siti Aminah',
                'specialization' => 'Dokter Gigi',
                'sip_number' => 'SIP-002-2026',
                'phone' => '081234567102',
                'image' => 'dokters/dok2.png',
                'is_active' => true,
            ],
            [
                'code' => 'DR003',
                'name' => 'dr. Andi Wijaya',
                'specialization' => 'Dokter Mata',
                'sip_number' => 'SIP-003-2026',
                'phone' => '081234567103',
                'image' => 'dokters/dok3.png',
                'is_active' => true,
            ],
            [
                'code' => 'DR004',
                'name' => 'dr. Dewi Lestari',
                'specialization' => 'Dokter Jantung',
                'sip_number' => 'SIP-004-2026',
                'phone' => '081234567104',
                'image' => 'dokters/dok4.png',
                'is_active' => true,
            ],
        ];

        foreach ($dokters as $dokter) {
            $path = $dokter['image'];
            $source = public_path('assets/'.basename($path));

            if (is_file($source) && ! Storage::disk('public')->exists($path)) {
                Storage::disk('public')->put(
                    $path,
                    file_get_contents($source)
                );
            }

            Dokter::updateOrCreate(
                [
                    'code' => $dokter['code'],
                ],
                $dokter
            );
        }

        $this->command->info(
            'DokterSeeder berhasil dijalankan.'
        );
    }
}
