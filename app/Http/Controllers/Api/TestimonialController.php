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
use Illuminate\Support\Facades\Storage;

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

        $data = $request->validated();

        if ($request->hasFile('photo')) {
            $data['photo'] = $request
                ->file('photo')
                ->store('testimonials', 'public');
        }

        $testimonial = $this->testimonialService->create($data);

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

        $data = $request->validated();

        if ($request->hasFile('photo')) {
            if ($testimonial->photo) {
                Storage::disk('public')->delete(
                    $testimonial->photo
                );
            }

            $data['photo'] = $request
                ->file('photo')
                ->store('testimonials', 'public');
        }

        $testimonial = $this->testimonialService->update(
            $testimonial,
            $data
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

        if ($testimonial->photo) {
            Storage::disk('public')->delete(
                $testimonial->photo
            );
        }

        $this->testimonialService->delete($testimonial);

        return response()->json([
            'success' => true,
            'message' => 'Testimonial deleted successfully.',
            'data' => null,
        ]);
    }
}
