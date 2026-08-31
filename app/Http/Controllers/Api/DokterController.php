<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreDokterRequest;
use App\Http\Requests\UpdateDokterRequest;
use App\Http\Resources\DokterResource;
use App\Models\Dokter;
use App\Services\DokterService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Gate;

class DokterController extends Controller
{
    public function __construct(
        private readonly DokterService $dokterService
    ) {}

    public function index(): JsonResponse
    {
        Gate::authorize('viewAny', Dokter::class);

        $dokters = $this->dokterService->getAll();

        return response()->json([
            'success' => true,
            'message' => 'Dokter retrieved successfully.',
            'data' => [
                'items' => DokterResource::collection(
                    $dokters->items()
                ),
                'pagination' => [
                    'current_page' => $dokters->currentPage(),
                    'per_page' => $dokters->perPage(),
                    'total' => $dokters->total(),
                    'last_page' => $dokters->lastPage(),
                    'from' => $dokters->firstItem(),
                    'to' => $dokters->lastItem(),
                ],
            ],
        ]);
    }

    public function store(
        StoreDokterRequest $request
    ): JsonResponse {
        Gate::authorize('create', Dokter::class);

        $dokter = $this->dokterService->create(
            $request->validated()
        );

        return response()->json([
            'success' => true,
            'message' => 'Dokter created successfully.',
            'data' => [
                'dokter' => new DokterResource($dokter),
            ],
        ], 201);
    }

    public function show(Dokter $dokter): JsonResponse
    {
        Gate::authorize('view', $dokter);

        return response()->json([
            'success' => true,
            'message' => 'Dokter retrieved successfully.',
            'data' => [
                'dokter' => new DokterResource($dokter),
            ],
        ]);
    }

    public function update(
        UpdateDokterRequest $request,
        Dokter $dokter
    ): JsonResponse {
        Gate::authorize('update', $dokter);

        $dokter = $this->dokterService->update(
            $dokter,
            $request->validated()
        );

        return response()->json([
            'success' => true,
            'message' => 'Dokter updated successfully.',
            'data' => [
                'dokter' => new DokterResource($dokter),
            ],
        ]);
    }

    public function destroy(Dokter $dokter): JsonResponse
    {
        Gate::authorize('delete', $dokter);

        $this->dokterService->delete($dokter);

        return response()->json([
            'success' => true,
            'message' => 'Dokter deleted successfully.',
            'data' => null,
        ]);
    }
}

