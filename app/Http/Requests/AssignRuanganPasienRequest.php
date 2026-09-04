<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class AssignRuanganPasienRequest extends FormRequest
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
                Rule::exists('pasiens', 'id'),
            ],
            'antrian_id' => [
                'nullable',
                'integer',
                Rule::exists('antrians', 'id'),
            ],
            'pendaftaran_id' => [
                'nullable',
                'integer',
                Rule::exists('pendaftarans', 'id'),
            ],
            'tanggal_masuk' => [
                'nullable',
                'date',
            ],
        ];
    }
}
