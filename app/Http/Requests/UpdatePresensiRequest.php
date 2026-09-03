<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdatePresensiRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $presensiId = $this->route('presensi')->id;

        return [
            'perawat_id' => [
                'required',
                'integer',
                'exists:perawats,id',
            ],

            'date' => [
                'required',
                'date',
                Rule::unique('presensis', 'date')
                    ->ignore($presensiId)
                    ->where('perawat_id', $this->input('perawat_id')),
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
