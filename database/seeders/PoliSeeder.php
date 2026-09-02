<?php

namespace Database\Seeders;

use App\Models\Poli;
use Illuminate\Database\Seeder;

class PoliSeeder extends Seeder
{
    public function run(): void
    {
        $polis = [
            [
                'code' => 'PLUM',
                'queue_prefix' => 'A',
                'name' => 'Poli Umum',
                'description' => 'Pelayanan kesehatan umum.',
                'image' => 'polis/default.jpg',
                'is_active' => true,
            ],
            [
                'code' => 'PLMA',
                'queue_prefix' => 'B',
                'name' => 'Poli Mata',
                'description' => 'Pelayanan kesehatan mata.',
                'image' => 'polis/default.jpg',
                'is_active' => true,
            ],
            [
                'code' => 'PLJA',
                'queue_prefix' => 'C',
                'name' => 'Poli Jantung',
                'description' => 'Pelayanan kesehatan jantung.',
                'image' => 'polis/default.jpg',
                'is_active' => true,
            ],
            [
                'code' => 'PLAN',
                'queue_prefix' => 'D',
                'name' => 'Poli Anak',
                'description' => 'Pelayanan kesehatan anak.',
                'image' => 'polis/default.jpg',
                'is_active' => true,
            ],
            [
                'code' => 'PLGI',
                'queue_prefix' => 'E',
                'name' => 'Poli Gigi',
                'description' => 'Pelayanan kesehatan gigi dan mulut.',
                'image' => 'polis/default.jpg',
                'is_active' => true,
            ],
        ];

        foreach ($polis as $poli) {
            Poli::updateOrCreate(
                ['code' => $poli['code']],
                $poli
            );
        }
    }
}
