<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePendaftaranRequest extends FormRequest
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

            'registration_date' => [
                'required',
                'date',
            ],

            'status' => [
                'required',
                'in:waiting,called,serving,completed,cancelled',
            ],

            'notes' => [
                'nullable',
                'string',
            ],
        ];
    }
}

