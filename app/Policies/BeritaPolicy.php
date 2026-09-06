<?php

namespace App\Policies;

use App\Models\Berita;
use App\Models\User;

class BeritaPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->can('news.view');
    }

    public function view(User $user, Berita $berita): bool
    {
        return $user->can('news.view');
    }

    public function create(User $user): bool
    {
        return $user->can('news.create');
    }

    public function update(User $user, Berita $berita): bool
    {
        return $user->can('news.update');
    }

    public function delete(User $user, Berita $berita): bool
    {
        return $user->can('news.delete');
    }
}
