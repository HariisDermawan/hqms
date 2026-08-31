<?php

namespace App\Services;

use App\Models\Poli;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class PoliService
{
    public function getAll(): LengthAwarePaginator
    {
        return Poli::query()
            ->latest()
            ->paginate(10);
    }

    public function create(array $data): Poli
    {
        return DB::transaction(function () use ($data) {

            /** @var UploadedFile|null $image */
            $image = $data['image'] ?? null;

            unset($data['image']);

            if ($image) {
                $data['image'] = $image->store('polis', 'public');
            }

            return Poli::create($data);
        });
    }

    public function update(Poli $poli, array $data): Poli
    {
        return DB::transaction(function () use ($poli, $data) {

            /** @var UploadedFile|null $image */
            $image = $data['image'] ?? null;

            unset($data['image']);

            if ($image) {
                if ($poli->image) {
                    Storage::disk('public')->delete($poli->image);
                }

                $data['image'] = $image->store('polis', 'public');
            }

            $poli->update($data);

            return $poli->fresh();
        });
    }

    public function delete(Poli $poli): void
    {
        DB::transaction(function () use ($poli) {

            if ($poli->image) {
                Storage::disk('public')->delete($poli->image);
            }

            $poli->delete();
        });
    }
}
