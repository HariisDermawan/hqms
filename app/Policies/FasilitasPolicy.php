<?php

namespace App\Policies;

use App\Models\Fasilitas;
use App\Models\User;

class FasilitasPolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, Fasilitas $fasilitas): bool
    {
        return true;
    }

    public function create(User $user): bool
    {
        return true;
    }

    public function update(User $user, Fasilitas $fasilitas): bool
    {
        return true;
    }

    public function delete(User $user, Fasilitas $fasilitas): bool
    {
        return true;
    }
}
