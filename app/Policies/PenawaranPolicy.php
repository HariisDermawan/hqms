<?php

namespace App\Policies;

use App\Models\Penawaran;
use App\Models\User;

class PenawaranPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->can('offer.view');
    }

    public function view(User $user, Penawaran $penawaran): bool
    {
        return $user->can('offer.view');
    }

    public function create(User $user): bool
    {
        return $user->can('offer.create');
    }

    public function update(User $user, Penawaran $penawaran): bool
    {
        return $user->can('offer.update');
    }

    public function delete(User $user, Penawaran $penawaran): bool
    {
        return $user->can('offer.delete');
    }
}
