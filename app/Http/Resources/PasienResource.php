<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PasienResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,

            'poli' => [
                'id' => $this->poli?->id,
                'code' => $this->poli?->code,
                'name' => $this->poli?->name,
            ],

            'medical_record_number' => $this->medical_record_number,
            'name' => $this->name,
            'nik' => $this->nik,
            'gender' => $this->gender,
            'birth_date' => $this->birth_date?->format('Y-m-d'),
            'age' => $this->age,
            'phone' => $this->phone,
            'address' => $this->address,
            'is_active' => (bool) $this->is_active,

            'ruangans' => $this->whenLoaded(
                'ruanganPasiens',
                function () {
                    return $this->ruanganPasiens
                        ->filter(
                            fn ($item) => $item->tanggal_keluar === null
                        )
                        ->filter(
                            fn ($item) => $item->ruangan !== null
                        )
                        ->values()
                        ->map(fn ($item) => [
                            'id' => $item->ruangan->id,
                            'code' => $item->ruangan->code,
                            'name' => $item->ruangan->name,
                            'category' => $item->ruangan->category,
                            'tanggal_masuk' => $item->tanggal_masuk?->format(
                                'Y-m-d'
                            ),
                        ])
                        ->all();
                },
            ),
        ];
    }
}
