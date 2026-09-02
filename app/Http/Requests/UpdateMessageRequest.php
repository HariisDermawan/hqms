<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateMessageRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => [
                'sometimes',
                'required',
                'string',
                'max:255',
            ],

            'email' => [
                'sometimes',
                'required',
                'email',
                'max:255',
            ],

            'phone' => [
                'sometimes',
                'nullable',
                'string',
                'max:30',
            ],

            'subject' => [
                'sometimes',
                'nullable',
                'string',
                'max:255',
            ],

            'message' => [
                'sometimes',
                'required',
                'string',
            ],

            'status' => [
                'sometimes',
                Rule::in([
                    'unread',
                    'read',
                    'replied',
                ]),
            ],

            'admin_reply' => [
                'sometimes',
                'nullable',
                'string',
            ],

            'replied_at' => [
                'sometimes',
                'nullable',
                'date',
            ],
        ];
    }
}
