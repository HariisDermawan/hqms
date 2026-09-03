<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePresensiRequest;
use App\Http\Requests\UpdatePresensiRequest;
use App\Http\Resources\PresensiResource;
use App\Models\Presensi;
use App\Services\PresensiService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class PresensiController extends Controller
{
    public function __construct(
        private readonly PresensiService $presensiService
    ) {}

    public function index(Request $request): JsonResponse
    {
        Gate::authorize('viewAny', Presensi::class);

        $presensis = $this->presensiService->getAll(
            min(100, $request->integer('per_page', 10))
        );

        return response()->json([
            'success' => true,
            'message' => 'Presensi retrieved successfully.',
            'data' => [
                'items' => PresensiResource::collection(
                    $presensis->items()
                ),
                'pagination' => [
                    'current_page' => $presensis->currentPage(),
                    'per_page' => $presensis->perPage(),
                    'total' => $presensis->total(),
                    'last_page' => $presensis->lastPage(),
                    'from' => $presensis->firstItem(),
                    'to' => $presensis->lastItem(),
                ],
            ],
        ]);
    }

    public function store(StorePresensiRequest $request): JsonResponse
    {
        Gate::authorize('create', Presensi::class);

        $presensi = $this->presensiService->upsert(
            $request->validated()
        );

        return response()->json([
            'success' => true,
            'message' => 'Presensi saved successfully.',
            'data' => [
                'presensi' => new PresensiResource(
                    $presensi->load('perawat')
                ),
            ],
        ], 201);
    }

    public function show(Presensi $presensi): JsonResponse
    {
        Gate::authorize('view', $presensi);

        return response()->json([
            'success' => true,
            'message' => 'Presensi retrieved successfully.',
            'data' => [
                'presensi' => new PresensiResource(
                    $presensi->load('perawat')
                ),
            ],
        ]);
    }

    public function update(
        UpdatePresensiRequest $request,
        Presensi $presensi
    ): JsonResponse {
        Gate::authorize('update', $presensi);

        $presensi = $this->presensiService->update(
            $presensi,
            $request->validated()
        );

        return response()->json([
            'success' => true,
            'message' => 'Presensi updated successfully.',
            'data' => [
                'presensi' => new PresensiResource($presensi),
            ],
        ]);
    }

    public function destroy(Presensi $presensi): JsonResponse
    {
        Gate::authorize('delete', $presensi);

        $this->presensiService->delete($presensi);

        return response()->json([
            'success' => true,
            'message' => 'Presensi deleted successfully.',
            'data' => null,
        ]);
    }
}
