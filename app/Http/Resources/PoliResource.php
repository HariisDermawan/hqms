<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class PoliResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'code' => $this->code,
            'queue_prefix' => $this->queue_prefix,
            'name' => $this->name,
            'description' => $this->description,

            'image_url' => $this->image
                ? Storage::disk('public')->url($this->image)
                : null,

            'dokters' => $this->whenLoaded('jadwalDokters', function () {
                return $this->jadwalDokters
                    ->filter(fn ($jadwal) => $jadwal->dokter !== null)
                    ->unique('dokter_id')
                    ->values()
                    ->map(fn ($jadwal) => [
                        'id' => $jadwal->dokter->id,
                        'name' => $jadwal->dokter->name,
                        'image_url' => $jadwal->dokter->image
                            ? Storage::disk('public')->url(
                                $jadwal->dokter->image
                            )
                            : null,
                    ])
                    ->all();
            }),

            'is_active' => (bool) $this->is_active,
        ];
    }
}
