<?php

namespace App\Http\Requests;

use App\Models\Fasilitas;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateFasilitasRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $fasilitas = $this->route('fasilitas');

        return [
            'name' => [
                'required',
                'string',
                'max:255',
            ],
            'slug' => [
                'required',
                'string',
                'max:255',
                Rule::unique('fasilitas', 'slug')->ignore(
                    $fasilitas instanceof Fasilitas ? $fasilitas->id : $fasilitas
                ),
            ],
            'description' => [
                'nullable',
                'string',
            ],
            'image' => [
                'nullable',
                'image',
                'mimes:jpg,jpeg,png,webp',
                'max:2048',
            ],
            'is_active' => [
                'sometimes',
                'boolean',
            ],
        ];
    }
}
