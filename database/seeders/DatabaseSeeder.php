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
            RuanganSeeder::class,
            PasienSeeder::class,
            PendaftaranSeeder::class,
            AntrianSeeder::class,
            DokterSeeder::class,
            PerawatSeeder::class,
            PresensiSeeder::class,
            JadwalDokterSeeder::class,
            PemeriksaanSeeder::class,
            ObatSeeder::class,
            PembayaranSeeder::class,
            FaqSeeder::class,
            TestimonialSeeder::class,
            MessageSeeder::class,
        ]);
    }
}
