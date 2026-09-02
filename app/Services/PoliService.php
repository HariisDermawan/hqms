<?php

namespace App\Services;

use App\Models\Poli;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;

class PoliService
{
    public function getAll(int $perPage = 10): LengthAwarePaginator
    {
        return Poli::query()
            ->with('jadwalDokters.dokter')
            ->latest()
            ->paginate($perPage);
    }

    /**
     * @return Collection<int, Poli>
     */
    public function getActive(): Collection
    {
        return Poli::query()
            ->where('is_active', true)
            ->orderBy('name')
            ->get();
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

            $data['queue_prefix'] = $this->resolveQueuePrefix(
                $data['queue_prefix'] ?? null
            );

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

            if (isset($data['queue_prefix']) && $data['queue_prefix'] !== null) {
                $data['queue_prefix'] = strtoupper(
                    $data['queue_prefix']
                );
            } else {
                unset($data['queue_prefix']);
            }

            $poli->update($data);

            return $poli->fresh();
        });
    }

    private function resolveQueuePrefix(?string $prefix): string
    {
        if (is_string($prefix) && $prefix !== '') {
            return strtoupper($prefix);
        }

        $last = Poli::query()
            ->whereNotNull('queue_prefix')
            ->orderByDesc('queue_prefix')
            ->value('queue_prefix');

        $next = $last
            ? chr(ord($last) + 1)
            : 'A';

        if (ord($next) > ord('Z')) {
            throw ValidationException::withMessages([
                'queue_prefix' => 'Huruf kode antrean sudah habis (A–Z). Atur secara manual.',
            ]);
        }

        return $next;
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
