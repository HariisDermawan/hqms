<?php

namespace App\Services;

use App\Models\Perawat;
use App\Models\Presensi;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class PresensiService
{
    public function getAll(int $perPage = 10): LengthAwarePaginator
    {
        return Presensi::query()
            ->with('perawat')
            ->latest('date')
            ->latest('id')
            ->paginate($perPage);
    }

    /**
     * Create or update a single attendance row per (perawat, date).
     */
    public function upsert(array $data): Presensi
    {
        return DB::transaction(function () use ($data) {
            return Presensi::updateOrCreate(
                [
                    'perawat_id' => $data['perawat_id'],
                    'date' => $data['date'],
                ],
                $data
            );
        });
    }

    public function update(Presensi $presensi, array $data): Presensi
    {
        return DB::transaction(function () use ($presensi, $data) {
            $presensi->update($data);

            return $presensi->fresh(['perawat']);
        });
    }

    public function delete(Presensi $presensi): void
    {
        DB::transaction(function () use ($presensi) {
            $presensi->delete();
        });
    }

    /**
     * Toggle attendance from an RFID tap.
     *
     * Returns the performed action plus the affected record.
     *
     * @return array{action: string, presensi: Presensi}
     */
    public function tap(Perawat $perawat): array
    {
        return DB::transaction(function () use ($perawat) {
            $date = now()->toDateString();
            $time = now()->format('H:i:s');

            $type = Presensi::firstOrNew([
                'perawat_id' => $perawat->id,
                'date' => $date,
            ]);

            if (! $type->exists || $type->time_in === null) {
                $type->time_in = $time;
                $type->time_out = null;
                $type->status = 'hadir';
                $action = 'in';
            } elseif ($type->time_out === null) {
                $type->time_out = $time;
                $action = 'out';
            } else {
                $action = 'complete';
            }

            $type->save();

            return [
                'action' => $action,
                'presensi' => $type->fresh('perawat'),
            ];
        });
    }
}
