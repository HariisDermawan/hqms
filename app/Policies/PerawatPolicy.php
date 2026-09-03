<?php

namespace App\Policies;

use App\Models\Perawat;
use App\Models\User;

class PerawatPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->can('nurse.view');
    }

    public function view(User $user, Perawat $perawat): bool
    {
        return $user->can('nurse.view');
    }

    public function create(User $user): bool
    {
        return $user->can('nurse.create');
    }

    public function update(User $user, Perawat $perawat): bool
    {
        return $user->can('nurse.update');
    }

    public function delete(User $user, Perawat $perawat): bool
    {
        return $user->can('nurse.delete');
    }
}
