<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreAntrianRequest;
use App\Http\Requests\UpdateAntrianRequest;
use App\Http\Resources\AntrianResource;
use App\Models\Antrian;
use App\Services\AntrianService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class AntrianController extends Controller
{
    public function __construct(
        private readonly AntrianService $antrianService
    ) {}

    /**
     * Display a listing of queues.
     */
    public function index(Request $request): JsonResponse
    {
        Gate::authorize('viewAny', Antrian::class);

        $antrians = $this->antrianService->getAll(
            min(100, $request->integer('per_page', 10))
        );

        return response()->json([
            'success' => true,
            'message' => 'Antrian retrieved successfully.',
            'data' => [
                'items' => AntrianResource::collection(
                    $antrians->items()
                ),
                'pagination' => [
                    'current_page' => $antrians->currentPage(),
                    'per_page' => $antrians->perPage(),
                    'total' => $antrians->total(),
                    'last_page' => $antrians->lastPage(),
                    'from' => $antrians->firstItem(),
                    'to' => $antrians->lastItem(),
                ],
            ],
        ]);
    }

    /**
     * Store a newly created queue.
     */
    public function store(
        StoreAntrianRequest $request
    ): JsonResponse {
        Gate::authorize('create', Antrian::class);

        $antrian = $this->antrianService->create(
            $request->validated()
        );

        return response()->json([
            'success' => true,
            'message' => 'Antrian created successfully.',
            'data' => [
                'antrian' => new AntrianResource($antrian),
            ],
        ], 201);
    }

    /**
     * Display the specified queue.
     */
    public function show(Antrian $antrian): JsonResponse
    {
        Gate::authorize('view', $antrian);

        $antrian->load([
            'pendaftaran.pasien',
            'pendaftaran.poli',
            'poli',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Antrian retrieved successfully.',
            'data' => [
                'antrian' => new AntrianResource($antrian),
            ],
        ]);
    }

    /**
     * Update the specified queue.
     */
    public function update(
        UpdateAntrianRequest $request,
        Antrian $antrian
    ): JsonResponse {
        Gate::authorize('update', $antrian);

        $antrian = $this->antrianService->update(
            $antrian,
            $request->validated()
        );

        return response()->json([
            'success' => true,
            'message' => 'Antrian updated successfully.',
            'data' => [
                'antrian' => new AntrianResource($antrian),
            ],
        ]);
    }

    /**
     * Remove the specified queue.
     */
    public function destroy(
        Antrian $antrian
    ): JsonResponse {
        Gate::authorize('delete', $antrian);

        $this->antrianService->delete($antrian);

        return response()->json([
            'success' => true,
            'message' => 'Antrian deleted successfully.',
            'data' => null,
        ]);
    }
}
