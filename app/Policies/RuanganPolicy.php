<?php

namespace App\Policies;

use App\Models\Ruangan;
use App\Models\User;

class RuanganPolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, Ruangan $ruangan): bool
    {
        return true;
    }

    public function create(User $user): bool
    {
        return true;
    }

    public function update(User $user, Ruangan $ruangan): bool
    {
        return true;
    }

    public function delete(User $user, Ruangan $ruangan): bool
    {
        return true;
    }
}
