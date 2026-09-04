<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateObatRequest extends FormRequest
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

            'nama_obat' => [
                'required',
                'string',
                'max:255',
            ],

            'dosis' => [
                'nullable',
                'string',
                'max:100',
            ],

            'jumlah' => [
                'nullable',
                'integer',
                'min:1',
            ],

            'satuan' => [
                'nullable',
                'string',
                'max:50',
            ],

            'harga' => [
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
