<?php

namespace Database\Seeders;

use App\Models\Antrian;
use App\Models\Pendaftaran;
use Illuminate\Database\Seeder;

class AntrianSeeder extends Seeder
{
    public function run(): void
    {
        $pendaftarans = Pendaftaran::query()
            ->get();

        if ($pendaftarans->isEmpty()) {
            $this->command->warn(
                'Tabel pendaftarans kosong. Jalankan PendaftaranSeeder terlebih dahulu.'
            );

            return;
        }

        foreach ($pendaftarans as $pendaftaran) {
            Antrian::updateOrCreate(
                [
                    'pendaftaran_id' => $pendaftaran->id,
                ],
                [
                    'poli_id' => $pendaftaran->poli_id,
                    'queue_number' => $pendaftaran->queue_number,
                    'status' => 'waiting',
                    'called_at' => null,
                    'started_at' => null,
                    'completed_at' => null,
                    'notes' => null,
                ]
            );
        }

        $this->command->info(
            'AntrianSeeder berhasil dijalankan.'
        );
    }
}
