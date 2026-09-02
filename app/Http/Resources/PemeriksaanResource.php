<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PemeriksaanResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,

            'pasien' => [
                'id' => $this->pasien?->id,
                'medical_record_number' => $this->pasien?->medical_record_number,
                'name' => $this->pasien?->name,
            ],

            'poli' => [
                'id' => $this->poli?->id,
                'code' => $this->poli?->code,
                'name' => $this->poli?->name,
            ],

            'dokter' => [
                'id' => $this->dokter?->id,
                'code' => $this->dokter?->code,
                'name' => $this->dokter?->name,
                'specialization' => $this->dokter?->specialization,
            ],

            'category' => $this->category,
            'examined_at' => $this->examined_at?->toISOString(),
            'complaint' => $this->complaint,
            'diagnosis' => $this->diagnosis,
            'treatment' => $this->treatment,
            'notes' => $this->notes,

        ];
    }
}
