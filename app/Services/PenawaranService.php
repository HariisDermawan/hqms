<?php

namespace App\Services;

use App\Models\Penawaran;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class PenawaranService
{
    public function getAll(int $perPage = 10): LengthAwarePaginator
    {
        return Penawaran::query()
            ->latest()
            ->paginate($perPage);
    }

    /**
     * @return Collection<int, Penawaran>
     */
    public function getActive(): Collection
    {
        return Penawaran::query()
            ->latest()
            ->get();
    }

    public function create(array $data): Penawaran
    {
        return DB::transaction(function () use ($data) {

            /** @var UploadedFile|null $image */
            $image = $data['image'] ?? null;

            unset($data['image']);

            if ($image) {
                $data['image'] = $image->store('penawarans', 'public');
            }

            return Penawaran::create($data);
        });
    }

    public function update(Penawaran $penawaran, array $data): Penawaran
    {
        return DB::transaction(function () use ($penawaran, $data) {

            /** @var UploadedFile|null $image */
            $image = $data['image'] ?? null;

            unset($data['image']);

            if ($image) {
                if ($penawaran->image) {
                    Storage::disk('public')->delete($penawaran->image);
                }

                $data['image'] = $image->store('penawarans', 'public');
            }

            $penawaran->update($data);

            return $penawaran->fresh();
        });
    }

    public function delete(Penawaran $penawaran): void
    {
        DB::transaction(function () use ($penawaran) {

            if ($penawaran->image) {
                Storage::disk('public')->delete($penawaran->image);
            }

            $penawaran->delete();
        });
    }
}
