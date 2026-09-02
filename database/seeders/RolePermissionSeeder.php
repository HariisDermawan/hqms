<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        $permissions = [
            // User
            'user.view',
            'user.create',
            'user.update',
            'user.delete',

            // Poli
            'poli.view',
            'poli.create',
            'poli.update',
            'poli.delete',

            // Ruangan
            'ruangan.view',
            'ruangan.create',
            'ruangan.update',
            'ruangan.delete',

            // Dokter
            'doctor.view',
            'doctor.create',
            'doctor.update',
            'doctor.delete',

            // Jadwal Dokter
            'schedule.view',
            'schedule.create',
            'schedule.update',
            'schedule.delete',

            // Pasien
            'patient.view',
            'patient.create',
            'patient.update',
            'patient.delete',

            // Antrean
            'queue.view',
            'queue.create',
            'queue.call',
            'queue.recall',
            'queue.skip',
            'queue.complete',
            'queue.cancel',

            // Monitoring Antrean
            'queue.monitor',

            // Artikel
            'article.view',
            'article.create',
            'article.update',
            'article.delete',

            // Berita
            'news.view',
            'news.create',
            'news.update',
            'news.delete',

            // Pengumuman
            'announcement.view',
            'announcement.create',
            'announcement.update',
            'announcement.delete',

            // Dashboard
            'dashboard.view',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate([
                'name' => $permission,
                'guard_name' => 'web',
            ]);
        }

        $roles = [
            'Super Admin',
            'Admin',
            'Petugas',
            'Dokter',
            'Perawat',
            'Apotek',
            'Kasir',
            'Pasien',
        ];

        foreach ($roles as $role) {
            Role::firstOrCreate([
                'name' => $role,
                'guard_name' => 'web',
            ]);
        }

        Role::findByName('Super Admin', 'web')
            ->syncPermissions(Permission::all());

        Role::findByName('Admin', 'web')
            ->syncPermissions([
                'user.view',
                'user.create',
                'user.update',

                'poli.view',
                'poli.create',
                'poli.update',
                'poli.delete',

                'ruangan.view',
                'ruangan.create',
                'ruangan.update',
                'ruangan.delete',

                'doctor.view',
                'doctor.create',
                'doctor.update',
                'doctor.delete',

                'schedule.view',
                'schedule.create',
                'schedule.update',
                'schedule.delete',

                'patient.view',
                'patient.create',
                'patient.update',
                'patient.delete',

                'queue.view',
                'queue.create',
                'queue.call',
                'queue.recall',
                'queue.skip',
                'queue.complete',
                'queue.cancel',
                'queue.monitor',

                'article.view',
                'article.create',
                'article.update',
                'article.delete',

                'news.view',
                'news.create',
                'news.update',
                'news.delete',

                'announcement.view',
                'announcement.create',
                'announcement.update',
                'announcement.delete',

                'dashboard.view',
            ]);

        Role::findByName('Petugas', 'web')
            ->syncPermissions([
                'poli.view',
                'doctor.view',
                'schedule.view',
                'patient.view',
                'patient.create',
                'patient.update',

                'queue.view',
                'queue.create',
                'queue.call',
                'queue.recall',
                'queue.skip',
                'queue.complete',
                'queue.cancel',
                'queue.monitor',

                'dashboard.view',
            ]);

        Role::findByName('Dokter', 'web')
            ->syncPermissions([
                'poli.view',
                'doctor.view',
                'schedule.view',
                'patient.view',

                'queue.view',
                'queue.call',
                'queue.recall',
                'queue.skip',
                'queue.complete',
            ]);

        Role::findByName('Perawat', 'web')
            ->syncPermissions([
                'poli.view',
                'doctor.view',
                'schedule.view',
                'patient.view',

                'queue.view',
                'queue.call',
                'queue.recall',
                'queue.skip',
                'queue.complete',
            ]);

        Role::findByName('Apotek', 'web')
            ->syncPermissions([
                'patient.view',
                'queue.view',
                'dashboard.view',
            ]);

        Role::findByName('Kasir', 'web')
            ->syncPermissions([
                'patient.view',
                'queue.view',
                'dashboard.view',
            ]);

        Role::findByName('Pasien', 'web')
            ->syncPermissions([
                'poli.view',
                'doctor.view',
                'schedule.view',
                'queue.view',
            ]);

        app()[PermissionRegistrar::class]->forgetCachedPermissions();
    }
}
