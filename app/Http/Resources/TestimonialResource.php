<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TestimonialResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'role' => $this->role,
            'message' => $this->message,
            'rating' => $this->rating,
            'photo' => $this->photo,
            'sort_order' => $this->sort_order,
            'is_active' => $this->is_active,
        ];
    }
}

