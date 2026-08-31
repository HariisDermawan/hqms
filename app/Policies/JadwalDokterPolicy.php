<?php

namespace App\Policies;

use App\Models\JadwalDokter;
use App\Models\User;

class JadwalDokterPolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(
        User $user,
        JadwalDokter $jadwalDokter
    ): bool {
        return true;
    }

    public function create(User $user): bool
    {
        return true;
    }

    public function update(
        User $user,
        JadwalDokter $jadwalDokter
    ): bool {
        return true;
    }

    public function delete(
        User $user,
        JadwalDokter $jadwalDokter
    ): bool {
        return true;
    }
}
