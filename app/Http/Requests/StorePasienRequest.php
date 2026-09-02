<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePasienRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'poli_id' => [
                'required',
                'integer',
                'exists:polis,id',
            ],

            'medical_record_number' => [
                'nullable',
                'string',
                'max:50',
                'unique:pasiens,medical_record_number',
            ],

            'name' => [
                'required',
                'string',
                'max:255',
            ],

            'nik' => [
                'required',
                'string',
                'digits:16',
                'unique:pasiens,nik',
            ],

            'gender' => [
                'required',
                'in:L,P',
            ],

            'birth_date' => [
                'required',
                'date',
            ],

            'phone' => [
                'nullable',
                'string',
                'max:20',
            ],

            'address' => [
                'nullable',
                'string',
            ],

            'is_active' => [
                'sometimes',
                'boolean',
            ],
        ];
    }
}
