<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreBeritaRequest;
use App\Http\Requests\UpdateBeritaRequest;
use App\Http\Resources\BeritaResource;
use App\Models\Berita;
use App\Services\BeritaService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class BeritaController extends Controller
{
    public function __construct(
        private readonly BeritaService $beritaService
    ) {}

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        Gate::authorize('viewAny', Berita::class);

        $beritas = $this->beritaService->getAll(
            min(100, $request->integer('per_page', 10))
        );

        return response()->json([
            'success' => true,
            'message' => 'Berita retrieved successfully.',
            'data' => [
                'items' => BeritaResource::collection($beritas->items()),
                'pagination' => [
                    'current_page' => $beritas->currentPage(),
                    'per_page' => $beritas->perPage(),
                    'total' => $beritas->total(),
                    'last_page' => $beritas->lastPage(),
                    'from' => $beritas->firstItem(),
                    'to' => $beritas->lastItem(),
                ],
            ],
        ]);
    }

    /**
     * Store a newly created resource.
     */
    public function store(StoreBeritaRequest $request): JsonResponse
    {
        Gate::authorize('create', Berita::class);
        $berita = $this->beritaService->create(
            $request->validated()
        );

        return response()->json([
            'success' => true,
            'message' => 'Berita created successfully.',
            'data' => [
                'berita' => new BeritaResource($berita),
            ],
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Berita $berita): JsonResponse
    {
        Gate::authorize('view', $berita);

        return response()->json([
            'success' => true,
            'message' => 'Berita retrieved successfully.',
            'data' => [
                'berita' => new BeritaResource($berita),
            ],
        ]);
    }

    /**
     * Update the specified resource.
     */
    public function update(
        UpdateBeritaRequest $request,
        Berita $berita
    ): JsonResponse {
        Gate::authorize('update', $berita);

        $berita = $this->beritaService->update(
            $berita,
            $request->validated()
        );

        return response()->json([
            'success' => true,
            'message' => 'Berita updated successfully.',
            'data' => [
                'berita' => new BeritaResource($berita),
            ],
        ]);
    }

    /**
     * Remove the specified resource.
     */
    public function destroy(Berita $berita): JsonResponse
    {
        Gate::authorize('delete', $berita);

        $this->beritaService->delete($berita);

        return response()->json([
            'success' => true,
            'message' => 'Berita deleted successfully.',
            'data' => null,
        ]);
    }
}
