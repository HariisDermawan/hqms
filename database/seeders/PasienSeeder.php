<?php

namespace Database\Seeders;

use App\Models\Pasien;
use App\Models\Poli;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class PasienSeeder extends Seeder
{
    public function run(): void
    {
        $polis = Poli::all();
        $pasien = [
            [
                'poli_name' => 'Poli Umum',
                'medical_record_number' => 'RM000001',
                'name' => 'Budi Santoso',
                'nik' => '3171000000000001',
                'gender' => 'L',
                'birth_date' => '1990-05-12',
                'phone' => '081234567001',
                'address' => 'Jakarta',
                'is_active' => true,
            ],
            [
                'poli_name' => 'Poli Gigi',
                'medical_record_number' => 'RM000002',
                'name' => 'Siti Aminah',
                'nik' => '3171000000000002',
                'gender' => 'P',
                'birth_date' => '1988-08-20',
                'phone' => '081234567002',
                'address' => 'Jakarta',
                'is_active' => true,
            ],
            [
                'poli_name' => 'Poli Mata',
                'medical_record_number' => 'RM000003',
                'name' => 'Andi Wijaya',
                'nik' => '3171000000000003',
                'gender' => 'L',
                'birth_date' => '1995-02-10',
                'phone' => '081234567003',
                'address' => 'Jakarta',
                'is_active' => true,
            ],
            [
                'poli_name' => 'Poli Jantung',
                'medical_record_number' => 'RM000004',
                'name' => 'Dewi Lestari',
                'nik' => '3171000000000004',
                'gender' => 'P',
                'birth_date' => '1992-11-03',
                'phone' => '081234567004',
                'address' => 'Jakarta',
                'is_active' => true,
            ],
            [
                'poli_name' => 'Poli Umum',
                'medical_record_number' => 'RM000005',
                'name' => 'Rudi Hartono',
                'nik' => '3171000000000005',
                'gender' => 'L',
                'birth_date' => '1975-07-18',
                'phone' => '081234567005',
                'address' => 'Jakarta',
                'is_active' => true,
            ],
        ];

        foreach ($pasien as $item) {
            $poli = Poli::where('name', $item['poli_name'])->first();

            if (!$poli) {
                $this->command->warn(
                    "Poli '{$item['poli_name']}' tidak ditemukan. Pasien {$item['name']} dilewati."
                );

                continue;
            }

            $birthDate = Carbon::parse($item['birth_date']);

            Pasien::updateOrCreate(
                [
                    'nik' => $item['nik'],
                ],
                [
                    'poli_id' => $poli->id,
                    'medical_record_number' => $item['medical_record_number'],
                    'name' => $item['name'],
                    'gender' => $item['gender'],
                    'birth_date' => $item['birth_date'],
                    'age' => $birthDate->age,
                    'phone' => $item['phone'],
                    'address' => $item['address'],
                    'is_active' => $item['is_active'],
                ]
            );
        }

        $this->command->info('PasienSeeder berhasil dijalankan.');
    }
}
