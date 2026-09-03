<?php

namespace Database\Seeders;

use App\Models\Perawat;
use App\Models\Presensi;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class PresensiSeeder extends Seeder
{
    public function run(): void
    {
        $perawats = Perawat::query()->get();

        if ($perawats->isEmpty()) {
            $this->command->info(
                'Tidak ada perawat, lewati PresensiSeeder.'
            );

            return;
        }

        $today = Carbon::today();

        foreach ($perawats as $perawat) {
            Presensi::updateOrCreate(
                [
                    'perawat_id' => $perawat->id,
                    'date' => $today->toDateString(),
                ],
                [
                    'time_in' => '08:00',
                    'time_out' => ($perawat->id % 2 === 0) ? null : '17:00',
                    'status' => 'hadir',
                    'note' => null,
                ]
            );
        }

        $this->command->info(
            'PresensiSeeder berhasil dijalankan.'
        );
    }
}
