<?php

namespace App\Policies;

use App\Models\Dokter;
use App\Models\User;

class DokterPolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, Dokter $dokter): bool
    {
        return true;
    }

    public function create(User $user): bool
    {
        return true;
    }

    public function update(User $user, Dokter $dokter): bool
    {
        return true;
    }

    public function delete(User $user, Dokter $dokter): bool
    {
        return true;
    }
}
