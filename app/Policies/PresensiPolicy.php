<?php

namespace App\Policies;

use App\Models\Presensi;
use App\Models\User;

class PresensiPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->can('attendance.view');
    }

    public function view(User $user, Presensi $presensi): bool
    {
        return $user->can('attendance.view');
    }

    public function create(User $user): bool
    {
        return $user->can('attendance.create');
    }

    public function update(User $user, Presensi $presensi): bool
    {
        return $user->can('attendance.update');
    }

    public function delete(User $user, Presensi $presensi): bool
    {
        return $user->can('attendance.delete');
    }
}
