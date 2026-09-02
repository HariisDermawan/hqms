<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePasienRequest;
use App\Http\Requests\UpdatePasienRequest;
use App\Http\Resources\PasienResource;
use App\Models\Pasien;
use App\Services\PasienService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class PasienController extends Controller
{
    public function __construct(
        private readonly PasienService $pasienService
    ) {}

    /**
     * Display a listing of patients.
     */
    public function index(Request $request): JsonResponse
    {
        Gate::authorize('viewAny', Pasien::class);

        $pasiens = $this->pasienService->getAll(
            min(100, $request->integer('per_page', 10))
        );

        return response()->json([
            'success' => true,
            'message' => 'Pasien retrieved successfully.',
            'data' => [
                'items' => PasienResource::collection($pasiens->items()),
                'pagination' => [
                    'current_page' => $pasiens->currentPage(),
                    'per_page' => $pasiens->perPage(),
                    'total' => $pasiens->total(),
                    'last_page' => $pasiens->lastPage(),
                    'from' => $pasiens->firstItem(),
                    'to' => $pasiens->lastItem(),
                ],
            ],
        ]);
    }

    /**
     * Store a newly created patient.
     */
    public function store(StorePasienRequest $request): JsonResponse
    {
        Gate::authorize('create', Pasien::class);

        $pasien = $this->pasienService->create(
            $request->validated()
        );

        return response()->json([
            'success' => true,
            'message' => 'Pasien created successfully.',
            'data' => [
                'pasien' => new PasienResource($pasien),
            ],
        ], 201);
    }

    /**
     * Display the specified patient.
     */
    public function show(Pasien $pasien): JsonResponse
    {
        Gate::authorize('view', $pasien);

        $pasien->load('poli');

        return response()->json([
            'success' => true,
            'message' => 'Pasien retrieved successfully.',
            'data' => [
                'pasien' => new PasienResource($pasien),
            ],
        ]);
    }

    /**
     * Update the specified patient.
     */
    public function update(
        UpdatePasienRequest $request,
        Pasien $pasien
    ): JsonResponse {
        Gate::authorize('update', $pasien);

        $pasien = $this->pasienService->update(
            $pasien,
            $request->validated()
        );

        return response()->json([
            'success' => true,
            'message' => 'Pasien updated successfully.',
            'data' => [
                'pasien' => new PasienResource($pasien),
            ],
        ]);
    }

    /**
     * Remove the specified patient.
     */
    public function destroy(Pasien $pasien): JsonResponse
    {
        Gate::authorize('delete', $pasien);

        $this->pasienService->delete($pasien);

        return response()->json([
            'success' => true,
            'message' => 'Pasien deleted successfully.',
            'data' => null,
        ]);
    }
}
