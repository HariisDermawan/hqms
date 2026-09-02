<?php

namespace Database\Seeders;

use App\Models\Antrian;
use App\Models\Pendaftaran;
use App\Models\Poli;
use Illuminate\Database\Seeder;

class AntrianSeeder extends Seeder
{
    public function run(): void
    {
        $today = now()->toDateString();

        /*
         * Buat tiket antrean berdiri sendiri per poli.
         */
        $ticketsPerPoli = 3;

        $polis = Poli::query()
            ->where('is_active', true)
            ->get();

        foreach ($polis as $poli) {
            $prefix = $poli->queue_prefix ?? 'A';

            for ($i = 1; $i <= $ticketsPerPoli; $i++) {
                $queueNumber = $prefix.'-'.str_pad($i, 3, '0', STR_PAD_LEFT);

                if (Antrian::where('queue_number', $queueNumber)->exists()) {
                    continue;
                }

                Antrian::create([
                    'poli_id' => $poli->id,
                    'queue_number' => $queueNumber,
                    'status' => 'waiting',
                    'called_at' => null,
                    'started_at' => null,
                    'completed_at' => null,
                    'notes' => null,
                    'created_at' => $today,
                ]);
            }
        }

        /*
         * Hubungkan pendaftaran yang belum terhubung ke tiket.
         */
        $unlinkedPendaftarans = Pendaftaran::query()
            ->whereNull('antrian_id')
            ->get();

        foreach ($unlinkedPendaftarans as $pendaftaran) {
            $antrian = Antrian::create([
                'poli_id' => $pendaftaran->poli_id,
                'queue_number' => $pendaftaran->queue_number,
                'status' => 'called',
                'called_at' => now(),
                'started_at' => null,
                'completed_at' => null,
                'notes' => null,
            ]);

            $pendaftaran->update([
                'antrian_id' => $antrian->id,
                'status' => 'called',
            ]);
        }

        $this->command->info(
            'AntrianSeeder berhasil dijalankan.'
        );
    }
}
