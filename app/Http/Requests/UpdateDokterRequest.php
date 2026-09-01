<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateDokterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $dokterId = $this->route('dokter')->id;

        return [
            'code' => [
                'required',
                'string',
                'max:20',
                Rule::unique('dokters', 'code')->ignore($dokterId),
            ],

            'name' => [
                'required',
                'string',
                'max:255',
            ],

            'specialization' => [
                'nullable',
                'string',
                'max:255',
            ],

            'sip_number' => [
                'required',
                'string',
                'max:50',
                Rule::unique('dokters', 'sip_number')->ignore($dokterId),
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
