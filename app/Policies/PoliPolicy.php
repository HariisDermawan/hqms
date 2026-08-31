<?php

namespace App\Policies;

use App\Models\Poli;
use App\Models\User;

class PoliPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->can('poli.view');
    }

    public function view(User $user, Poli $poli): bool
    {
        return $user->can('poli.view');
    }

    public function create(User $user): bool
    {
        return $user->can('poli.create');
    }

    public function update(User $user, Poli $poli): bool
    {
        return $user->can('poli.update');
    }

    public function delete(User $user, Poli $poli): bool
    {
        return $user->can('poli.delete');
    }
}
