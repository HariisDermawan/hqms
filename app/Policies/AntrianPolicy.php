<?php

namespace App\Policies;

use App\Models\Antrian;
use App\Models\User;

class AntrianPolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, Antrian $antrian): bool
    {
        return true;
    }

    public function create(User $user): bool
    {
        return true;
    }

    public function update(User $user, Antrian $antrian): bool
    {
        return true;
    }

    public function delete(User $user, Antrian $antrian): bool
    {
        return true;
    }
}

