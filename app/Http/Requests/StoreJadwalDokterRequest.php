<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreJadwalDokterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'dokter_id' => [
                'required',
                'integer',
                'exists:dokters,id',
            ],

            'poli_id' => [
                'required',
                'integer',
                'exists:polis,id',
            ],

            'day' => [
                'required',
                'in:monday,tuesday,wednesday,thursday,friday,saturday,sunday',
            ],

            'start_time' => [
                'required',
                'date_format:H:i',
            ],

            'end_time' => [
                'required',
                'date_format:H:i',
                'after:start_time',
            ],

            'is_active' => [
                'sometimes',
                'boolean',
            ],
        ];
    }
}
