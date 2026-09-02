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
            'pasien_id' => [
                'required',
                'integer',
                'exists:pasiens,id',
            ],

            'poli_id' => [
                'required',
                'integer',
                'exists:polis,id',
            ],

            'dokter_id' => [
                'nullable',
                'integer',
                'exists:dokters,id',
            ],

            'category' => [
                'required',
                'string',
                'max:100',
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
