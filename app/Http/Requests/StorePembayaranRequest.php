<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePembayaranRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'pemeriksaan_id' => [
                'required',
                'integer',
                'exists:pemeriksaans,id',
            ],

            'total' => [
                'nullable',
                'numeric',
                'min:0',
            ],

            'metode' => [
                'required',
                'string',
                'in:cash,transfer,debit,credit,qris',
            ],

            'status' => [
                'required',
                'string',
                'in:unpaid,paid,refunded,cancelled',
            ],

            'tanggal' => [
                'required',
                'date',
            ],

            'detail_items' => [
                'nullable',
                'array',
            ],

            'detail_items.*.description' => [
                'required',
                'string',
                'max:255',
            ],

            'detail_items.*.quantity' => [
                'nullable',
                'integer',
                'min:1',
            ],

            'detail_items.*.unit_price' => [
                'nullable',
                'numeric',
                'min:0',
            ],

            'keterangan' => [
                'nullable',
                'string',
            ],
        ];
    }
}
