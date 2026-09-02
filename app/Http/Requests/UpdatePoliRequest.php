<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdatePoliRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $poli = $this->route('poli');

        return [
            'code' => [
                'required',
                'string',
                'max:50',
                Rule::unique('polis', 'code')->ignore($poli->id),
            ],
            'queue_prefix' => [
                'nullable',
                'string',
                'size:1',
                'regex:/^[A-Za-z]$/',
                Rule::unique('polis', 'queue_prefix')->ignore($poli->id),
            ],
            'name' => [
                'required',
                'string',
                'max:255',
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
