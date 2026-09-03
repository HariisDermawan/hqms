<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class PerawatResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'code' => $this->code,
            'name' => $this->name,
            'gender' => $this->gender,
            'gender_label' => $this->gender === 'P' ? 'Perempuan' : 'Laki-laki',
            'str_number' => $this->str_number,
            'rfid_id' => $this->rfid_id,
            'phone' => $this->phone,

            'image_url' => $this->image
                ? Storage::disk('public')->url($this->image)
                : null,

            'is_active' => $this->is_active,
        ];
    }
}
