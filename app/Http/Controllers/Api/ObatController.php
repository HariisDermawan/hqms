<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreObatRequest;
use App\Http\Requests\UpdateObatRequest;
use App\Http\Resources\ObatResource;
use App\Models\Obat;
use App\Services\ObatService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Gate;

class ObatController extends Controller
{
    public function __construct(
        private readonly ObatService $obatService
    ) {}

    public function index(): JsonResponse
    {
        Gate::authorize('viewAny', Obat::class);

        $obats = $this->obatService->getAll();

        return response()->json([
            'success' => true,
            'message' => 'Obat retrieved successfully.',
            'data' => [
                'items' => ObatResource::collection(
                    $obats->items()
                ),
                'pagination' => [
                    'current_page' => $obats->currentPage(),
                    'per_page' => $obats->perPage(),
                    'total' => $obats->total(),
                    'last_page' => $obats->lastPage(),
                    'from' => $obats->firstItem(),
                    'to' => $obats->lastItem(),
                ],
            ],
        ]);
    }

    public function store(StoreObatRequest $request): JsonResponse
    {
        Gate::authorize('create', Obat::class);

        $obat = $this->obatService->create($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Obat created successfully.',
            'data' => [
                'obat' => new ObatResource($obat),
            ],
        ], 201);
    }

    public function show(Obat $obat): JsonResponse
    {
        Gate::authorize('view', $obat);

        $obat->load([
            'pemeriksaan.pasien',
            'pemeriksaan.poli',
            'pemeriksaan.antrian',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Obat retrieved successfully.',
            'data' => [
                'obat' => new ObatResource($obat),
            ],
        ]);
    }

    public function update(
        UpdateObatRequest $request,
        Obat $obat
    ): JsonResponse {
        Gate::authorize('update', $obat);

        $obat = $this->obatService->update($obat, $request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Obat updated successfully.',
            'data' => [
                'obat' => new ObatResource($obat),
            ],
        ]);
    }

    public function destroy(Obat $obat): JsonResponse
    {
        Gate::authorize('delete', $obat);

        $this->obatService->delete($obat);

        return response()->json([
            'success' => true,
            'message' => 'Obat deleted successfully.',
            'data' => null,
        ]);
    }
}
