<?php

namespace App\Services;

use App\Models\Antrian;
use App\Models\Pendaftaran;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class AntrianService
{
    public function getAll(): LengthAwarePaginator
    {
        return Antrian::query()
            ->with([
                'pendaftaran.pasien',
                'pendaftaran.poli',
                'poli',
            ])
            ->latest()
            ->paginate(10);
    }



public function create(array $data): Antrian
{
    return DB::transaction(function () use ($data) {

        $pendaftaran = Pendaftaran::with([
            'pasien',
            'poli',
        ])->findOrFail($data['pendaftaran_id']);

        $antrian = Antrian::create([
            'pendaftaran_id' => $pendaftaran->id,
            'poli_id' => $pendaftaran->poli_id,
            'queue_number' => $pendaftaran->queue_number,
            'status' => 'waiting',
            'notes' => $data['notes'] ?? null,
        ]);

        return $antrian->load([
            'pendaftaran.pasien',
            'pendaftaran.poli',
            'poli',
        ]);
    });
}







    public function update(
        Antrian $antrian,
        array $data
    ): Antrian {
        return DB::transaction(function () use ($antrian, $data) {

            $status = $data['status'];

            $updateData = [
                'status' => $status,
                'notes' => $data['notes'] ?? $antrian->notes,
            ];

            /*
             * Waktu otomatis berdasarkan status.
             */
            if ($status === 'called' && !$antrian->called_at) {
                $updateData['called_at'] = now();
            }

            if ($status === 'serving' && !$antrian->started_at) {
                $updateData['started_at'] = now();

                // Kalau langsung serving tanpa status called,
                // tetap catat waktu pemanggilan.
                if (!$antrian->called_at) {
                    $updateData['called_at'] = now();
                }
            }

            if ($status === 'completed' && !$antrian->completed_at) {
                $updateData['completed_at'] = now();

                // Jika langsung completed, pastikan timestamp sebelumnya ada.
                if (!$antrian->called_at) {
                    $updateData['called_at'] = now();
                }

                if (!$antrian->started_at) {
                    $updateData['started_at'] = now();
                }
            }

            $antrian->update($updateData);

            return $antrian->fresh()->load([
                'pendaftaran.pasien',
                'pendaftaran.poli',
                'poli',
            ]);
        });
    }

    public function delete(Antrian $antrian): void
    {
        DB::transaction(function () use ($antrian) {
            $antrian->delete();
        });
    }
}

