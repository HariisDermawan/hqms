<?php

namespace App\Http\Resources;

use App\Models\JadwalDokter;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class DokterResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'slug' => $this->slug,
            'code' => $this->code,
            'name' => $this->name,
            'specialization' => $this->specialization,
            'sip_number' => $this->sip_number,
            'phone' => $this->phone,

            'image_url' => $this->image
                ? Storage::disk('public')->url($this->image)
                : null,

            'is_active' => $this->is_active,

            'schedules' => $this->jadwalDokters
                ->where('is_active', true)
                ->map(fn (JadwalDokter $jadwal): array => [
                    'id' => $jadwal->id,
                    'day' => $jadwal->day,
                    'start_time' => $jadwal->start_time,
                    'end_time' => $jadwal->end_time,
                    'poli' => $jadwal->poli?->name,
                ])
                ->values(),
        ];
    }
}
