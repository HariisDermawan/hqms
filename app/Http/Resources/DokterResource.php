<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DokterResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'code' => $this->code,
            'name' => $this->name,
            'specialization' => $this->specialization,
            'sip_number' => $this->sip_number,
            'phone' => $this->phone,
            'is_active' => $this->is_active,
        ];
    }
}

