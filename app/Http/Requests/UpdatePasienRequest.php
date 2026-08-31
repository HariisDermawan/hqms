<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdatePasienRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $pasienId = $this->route('pasien')?->id;

        return [
            'poli_id' => [
                'required',
                'integer',
                'exists:polis,id',
            ],

            'medical_record_number' => [
                'required',
                'string',
                'max:50',
                Rule::unique('pasiens', 'medical_record_number')
                    ->ignore($pasienId),
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
                Rule::unique('pasiens', 'nik')
                    ->ignore($pasienId),
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
