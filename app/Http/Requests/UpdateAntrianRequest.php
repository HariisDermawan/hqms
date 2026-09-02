<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateAntrianRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'status' => [
                'required',
                'in:waiting,called,serving,completed,skipped',
            ],

            'notes' => [
                'nullable',
                'string',
            ],
        ];
    }
}
