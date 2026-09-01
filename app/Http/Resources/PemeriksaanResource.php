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

            'antrian' => [
                'id' => $this->antrian?->id,
                'queue_number' => $this->antrian?->queue_number,
                'status' => $this->antrian?->status,
            ],

            'pasien' => [
                'id' => $this->antrian?->pendaftaran?->pasien?->id,
                'medical_record_number' =>
                    $this->antrian?->pendaftaran?->pasien?->medical_record_number,
                'name' =>
                    $this->antrian?->pendaftaran?->pasien?->name,
            ],

            'poli' => [
                'id' => $this->antrian?->poli?->id,
                'code' => $this->antrian?->poli?->code,
                'name' => $this->antrian?->poli?->name,
            ],

            'dokter' => [
                'id' => $this->dokter?->id,
                'code' => $this->dokter?->code,
                'name' => $this->dokter?->name,
                'specialization' =>
                    $this->dokter?->specialization,
            ],

            'examined_at' => $this->examined_at?->toISOString(),
            'complaint' => $this->complaint,
            'diagnosis' => $this->diagnosis,
            'treatment' => $this->treatment,
            'notes' => $this->notes,

        ];
    }
}

