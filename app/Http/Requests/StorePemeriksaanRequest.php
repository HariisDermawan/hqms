<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePemeriksaanRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'antrian_id' => [
                'required',
                'integer',
                'exists:antrians,id',
            ],

            'dokter_id' => [
                'required',
                'integer',
                'exists:dokters,id',
            ],

            'examined_at' => [
                'required',
                'date',
            ],

            'complaint' => [
                'nullable',
                'string',
            ],

            'diagnosis' => [
                'nullable',
                'string',
            ],

            'treatment' => [
                'nullable',
                'string',
            ],

            'notes' => [
                'nullable',
                'string',
            ],
        ];
    }
}

