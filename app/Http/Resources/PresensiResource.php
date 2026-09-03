<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class PresensiResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'perawat_id' => $this->perawat_id,
            'date' => $this->date->toDateString(),
            'time_in' => $this->time_in,
            'time_out' => $this->time_out,
            'status' => $this->status,
            'note' => $this->note,
            'perawat' => $this->whenLoaded('perawat', function () {
                return [
                    'id' => $this->perawat->id,
                    'name' => $this->perawat->name,
                    'code' => $this->perawat->code,
                    'str_number' => $this->perawat->str_number,
                    'gender' => $this->perawat->gender,
                    'gender_label' => $this->perawat->gender === 'P'
                            ? 'Perempuan'
                            : 'Laki-laki',
                    'image_url' => $this->perawat->image
                        ? Storage::disk(
                            'public'
                        )->url($this->perawat->image)
                        : null,
                ];
            }),
        ];
    }
}
