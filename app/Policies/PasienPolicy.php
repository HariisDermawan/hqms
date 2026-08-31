<?php

namespace App\Policies;

use App\Models\Pasien;
use App\Models\User;

class PasienPolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, Pasien $pasien): bool
    {
        return true;
    }

    public function create(User $user): bool
    {
        return true;
    }

    public function update(User $user, Pasien $pasien): bool
    {
        return true;
    }

    public function delete(User $user, Pasien $pasien): bool
    {
        return true;
    }
}
