<?php

namespace Database\Seeders;

use App\Models\Dokter;
use App\Models\JadwalDokter;
use App\Models\Poli;
use Illuminate\Database\Seeder;

class JadwalDokterSeeder extends Seeder
{
    public function run(): void
    {
        $dokterUmum = Dokter::where('code', 'DR001')->firstOrFail();
        $dokterGigi = Dokter::where('code', 'DR002')->firstOrFail();
        $dokterMata = Dokter::where('code', 'DR003')->firstOrFail();
        $dokterJantung = Dokter::where('code', 'DR004')->firstOrFail();

        $poliUmum = Poli::where('code', 'PLUM')->firstOrFail();
        $poliGigi = Poli::where('code', 'PLGI')->firstOrFail();
        $poliMata = Poli::where('code', 'PLMA')->firstOrFail();
        $poliJantung = Poli::where('code', 'PLJA')->firstOrFail();

        $jadwals = [
            [
                'dokter_id' => $dokterUmum->id,
                'poli_id' => $poliUmum->id,
                'day' => 'monday',
                'start_time' => '08:00:00',
                'end_time' => '12:00:00',
            ],
            [
                'dokter_id' => $dokterUmum->id,
                'poli_id' => $poliUmum->id,
                'day' => 'wednesday',
                'start_time' => '08:00:00',
                'end_time' => '12:00:00',
            ],
            [
                'dokter_id' => $dokterGigi->id,
                'poli_id' => $poliGigi->id,
                'day' => 'tuesday',
                'start_time' => '09:00:00',
                'end_time' => '13:00:00',
            ],
            [
                'dokter_id' => $dokterGigi->id,
                'poli_id' => $poliGigi->id,
                'day' => 'thursday',
                'start_time' => '09:00:00',
                'end_time' => '13:00:00',
            ],
            [
                'dokter_id' => $dokterMata->id,
                'poli_id' => $poliMata->id,
                'day' => 'monday',
                'start_time' => '13:00:00',
                'end_time' => '16:00:00',
            ],
            [
                'dokter_id' => $dokterMata->id,
                'poli_id' => $poliMata->id,
                'day' => 'friday',
                'start_time' => '08:00:00',
                'end_time' => '11:00:00',
            ],
            [
                'dokter_id' => $dokterJantung->id,
                'poli_id' => $poliJantung->id,
                'day' => 'tuesday',
                'start_time' => '13:00:00',
                'end_time' => '16:00:00',
            ],
            [
                'dokter_id' => $dokterJantung->id,
                'poli_id' => $poliJantung->id,
                'day' => 'friday',
                'start_time' => '13:00:00',
                'end_time' => '16:00:00',
            ],
        ];

        foreach ($jadwals as $jadwal) {
            JadwalDokter::updateOrCreate(
                [
                    'dokter_id' => $jadwal['dokter_id'],
                    'poli_id' => $jadwal['poli_id'],
                    'day' => $jadwal['day'],
                    'start_time' => $jadwal['start_time'],
                    'end_time' => $jadwal['end_time'],
                ],
                [
                    'is_active' => true,
                ]
            );
        }

        $this->command->info(
            'JadwalDokterSeeder berhasil dijalankan.'
        );
    }
}
