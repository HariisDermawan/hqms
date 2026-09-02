<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTestimonialRequest;
use App\Http\Requests\UpdateTestimonialRequest;
use App\Http\Resources\TestimonialResource;
use App\Models\Testimonial;
use App\Services\TestimonialService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Gate;

class TestimonialController extends Controller
{
    public function __construct(
        private readonly TestimonialService $testimonialService
    ) {}

    public function index(): JsonResponse
    {
        Gate::authorize('viewAny', Testimonial::class);

        $testimonials = $this->testimonialService->getAll();

        return response()->json([
            'success' => true,
            'message' => 'Testimonials retrieved successfully.',
            'data' => [
                'items' => TestimonialResource::collection(
                    $testimonials->items()
                ),
                'pagination' => [
                    'current_page' => $testimonials->currentPage(),
                    'per_page' => $testimonials->perPage(),
                    'total' => $testimonials->total(),
                    'last_page' => $testimonials->lastPage(),
                    'from' => $testimonials->firstItem(),
                    'to' => $testimonials->lastItem(),
                ],
            ],
        ]);
    }

    public function store(
        StoreTestimonialRequest $request
    ): JsonResponse {
        Gate::authorize('create', Testimonial::class);

        $testimonial = $this->testimonialService->create(
            $request->validated()
        );

        return response()->json([
            'success' => true,
            'message' => 'Testimonial created successfully.',
            'data' => [
                'testimonial' => new TestimonialResource($testimonial),
            ],
        ], 201);
    }

    public function show(Testimonial $testimonial): JsonResponse
    {
        Gate::authorize('view', $testimonial);

        return response()->json([
            'success' => true,
            'message' => 'Testimonial retrieved successfully.',
            'data' => [
                'testimonial' => new TestimonialResource(
                    $testimonial
                ),
            ],
        ]);
    }

    public function update(
        UpdateTestimonialRequest $request,
        Testimonial $testimonial
    ): JsonResponse {
        Gate::authorize('update', $testimonial);

        $testimonial = $this->testimonialService->update(
            $testimonial,
            $request->validated()
        );

        return response()->json([
            'success' => true,
            'message' => 'Testimonial updated successfully.',
            'data' => [
                'testimonial' => new TestimonialResource(
                    $testimonial
                ),
            ],
        ]);
    }

    public function destroy(Testimonial $testimonial): JsonResponse
    {
        Gate::authorize('delete', $testimonial);

        $this->testimonialService->delete($testimonial);

        return response()->json([
            'success' => true,
            'message' => 'Testimonial deleted successfully.',
            'data' => null,
        ]);
    }
}
