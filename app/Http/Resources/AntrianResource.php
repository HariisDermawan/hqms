<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AntrianResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,

            'queue_number' => $this->queue_number,

            'status' => $this->status,

            'called_at' => $this->called_at?->toISOString(),

            'started_at' => $this->started_at?->toISOString(),

            'completed_at' => $this->completed_at?->toISOString(),

            'notes' => $this->notes,

            'poli' => [
                'id' => $this->poli?->id,
                'code' => $this->poli?->code,
                'name' => $this->poli?->name,
            ],

            'pendaftaran' => $this->whenLoaded('pendaftaran', function () {
                return [
                    'id' => $this->pendaftaran?->id,
                    'registration_number' => $this->pendaftaran?->registration_number,
                    'registration_date' => $this->pendaftaran?->registration_date?->format('Y-m-d'),
                    'status' => $this->pendaftaran?->status,
                    'pasien' => [
                        'id' => $this->pendaftaran?->pasien?->id,
                        'medical_record_number' => $this->pendaftaran?->pasien?->medical_record_number,
                        'name' => $this->pendaftaran?->pasien?->name,
                    ],
                ];
            }),
        ];
    }
}
