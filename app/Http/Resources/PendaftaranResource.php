<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PendaftaranResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,

            'registration_number' => $this->registration_number,

            'queue_number' => $this->queue_number,

            'registration_date' => $this->registration_date
                ? $this->registration_date->format('Y-m-d')
                : null,

            'status' => $this->status,

            'notes' => $this->notes,

            'pasien' => [
                'id' => $this->pasien?->id,
                'medical_record_number' => $this->pasien?->medical_record_number,
                'name' => $this->pasien?->name,
                'nik' => $this->pasien?->nik,
            ],

            'poli' => [
                'id' => $this->poli?->id,
                'code' => $this->poli?->code,
                'name' => $this->poli?->name,
            ],

        ];
    }
}

