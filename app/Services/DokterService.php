<?php

namespace App\Services;

use App\Models\Dokter;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class DokterService
{
    public function getAll(): LengthAwarePaginator
    {
        return Dokter::query()
            ->latest()
            ->paginate(10);
    }

    public function create(array $data): Dokter
    {
        return DB::transaction(function () use ($data) {
            return Dokter::create([
                'code' => $data['code'],
                'name' => $data['name'],
                'specialization' => $data['specialization'] ?? null,
                'sip_number' => $data['sip_number'],
                'phone' => $data['phone'] ?? null,
                'is_active' => $data['is_active'] ?? true,
            ]);
        });
    }

    public function update(
        Dokter $dokter,
        array $data
    ): Dokter {
        return DB::transaction(function () use ($dokter, $data) {
            $dokter->update([
                'code' => $data['code'],
                'name' => $data['name'],
                'specialization' => $data['specialization'] ?? null,
                'sip_number' => $data['sip_number'],
                'phone' => $data['phone'] ?? null,
                'is_active' => $data['is_active'] ?? $dokter->is_active,
            ]);

            return $dokter->fresh();
        });
    }

    public function delete(Dokter $dokter): void
    {
        DB::transaction(function () use ($dokter) {
            $dokter->delete();
        });
    }
}

