<?php

namespace App\Policies;

use App\Models\Pemeriksaan;
use App\Models\User;

class PemeriksaanPolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(
        User $user,
        Pemeriksaan $pemeriksaan
    ): bool {
        return true;
    }

    public function create(User $user): bool
    {
        return true;
    }

    public function update(
        User $user,
        Pemeriksaan $pemeriksaan
    ): bool {
        return true;
    }

    public function delete(
        User $user,
        Pemeriksaan $pemeriksaan
    ): bool {
        return true;
    }
}
