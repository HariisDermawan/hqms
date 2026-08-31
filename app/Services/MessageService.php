<?php

namespace App\Services;

use App\Models\Message;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class MessageService
{
    public function getAll(): LengthAwarePaginator
    {
        return Message::query()
            ->latest('id')
            ->paginate(10);
    }

    public function create(array $data): Message
    {
        return DB::transaction(function () use ($data) {
            return Message::create([
                'name' => $data['name'],
                'email' => $data['email'],
                'phone' => $data['phone'] ?? null,
                'subject' => $data['subject'] ?? null,
                'message' => $data['message'],
                'status' => $data['status'] ?? 'unread',
                'admin_reply' => $data['admin_reply'] ?? null,
                'replied_at' => $data['replied_at'] ?? null,
            ]);
        });
    }

    public function update(
        Message $message,
        array $data
    ): Message {
        return DB::transaction(function () use (
            $message,
            $data
        ) {
            $message->update([
                'name' => $data['name'] ?? $message->name,
                'email' => $data['email'] ?? $message->email,
                'phone' => $data['phone'] ?? $message->phone,
                'subject' => $data['subject'] ?? $message->subject,
                'message' => $data['message'] ?? $message->message,
                'status' => $data['status'] ?? $message->status,
                'admin_reply' => $data['admin_reply']
                    ?? $message->admin_reply,
                'replied_at' => $data['replied_at']
                    ?? $message->replied_at,
            ]);

            return $message->fresh();
        });
    }

    public function delete(Message $message): void
    {
        DB::transaction(function () use ($message) {
            $message->delete();
        });
    }
}
