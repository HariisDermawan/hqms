<?php

namespace App\Policies;

use App\Models\Pendaftaran;
use App\Models\User;

class PendaftaranPolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, Pendaftaran $pendaftaran): bool
    {
        return true;
    }

    public function create(User $user): bool
    {
        return true;
    }

    public function update(User $user, Pendaftaran $pendaftaran): bool
    {
        return true;
    }

    public function delete(User $user, Pendaftaran $pendaftaran): bool
    {
        return true;
    }
}
