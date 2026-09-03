<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePerawatRequest;
use App\Http\Requests\UpdatePerawatRequest;
use App\Http\Resources\PerawatResource;
use App\Models\Perawat;
use App\Services\PerawatService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class PerawatController extends Controller
{
    public function __construct(
        private readonly PerawatService $perawatService
    ) {}

    public function index(Request $request): JsonResponse
    {
        Gate::authorize('viewAny', Perawat::class);

        $perawats = $this->perawatService->getAll(
            min(100, $request->integer('per_page', 10))
        );

        return response()->json([
            'success' => true,
            'message' => 'Perawat retrieved successfully.',
            'data' => [
                'items' => PerawatResource::collection(
                    $perawats->items()
                ),
                'pagination' => [
                    'current_page' => $perawats->currentPage(),
                    'per_page' => $perawats->perPage(),
                    'total' => $perawats->total(),
                    'last_page' => $perawats->lastPage(),
                    'from' => $perawats->firstItem(),
                    'to' => $perawats->lastItem(),
                ],
            ],
        ]);
    }

    public function store(
        StorePerawatRequest $request
    ): JsonResponse {
        Gate::authorize('create', Perawat::class);

        $perawat = $this->perawatService->create(
            $request->validated()
        );

        return response()->json([
            'success' => true,
            'message' => 'Perawat created successfully.',
            'data' => [
                'perawat' => new PerawatResource($perawat),
            ],
        ], 201);
    }

    public function show(Perawat $perawat): JsonResponse
    {
        Gate::authorize('view', $perawat);

        return response()->json([
            'success' => true,
            'message' => 'Perawat retrieved successfully.',
            'data' => [
                'perawat' => new PerawatResource($perawat),
            ],
        ]);
    }

    public function update(
        UpdatePerawatRequest $request,
        Perawat $perawat
    ): JsonResponse {
        Gate::authorize('update', $perawat);

        $perawat = $this->perawatService->update(
            $perawat,
            $request->validated()
        );

        return response()->json([
            'success' => true,
            'message' => 'Perawat updated successfully.',
            'data' => [
                'perawat' => new PerawatResource($perawat),
            ],
        ]);
    }

    public function destroy(Perawat $perawat): JsonResponse
    {
        Gate::authorize('delete', $perawat);

        $this->perawatService->delete($perawat);

        return response()->json([
            'success' => true,
            'message' => 'Perawat deleted successfully.',
            'data' => null,
        ]);
    }
}
