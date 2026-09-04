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

            // Perawat
            'nurse.view',
            'nurse.create',
            'nurse.update',
            'nurse.delete',

            // Presensi
            'attendance.view',
            'attendance.create',
            'attendance.update',
            'attendance.delete',

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

            // Obat
            'medicine.view',
            'medicine.create',
            'medicine.update',
            'medicine.delete',

            // Pembayaran
            'payment.view',
            'payment.create',
            'payment.update',
            'payment.delete',

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
            'Dokter',
            'Staf Loket',
            'Staf Obat',
            'Perawat',
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

                'nurse.view',
                'nurse.create',
                'nurse.update',
                'nurse.delete',

                'attendance.view',
                'attendance.create',
                'attendance.update',
                'attendance.delete',

                'schedule.view',
                'schedule.create',
                'schedule.update',
                'schedule.delete',

                'patient.view',
                'patient.create',
                'patient.update',
                'patient.delete',

                'medicine.view',
                'medicine.create',
                'medicine.update',
                'medicine.delete',

                'payment.view',
                'payment.create',
                'payment.update',
                'payment.delete',

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

        Role::findByName('Dokter', 'web')
            ->syncPermissions([
                'poli.view',
                'doctor.view',
                'schedule.view',
                'patient.view',

                'medicine.view',
                'medicine.create',

                'queue.view',
                'queue.call',
                'queue.recall',
                'queue.skip',
                'queue.complete',
            ]);

        Role::findByName('Staf Loket', 'web')
            ->syncPermissions([
                'poli.view',
                'schedule.view',
                'ruangan.view',
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

        Role::findByName('Staf Obat', 'web')
            ->syncPermissions([
                'patient.view',
                'queue.view',
                'medicine.view',
                'medicine.create',
                'medicine.update',
                'payment.view',

                'dashboard.view',
            ]);

        Role::findByName('Perawat', 'web')
            ->syncPermissions([
                'poli.view',
                'doctor.view',
                'schedule.view',
                'patient.view',
                'ruangan.view',

                'nurse.view',
                'nurse.create',
                'nurse.update',

                'attendance.view',
                'attendance.create',
                'attendance.update',

                'queue.view',
                'queue.call',
                'queue.recall',
                'queue.skip',
                'queue.complete',

                'dashboard.view',
            ]);

        foreach (['Petugas', 'Apotek', 'Kasir', 'Pasien'] as $obsolete) {
            $role = Role::where('name', $obsolete)
                ->where('guard_name', 'web')
                ->first();

            if ($role !== null) {
                $role->users()->detach();
                $role->permissions()->detach();
                $role->delete();
            }
        }

        app()[PermissionRegistrar::class]->forgetCachedPermissions();
    }
}
