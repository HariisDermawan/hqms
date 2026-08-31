<?php

namespace Database\Seeders;

use App\Models\Dokter;
use Illuminate\Database\Seeder;

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
                'is_active' => true,
            ],
            [
                'code' => 'DR002',
                'name' => 'drg. Siti Aminah',
                'specialization' => 'Dokter Gigi',
                'sip_number' => 'SIP-002-2026',
                'phone' => '081234567102',
                'is_active' => true,
            ],
            [
                'code' => 'DR003',
                'name' => 'dr. Andi Wijaya',
                'specialization' => 'Dokter Mata',
                'sip_number' => 'SIP-003-2026',
                'phone' => '081234567103',
                'is_active' => true,
            ],
            [
                'code' => 'DR004',
                'name' => 'dr. Dewi Lestari',
                'specialization' => 'Dokter Jantung',
                'sip_number' => 'SIP-004-2026',
                'phone' => '081234567104',
                'is_active' => true,
            ],
        ];

        foreach ($dokters as $dokter) {
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

