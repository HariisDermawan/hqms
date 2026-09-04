<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ObatResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,

            'nama_obat' => $this->nama_obat,
            'dosis' => $this->dosis,
            'jumlah' => $this->jumlah,
            'satuan' => $this->satuan,
            'harga' => $this->harga,
            'keterangan' => $this->keterangan,

            'pemeriksaan' => $this->whenLoaded('pemeriksaan', function () {
                return [
                    'id' => $this->pemeriksaan?->id,
                    'queue_number' => $this->pemeriksaan?->antrian?->queue_number,
                    'examined_at' => $this->pemeriksaan?->examined_at?->toISOString(),
                    'diagnosis' => $this->pemeriksaan?->diagnosis,
                    'pasien' => [
                        'id' => $this->pemeriksaan?->pasien?->id,
                        'medical_record_number' => $this->pemeriksaan?->pasien?->medical_record_number,
                        'name' => $this->pemeriksaan?->pasien?->name,
                    ],
                    'poli' => [
                        'id' => $this->pemeriksaan?->poli?->id,
                        'name' => $this->pemeriksaan?->poli?->name,
                    ],
                ];
            }),

            'created_at' => $this->created_at?->toISOString(),
        ];
    }
}
