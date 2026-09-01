<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class JadwalDokterResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,

            'dokter' => [
                'id' => $this->dokter?->id,
                'code' => $this->dokter?->code,
                'name' => $this->dokter?->name,
                'specialization' => $this->dokter?->specialization,

                'image_url' => $this->dokter?->image
                    ? Storage::disk('public')->url($this->dokter->image)
                    : null,
            ],

            'poli' => [
                'id' => $this->poli?->id,
                'code' => $this->poli?->code,
                'name' => $this->poli?->name,
            ],

            'day' => $this->day,
            'start_time' => $this->start_time,
            'end_time' => $this->end_time,
            'is_active' => $this->is_active,
        ];
    }
}
