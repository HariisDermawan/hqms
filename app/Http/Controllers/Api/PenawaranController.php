<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePenawaranRequest;
use App\Http\Requests\UpdatePenawaranRequest;
use App\Http\Resources\PenawaranResource;
use App\Models\Penawaran;
use App\Services\PenawaranService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class PenawaranController extends Controller
{
    public function __construct(
        private readonly PenawaranService $penawaranService
    ) {}

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        Gate::authorize('viewAny', Penawaran::class);

        $penawarans = $this->penawaranService->getAll(
            min(100, $request->integer('per_page', 10))
        );

        return response()->json([
            'success' => true,
            'message' => 'Penawaran retrieved successfully.',
            'data' => [
                'items' => PenawaranResource::collection($penawarans->items()),
                'pagination' => [
                    'current_page' => $penawarans->currentPage(),
                    'per_page' => $penawarans->perPage(),
                    'total' => $penawarans->total(),
                    'last_page' => $penawarans->lastPage(),
                    'from' => $penawarans->firstItem(),
                    'to' => $penawarans->lastItem(),
                ],
            ],
        ]);
    }

    /**
     * Store a newly created resource.
     */
    public function store(StorePenawaranRequest $request): JsonResponse
    {
        Gate::authorize('create', Penawaran::class);

        $penawaran = $this->penawaranService->create(
            $request->validated()
        );

        return response()->json([
            'success' => true,
            'message' => 'Penawaran created successfully.',
            'data' => [
                'penawaran' => new PenawaranResource($penawaran),
            ],
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Penawaran $penawaran): JsonResponse
    {
        Gate::authorize('view', $penawaran);

        return response()->json([
            'success' => true,
            'message' => 'Penawaran retrieved successfully.',
            'data' => [
                'penawaran' => new PenawaranResource($penawaran),
            ],
        ]);
    }

    /**
     * Update the specified resource.
     */
    public function update(
        UpdatePenawaranRequest $request,
        Penawaran $penawaran
    ): JsonResponse {
        Gate::authorize('update', $penawaran);

        $penawaran = $this->penawaranService->update(
            $penawaran,
            $request->validated()
        );

        return response()->json([
            'success' => true,
            'message' => 'Penawaran updated successfully.',
            'data' => [
                'penawaran' => new PenawaranResource($penawaran),
            ],
        ]);
    }

    /**
     * Remove the specified resource.
     */
    public function destroy(Penawaran $penawaran): JsonResponse
    {
        Gate::authorize('delete', $penawaran);

        $this->penawaranService->delete($penawaran);

        return response()->json([
            'success' => true,
            'message' => 'Penawaran deleted successfully.',
            'data' => null,
        ]);
    }
}
