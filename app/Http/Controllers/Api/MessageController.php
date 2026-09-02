<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreMessageRequest;
use App\Http\Requests\UpdateMessageRequest;
use App\Http\Resources\MessageResource;
use App\Models\Message;
use App\Services\MessageService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Gate;

class MessageController extends Controller
{
    public function __construct(
        private readonly MessageService $messageService
    ) {}

    public function index(): JsonResponse
    {
        Gate::authorize('viewAny', Message::class);

        $messages = $this->messageService->getAll();

        return response()->json([
            'success' => true,
            'message' => 'Messages retrieved successfully.',
            'data' => [
                'items' => MessageResource::collection(
                    $messages->items()
                ),
                'pagination' => [
                    'current_page' => $messages->currentPage(),
                    'per_page' => $messages->perPage(),
                    'total' => $messages->total(),
                    'last_page' => $messages->lastPage(),
                    'from' => $messages->firstItem(),
                    'to' => $messages->lastItem(),
                ],
            ],
        ]);
    }

    public function store(
        StoreMessageRequest $request
    ): JsonResponse {
        Gate::authorize('create', Message::class);

        $message = $this->messageService->create(
            $request->validated()
        );

        return response()->json([
            'success' => true,
            'message' => 'Message created successfully.',
            'data' => [
                'message' => new MessageResource($message),
            ],
        ], 201);
    }

    public function show(Message $message): JsonResponse
    {
        Gate::authorize('view', $message);

        return response()->json([
            'success' => true,
            'message' => 'Message retrieved successfully.',
            'data' => [
                'message' => new MessageResource($message),
            ],
        ]);
    }

    public function update(
        UpdateMessageRequest $request,
        Message $message
    ): JsonResponse {
        Gate::authorize('update', $message);

        $message = $this->messageService->update(
            $message,
            $request->validated()
        );

        return response()->json([
            'success' => true,
            'message' => 'Message updated successfully.',
            'data' => [
                'message' => new MessageResource($message),
            ],
        ]);
    }

    public function destroy(Message $message): JsonResponse
    {
        Gate::authorize('delete', $message);

        $this->messageService->delete($message);

        return response()->json([
            'success' => true,
            'message' => 'Message deleted successfully.',
            'data' => null,
        ]);
    }
}
