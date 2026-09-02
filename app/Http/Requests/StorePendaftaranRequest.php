<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePendaftaranRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'antrian_id' => [
                'nullable',
                'integer',
                'exists:antrians,id',
            ],

            'pasien_id' => [
                'required',
                'integer',
                'exists:pasiens,id',
            ],

            'poli_id' => [
                'nullable',
                'integer',
                'exists:polis,id',
                'required_without:antrian_id',
            ],

            'registration_date' => [
                'required',
                'date',
            ],

            'notes' => [
                'nullable',
                'string',
            ],
        ];
    }
}
