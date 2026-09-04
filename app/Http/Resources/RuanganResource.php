<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RuanganResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'code' => $this->code,
            'name' => $this->name,
            'category' => $this->category,
            'description' => $this->description,
            'poli' => [
                'id' => $this->poli?->id,
                'name' => $this->poli?->name,
            ],
            'is_active' => (bool) $this->is_active,

            'pasiens' => $this->whenLoaded(
                'ruanganPasiens',
                function () {
                    return $this->ruanganPasiens
                        ->filter(
                            fn ($item) => $item->tanggal_keluar === null
                        )
                        ->values()
                        ->map(fn ($item) => [
                            'id' => $item->id,
                            'pasien_id' => $item->pasien_id,
                            'antrian_id' => $item->antrian_id,
                            'pendaftaran_id' => $item->pendaftaran_id,
                            'name' => $item->pasien_name,
                            'mrn' => $item->pasien_mrn,
                            'gender' => $item->pasien_gender,
                            'age' => $item->pasien_age,
                            'queue_number' => $item->antrian?->queue_number,
                            'poli' => [
                                'id' => $item->antrian?->poli?->id,
                                'name' => $item->antrian?->poli?->name,
                            ],
                            'tanggal_masuk' => $item->tanggal_masuk?->format(
                                'Y-m-d'
                            ),
                            'tanggal_keluar' => $item->tanggal_keluar?->format(
                                'Y-m-d'
                            ),
                        ])
                        ->all();
                },
            ),
        ];
    }
}
