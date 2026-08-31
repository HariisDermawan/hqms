<?php

namespace App\Services;

use App\Models\Pendaftaran;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class PendaftaranService
{
    public function getAll(): LengthAwarePaginator
    {
        return Pendaftaran::query()
            ->with(['pasien', 'poli'])
            ->latest()
            ->paginate(10);
    }

    public function create(array $data): Pendaftaran
    {
        return DB::transaction(function () use ($data) {

            $registrationDate = $data['registration_date'];

            /*
             * Ambil nomor antrean terakhir
             * berdasarkan poli dan tanggal pendaftaran.
             */
            $lastQueue = Pendaftaran::query()
                ->where('poli_id', $data['poli_id'])
                ->whereDate('registration_date', $registrationDate)
                ->lockForUpdate()
                ->orderByDesc('id')
                ->value('queue_number');

            $nextQueue = $lastQueue
                ? ((int) $lastQueue + 1)
                : 1;

            $queueNumber = str_pad(
                $nextQueue,
                3,
                '0',
                STR_PAD_LEFT
            );

            /*
             * Nomor registrasi otomatis.
             */
            $registrationNumber =
                'REG-' .
                date('Ymd', strtotime($registrationDate)) .
                '-' .
                str_pad($nextQueue, 3, '0', STR_PAD_LEFT);

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

