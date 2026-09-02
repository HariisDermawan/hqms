<?php

namespace Database\Seeders;

use App\Models\Pasien;
use App\Models\Pendaftaran;
use App\Models\Poli;
use Illuminate\Database\Seeder;

class PendaftaranSeeder extends Seeder
{
    public function run(): void
    {
        $data = [
            [
                'pasien_id' => 1,
                'poli_id' => 1,
                'queue_number' => '001',
            ],
            [
                'pasien_id' => 2,
                'poli_id' => 5,
                'queue_number' => '001',
            ],
            [
                'pasien_id' => 3,
                'poli_id' => 2,
                'queue_number' => '001',
            ],
            [
                'pasien_id' => 4,
                'poli_id' => 3,
                'queue_number' => '001',
            ],
            [
                'pasien_id' => 5,
                'poli_id' => 1,
                'queue_number' => '002',
            ],
            [
                'pasien_id' => 6,
                'poli_id' => 2,
                'queue_number' => '002',
            ],
        ];

        foreach ($data as $item) {
            $pasien = Pasien::find($item['pasien_id']);
            $poli = Poli::find($item['poli_id']);

            if (! $pasien || ! $poli) {
                $this->command->warn(
                    "Pasien ID {$item['pasien_id']} atau Poli ID {$item['poli_id']} tidak ditemukan."
                );

                continue;
            }

            $prefix = $poli->queue_prefix;
            $sequence = str_pad(
                (int) $item['queue_number'],
                3,
                '0',
                STR_PAD_LEFT
            );

            Pendaftaran::updateOrCreate(
                [
                    'pasien_id' => $item['pasien_id'],
                    'poli_id' => $item['poli_id'],
                    'registration_date' => now()->toDateString(),
                ],
                [
                    'registration_number' => 'REG-'.
                        now()->format('Ymd').'-'.
                        ($prefix ? $prefix : '').
                        $sequence,

                    'queue_number' => $prefix
                        ? "{$prefix}-{$sequence}"
                        : $sequence,

                    'status' => 'waiting',
                    'notes' => null,
                ]
            );
        }

        $this->command->info('PendaftaranSeeder berhasil dijalankan.');
    }
}
