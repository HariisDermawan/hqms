<?php

namespace App\Policies;

use App\Models\Obat;
use App\Models\User;

class ObatPolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, Obat $obat): bool
    {
        return true;
    }

    public function create(User $user): bool
    {
        return true;
    }

    public function update(User $user, Obat $obat): bool
    {
        return true;
    }

    public function delete(User $user, Obat $obat): bool
    {
        return true;
    }
}
