<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePoliRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'code' => [
                'required',
                'string',
                'max:50',
                'unique:polis,code',
            ],
            'queue_prefix' => [
                'nullable',
                'string',
                'size:1',
                'regex:/^[A-Za-z]$/',
                'unique:polis,queue_prefix',
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
                'required',
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
