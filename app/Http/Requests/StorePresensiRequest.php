<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StorePresensiRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'perawat_id' => [
                'required',
                'integer',
                'exists:perawats,id',
            ],

            'date' => [
                'required',
                'date',
            ],

            'time_in' => [
                'nullable',
                'date_format:H:i',
            ],

            'time_out' => [
                'nullable',
                'date_format:H:i',
            ],

            'status' => [
                'required',
                Rule::in(['hadir', 'ijin', 'sakit', 'cuti', 'alpa']),
            ],

            'note' => [
                'nullable',
                'string',
                'max:1000',
            ],
        ];
    }
}
