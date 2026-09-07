<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreFasilitasRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
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
                'unique:fasilitas,slug',
            ],
            'description' => [
                'nullable',
                'string',
            ],
            'is_active' => [
                'sometimes',
                'boolean',
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'slug.unique' => 'Slug sudah digunakan.',
            'name.required' => 'Nama fasilitas wajib diisi.',
            'slug.required' => 'Slug wajib diisi.',
        ];
    }
}
