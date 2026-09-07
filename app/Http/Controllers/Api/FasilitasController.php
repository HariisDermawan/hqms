<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreFasilitasRequest;
use App\Http\Requests\UpdateFasilitasRequest;
use App\Http\Resources\FasilitasResource;
use App\Http\Resources\RuanganResource;
use App\Models\Fasilitas;
use App\Services\FasilitasService;
use App\Services\RuanganService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class FasilitasController extends Controller
{
    public function __construct(
        private readonly FasilitasService $fasilitasService,
        private readonly RuanganService $ruanganService,
    ) {}

    public function index(Request $request): JsonResponse
    {
        Gate::authorize('viewAny', Fasilitas::class);

        $items = $this->fasilitasService->getAll(
            min(100, $request->integer('per_page', 10))
        );

        return response()->json([
            'success' => true,
            'message' => 'Fasilitas retrieved successfully.',
            'data' => [
                'items' => FasilitasResource::collection($items->items()),
                'pagination' => [
                    'current_page' => $items->currentPage(),
                    'per_page' => $items->perPage(),
                    'total' => $items->total(),
                    'last_page' => $items->lastPage(),
                    'from' => $items->firstItem(),
                    'to' => $items->lastItem(),
                ],
            ],
        ]);
    }

    public function store(StoreFasilitasRequest $request): JsonResponse
    {
        Gate::authorize('create', Fasilitas::class);

        $fasilitas = $this->fasilitasService->create(
            $request->validated()
        );

        return response()->json([
            'success' => true,
            'message' => 'Fasilitas created successfully.',
            'data' => [
                'fasilitas' => new FasilitasResource($fasilitas),
            ],
        ], 201);
    }

    public function show(string $slugOrId): JsonResponse
    {
        $fasilitas = is_numeric($slugOrId)
            ? Fasilitas::query()->whereKey($slugOrId)->firstOrFail()
            : $this->fasilitasService->findBySlug($slugOrId)
                ?? abort(404);

        Gate::authorize('view', $fasilitas);

        $fasilitas->loadCount('ruangans');

        $ruangans = $this->ruanganService->getActive()
            ->filter(fn ($r) => $r->facility_id === $fasilitas->id)
            ->values();

        return response()->json([
            'success' => true,
            'message' => 'Fasilitas retrieved successfully.',
            'data' => [
                'fasilitas' => new FasilitasResource($fasilitas),
                'ruangans' => RuanganResource::collection($ruangans),
            ],
        ]);
    }

    public function update(
        UpdateFasilitasRequest $request,
        Fasilitas $fasilitas
    ): JsonResponse {
        Gate::authorize('update', $fasilitas);

        $fasilitas = $this->fasilitasService->update(
            $fasilitas,
            $request->validated()
        );

        return response()->json([
            'success' => true,
            'message' => 'Fasilitas updated successfully.',
            'data' => [
                'fasilitas' => new FasilitasResource($fasilitas),
            ],
        ]);
    }

    public function destroy(Fasilitas $fasilitas): JsonResponse
    {
        Gate::authorize('delete', $fasilitas);

        $this->fasilitasService->delete($fasilitas);

        return response()->json([
            'success' => true,
            'message' => 'Fasilitas deleted successfully.',
            'data' => null,
        ]);
    }

    public function active(): JsonResponse
    {
        $items = $this->fasilitasService->getActive();

        return response()->json([
            'success' => true,
            'message' => 'Active facilities retrieved successfully.',
            'data' => [
                'items' => FasilitasResource::collection($items),
            ],
        ]);
    }
}
