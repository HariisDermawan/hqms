<?php

namespace App\Services;

use App\Models\Dokter;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

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

            /** @var UploadedFile|null $image */
            $image = $data['image'] ?? null;

            unset($data['image']);

            if ($image) {
                $data['image'] = $image->store('dokters', 'public');
            }

            return Dokter::create($data);
        });
    }

    public function update(
        Dokter $dokter,
        array $data
    ): Dokter {
        return DB::transaction(function () use ($dokter, $data) {

            /** @var UploadedFile|null $image */
            $image = $data['image'] ?? null;

            unset($data['image']);

            if ($image) {
                if ($dokter->image) {
                    Storage::disk('public')->delete($dokter->image);
                }

                $data['image'] = $image->store('dokters', 'public');
            }

            $dokter->update($data);

            return $dokter->fresh();
        });
    }

    public function delete(Dokter $dokter): void
    {
        DB::transaction(function () use ($dokter) {

            if ($dokter->image) {
                Storage::disk('public')->delete($dokter->image);
            }

            $dokter->delete();
        });
    }
}
