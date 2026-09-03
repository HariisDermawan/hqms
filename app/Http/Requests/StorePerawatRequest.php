<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StorePerawatRequest extends FormRequest
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
                'max:20',
                'unique:perawats,code',
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
                'unique:perawats,str_number',
            ],

            'rfid_id' => [
                'nullable',
                'string',
                'max:64',
                'unique:perawats,rfid_id',
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
