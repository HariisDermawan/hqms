<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreFaqRequest;
use App\Http\Requests\UpdateFaqRequest;
use App\Http\Resources\FaqResource;
use App\Models\Faq;
use App\Services\FaqService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Gate;

class FaqController extends Controller
{
    public function __construct(
        private readonly FaqService $faqService
    ) {}

    public function index(): JsonResponse
    {
        Gate::authorize('viewAny', Faq::class);

        $faqs = $this->faqService->getAll();

        return response()->json([
            'success' => true,
            'message' => 'FAQ retrieved successfully.',
            'data' => [
                'items' => FaqResource::collection(
                    $faqs->items()
                ),
                'pagination' => [
                    'current_page' => $faqs->currentPage(),
                    'per_page' => $faqs->perPage(),
                    'total' => $faqs->total(),
                    'last_page' => $faqs->lastPage(),
                    'from' => $faqs->firstItem(),
                    'to' => $faqs->lastItem(),
                ],
            ],
        ]);
    }

    public function store(StoreFaqRequest $request): JsonResponse
    {
        Gate::authorize('create', Faq::class);

        $faq = $this->faqService->create(
            $request->validated()
        );

        return response()->json([
            'success' => true,
            'message' => 'FAQ created successfully.',
            'data' => [
                'faq' => new FaqResource($faq),
            ],
        ], 201);
    }

    public function show(Faq $faq): JsonResponse
    {
        Gate::authorize('view', $faq);

        return response()->json([
            'success' => true,
            'message' => 'FAQ retrieved successfully.',
            'data' => [
                'faq' => new FaqResource($faq),
            ],
        ]);
    }

    public function update(
        UpdateFaqRequest $request,
        Faq $faq
    ): JsonResponse {
        Gate::authorize('update', $faq);

        $faq = $this->faqService->update(
            $faq,
            $request->validated()
        );

        return response()->json([
            'success' => true,
            'message' => 'FAQ updated successfully.',
            'data' => [
                'faq' => new FaqResource($faq),
            ],
        ]);
    }

    public function destroy(Faq $faq): JsonResponse
    {
        Gate::authorize('delete', $faq);

        $this->faqService->delete($faq);

        return response()->json([
            'success' => true,
            'message' => 'FAQ deleted successfully.',
            'data' => null,
        ]);
    }
}
