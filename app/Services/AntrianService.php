<?php

namespace App\Services;

use App\Models\Antrian;
use App\Models\Poli;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class AntrianService
{
    public function getAll(int $perPage = 10): LengthAwarePaginator
    {
        return Antrian::query()
            ->with([
                'poli',
                'pendaftaran.pasien',
            ])
            ->latest()
            ->paginate($perPage);
    }

    public function create(array $data): Antrian
    {
        return DB::transaction(function () use ($data) {

            $poli = Poli::query()->findOrFail($data['poli_id']);
            $prefix = $poli->queue_prefix ?? 'A';

            /*
             * Nomor antrean real-time per poli dan tanggal pembuatan tiket.
             */
            $today = now()->toDateString();

            $lastQueue = Antrian::withTrashed()
                ->where('poli_id', $poli->id)
                ->whereDate('created_at', $today)
                ->lockForUpdate()
                ->orderByDesc('id')
                ->value('queue_number');

            $lastSequence = $lastQueue
                ? (int) preg_replace('/\D/', '', (string) $lastQueue)
                : 0;

            $nextSequence = $lastSequence + 1;

            $sequence = str_pad($nextSequence, 3, '0', STR_PAD_LEFT);

            $queueNumber = "{$prefix}-{$sequence}";

            $antrian = Antrian::create([
                'poli_id' => $poli->id,
                'queue_number' => $queueNumber,
                'status' => 'waiting',
                'notes' => $data['notes'] ?? null,
            ]);

            return $antrian->load([
                'poli',
                'pendaftaran.pasien',
            ]);
        });
    }

    public function update(Antrian $antrian, array $data): Antrian
    {
        return DB::transaction(function () use ($antrian, $data) {

            $status = $data['status'];

            $updateData = [
                'status' => $status,
                'notes' => $data['notes'] ?? $antrian->notes,
                'loket' => $data['loket'] ?? $antrian->loket,
            ];

            /*
             * Jaga status pendaftaran tetap sinkron dengan status antrean
             * bila tiket ini sudah terhubung ke pendaftaran.
             */
            if ($antrian->pendaftaran) {
                $antrian->pendaftaran->update([
                    'status' => $status === 'skipped'
                        ? 'waiting'
                        : $status,
                ]);
            }

            /*
             * Waktu otomatis berdasarkan status.
             */
            if ($status === 'called' && ! $antrian->called_at) {
                $updateData['called_at'] = now();
            }

            if ($status === 'serving' && ! $antrian->started_at) {
                $updateData['started_at'] = now();

                if (! $antrian->called_at) {
                    $updateData['called_at'] = now();
                }
            }

            if ($status === 'completed' && ! $antrian->completed_at) {
                $updateData['completed_at'] = now();

                if (! $antrian->called_at) {
                    $updateData['called_at'] = now();
                }

                if (! $antrian->started_at) {
                    $updateData['started_at'] = now();
                }
            }

            $antrian->update($updateData);

            return $antrian->fresh()->load([
                'poli',
                'pendaftaran.pasien',
            ]);
        });
    }

    public function delete(Antrian $antrian): void
    {
        DB::transaction(function () use ($antrian) {

            $pendaftaran = $antrian->pendaftaran;

            $antrian->delete();

            if ($pendaftaran) {
                $pendaftaran->update(['status' => 'waiting']);
            }
        });
    }
}
