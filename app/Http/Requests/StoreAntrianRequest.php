<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreAntrianRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'pendaftaran_id' => [
                'required',
                'integer',
                'exists:pendaftarans,id',
            ],

            'notes' => [
                'nullable',
                'string',
            ],
        ];
    }
}
