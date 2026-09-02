<?php

namespace App\Services;

use App\Models\Antrian;
use App\Models\Pendaftaran;
use App\Models\Poli;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class PendaftaranService
{
    public function getAll(int $perPage = 10): LengthAwarePaginator
    {
        return Pendaftaran::query()
            ->with(['pasien', 'poli'])
            ->latest()
            ->paginate($perPage);
    }

    public function create(array $data): Pendaftaran
    {
        return DB::transaction(function () use ($data) {

            $registrationDate = $data['registration_date'];

            /*
             * Pendaftaran dibuat dari tiket antrean yang sudah dipanggil.
             * Nomor antrean & poli diambil dari tiket tersebut.
             */
            $antrian = isset($data['antrian_id'])
                ? Antrian::with(['poli'])->findOrFail($data['antrian_id'])
                : null;

            if ($antrian) {
                $poli = $antrian->poli;
                $queueNumber = $antrian->queue_number;
                $data['poli_id'] = $antrian->poli_id;
            } else {
                $poli = Poli::query()->findOrFail($data['poli_id']);

                $queueNumber = $this->generateQueueNumber(
                    $data['poli_id'],
                    $poli->queue_prefix,
                    $registrationDate
                );
            }

            /*
             * Nomor registrasi otomatis.
             */
            $sequence = $queueNumber
                ? (int) preg_replace('/\D/', '', (string) $queueNumber)
                : 0;

            $prefix = $poli->queue_prefix;

            $registrationNumber =
                'REG-'.
                date('Ymd', strtotime($registrationDate)).
                '-'.
                ($prefix ? $prefix : '').
                str_pad($sequence, 3, '0', STR_PAD_LEFT);

            $data['queue_number'] = $queueNumber;
            $data['registration_number'] = $registrationNumber;
            $data['status'] = 'waiting';

            $pendaftaran = Pendaftaran::create($data);

            /*
             * Tandai tiket antrean sebagai sudah dipanggil
             * ketika pasien selesai didaftarkan.
             */
            if ($antrian) {
                $antrian->update([
                    'status' => 'called',
                    'called_at' => $antrian->called_at ?? now(),
                ]);
            }

            return $pendaftaran->load([
                'pasien',
                'poli',
                'antrian',
            ]);
        });
    }

    public function update(
        Pendaftaran $pendaftaran,
        array $data
    ): Pendaftaran {
        return DB::transaction(function () use ($pendaftaran, $data) {

            $pendaftaran->update($data);

            return $pendaftaran
                ->fresh()
                ->load([
                    'pasien',
                    'poli',
                ]);
        });
    }

    public function delete(Pendaftaran $pendaftaran): void
    {
        DB::transaction(function () use ($pendaftaran) {
            $pendaftaran->delete();
        });
    }

    private function generateQueueNumber(
        int $poliId,
        ?string $prefix,
        string $registrationDate
    ): string {
        $lastQueue = Pendaftaran::withTrashed()
            ->where('poli_id', $poliId)
            ->whereDate('registration_date', $registrationDate)
            ->lockForUpdate()
            ->orderByDesc('id')
            ->value('queue_number');

        $lastSequence = $lastQueue
            ? (int) preg_replace('/\D/', '', (string) $lastQueue)
            : 0;

        $sequence = str_pad($lastSequence + 1, 3, '0', STR_PAD_LEFT);

        return $prefix
            ? "{$prefix}-{$sequence}"
            : $sequence;
    }
}
