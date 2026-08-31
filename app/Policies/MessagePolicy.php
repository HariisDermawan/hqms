<?php

namespace App\Policies;

use App\Models\Message;
use App\Models\User;

class MessagePolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, Message $message): bool
    {
        return true;
    }

    public function create(User $user): bool
    {
        return true;
    }

    public function update(
        User $user,
        Message $message
    ): bool {
        return true;
    }

    public function delete(
        User $user,
        Message $message
    ): bool {
        return true;
    }
}

