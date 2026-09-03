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

            'loket' => [
                'nullable',
                'integer',
                'min:1',
                'max:3',
            ],

            'notes' => [
                'nullable',
                'string',
            ],
        ];
    }
}
