<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateRuanganRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $ruangan = $this->route('ruangan');

        return [
            'code' => [
                'required',
                'string',
                'max:50',
                Rule::unique('ruangans', 'code')->ignore($ruangan->id),
            ],
            'name' => [
                'required',
                'string',
                'max:255',
            ],
            'category' => [
                'required',
                'string',
                'max:100',
            ],
            'description' => [
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
