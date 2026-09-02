<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePoliRequest;
use App\Http\Requests\UpdatePoliRequest;
use App\Http\Resources\PoliResource;
use App\Models\Poli;
use App\Services\PoliService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class PoliController extends Controller
{
    public function __construct(
        private readonly PoliService $poliService
    ) {}

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        Gate::authorize('viewAny', Poli::class);

        $polis = $this->poliService->getAll(
            min(100, $request->integer('per_page', 10))
        );

        return response()->json([
            'success' => true,
            'message' => 'Poli retrieved successfully.',
            'data' => [
                'items' => PoliResource::collection($polis->items()),
                'pagination' => [
                    'current_page' => $polis->currentPage(),
                    'per_page' => $polis->perPage(),
                    'total' => $polis->total(),
                    'last_page' => $polis->lastPage(),
                    'from' => $polis->firstItem(),
                    'to' => $polis->lastItem(),
                ],
            ],
        ]);
    }

    /**
     * Store a newly created resource.
     */
    public function store(StorePoliRequest $request): JsonResponse
    {
        Gate::authorize('create', Poli::class);
        $poli = $this->poliService->create(
            $request->validated()
        );

        return response()->json([
            'success' => true,
            'message' => 'Poli created successfully.',
            'data' => [
                'poli' => new PoliResource($poli),
            ],
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Poli $poli): JsonResponse
    {
        Gate::authorize('view', $poli);

        return response()->json([
            'success' => true,
            'message' => 'Poli retrieved successfully.',
            'data' => [
                'poli' => new PoliResource($poli),
            ],
        ]);
    }

    /**
     * Update the specified resource.
     */
    public function update(
        UpdatePoliRequest $request,
        Poli $poli
    ): JsonResponse {
        Gate::authorize('update', $poli);

        $poli = $this->poliService->update(
            $poli,
            $request->validated()
        );

        return response()->json([
            'success' => true,
            'message' => 'Poli updated successfully.',
            'data' => [
                'poli' => new PoliResource($poli),
            ],
        ]);
    }

    /**
     * Remove the specified resource.
     */
    public function destroy(Poli $poli): JsonResponse
    {
        Gate::authorize('delete', $poli);

        $this->poliService->delete($poli);

        return response()->json([
            'success' => true,
            'message' => 'Poli deleted successfully.',
            'data' => null,
        ]);
    }
}
