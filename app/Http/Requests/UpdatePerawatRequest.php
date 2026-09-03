<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdatePerawatRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $perawatId = $this->route('perawat')->id;

        return [
            'code' => [
                'required',
                'string',
                'max:20',
                Rule::unique('perawats', 'code')->ignore($perawatId),
            ],

            'name' => [
                'required',
                'string',
                'max:255',
            ],

            'gender' => [
                'required',
                Rule::in(['L', 'P']),
            ],

            'str_number' => [
                'required',
                'string',
                'max:50',
                Rule::unique('perawats', 'str_number')->ignore($perawatId),
            ],

            'rfid_id' => [
                'nullable',
                'string',
                'max:64',
                Rule::unique('perawats', 'rfid_id')->ignore($perawatId),
            ],

            'phone' => [
                'nullable',
                'string',
                'max:20',
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
