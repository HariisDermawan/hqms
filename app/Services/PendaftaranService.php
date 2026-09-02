<?php

namespace App\Services;

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

            $poli = Poli::query()->findOrFail($data['poli_id']);
            $prefix = $poli->queue_prefix;

            /*
             * Ambil nomor antrean terakhir
             * berdasarkan poli dan tanggal pendaftaran.
             */
            $lastQueue = Pendaftaran::withTrashed()
                ->where('poli_id', $data['poli_id'])
                ->whereDate('registration_date', $registrationDate)
                ->lockForUpdate()
                ->orderByDesc('id')
                ->value('queue_number');

            $lastSequence = $lastQueue
                ? (int) preg_replace(
                    '/\D/',
                    '',
                    (string) $lastQueue
                )
                : 0;

            $nextSequence = $lastSequence + 1;

            $sequence = str_pad(
                $nextSequence,
                3,
                '0',
                STR_PAD_LEFT
            );

            $queueNumber = $prefix
                ? "{$prefix}-{$sequence}"
                : $sequence;

            /*
             * Nomor registrasi otomatis.
             */
            $registrationNumber =
                'REG-'.
                date('Ymd', strtotime($registrationDate)).
                '-'.
                ($prefix ? $prefix : '').
                $sequence;

            $data['queue_number'] = $queueNumber;
            $data['registration_number'] = $registrationNumber;
            $data['status'] = 'waiting';

            $pendaftaran = Pendaftaran::create($data);

            return $pendaftaran->load([
                'pasien',
                'poli',
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
}
