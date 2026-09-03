<?php

namespace App\Services;

use App\Models\Perawat;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class PerawatService
{
    public function getAll(int $perPage = 10): LengthAwarePaginator
    {
        return Perawat::query()
            ->latest()
            ->paginate($perPage);
    }

    public function create(array $data): Perawat
    {
        return DB::transaction(function () use ($data) {

            /** @var UploadedFile|null $image */
            $image = $data['image'] ?? null;

            unset($data['image']);

            if ($image) {
                $data['image'] = $image->store('perawats', 'public');
            }

            return Perawat::create($data);
        });
    }

    public function update(
        Perawat $perawat,
        array $data
    ): Perawat {
        return DB::transaction(function () use ($perawat, $data) {

            /** @var UploadedFile|null $image */
            $image = $data['image'] ?? null;

            unset($data['image']);

            if ($image) {
                if ($perawat->image) {
                    Storage::disk('public')->delete($perawat->image);
                }

                $data['image'] = $image->store('perawats', 'public');
            }

            $perawat->update($data);

            return $perawat->fresh();
        });
    }

    public function delete(Perawat $perawat): void
    {
        DB::transaction(function () use ($perawat) {

            if ($perawat->image) {
                Storage::disk('public')->delete($perawat->image);
            }

            $perawat->delete();
        });
    }
}
