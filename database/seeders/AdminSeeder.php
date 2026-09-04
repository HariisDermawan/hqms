<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::updateOrCreate(
            [
                'email' => 'admin@hqms',
            ],
            [
                'name' => 'Admin HQMS',
                'password' => Hash::make('password'),
            ]
        );

        $admin->syncRoles(['Super Admin']);

        $roleAccounts = [
            'Staf Loket' => [
                'staf_loket@hqms' => 'Staf Loket',
            ],
            'Staf Obat' => [
                'staf_obat@hqms' => 'Staf Obat',
            ],
            'Dokter' => [
                'dr.budi@hqms' => 'dr. Budi Santoso',
                'drg.siti@hqms' => 'drg. Siti Aminah',
                'dr.andi@hqms' => 'dr. Andi Wijaya',
                'dr.dewi@hqms' => 'dr. Dewi Lestari',
                'dr.rahmat@hqms' => 'dr. Rahmat Hidayat',
            ],
        ];

        foreach ($roleAccounts as $role => $accounts) {
            foreach ($accounts as $email => $name) {
                $user = User::updateOrCreate(
                    [
                        'email' => $email,
                    ],
                    [
                        'name' => $name,
                        'password' => Hash::make('password'),
                    ]
                );

                $user->syncRoles([$role]);
            }
        }
    }
}
