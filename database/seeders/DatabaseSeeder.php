<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            RolePermissionSeeder::class,
            AdminSeeder::class,
            PoliSeeder::class,
            PasienSeeder::class,
            PendaftaranSeeder::class,
            AntrianSeeder::class,
            DokterSeeder::class,
        ]);
    }
}
