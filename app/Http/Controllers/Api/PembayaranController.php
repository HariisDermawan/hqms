<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePembayaranRequest;
use App\Http\Requests\UpdatePembayaranRequest;
use App\Http\Resources\PembayaranResource;
use App\Models\Pembayaran;
use App\Services\PembayaranService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Gate;

class PembayaranController extends Controller
{
    public function __construct(
        private readonly PembayaranService $pembayaranService
    ) {}

    public function index(): JsonResponse
    {
        Gate::authorize('viewAny', Pembayaran::class);

        $pembayarans = $this->pembayaranService->getAll();

        return response()->json([
            'success' => true,
            'message' => 'Pembayaran retrieved successfully.',
            'data' => [
                'items' => PembayaranResource::collection(
                    $pembayarans->items()
                ),
                'pagination' => [
                    'current_page' => $pembayarans->currentPage(),
                    'per_page' => $pembayarans->perPage(),
                    'total' => $pembayarans->total(),
                    'last_page' => $pembayarans->lastPage(),
                    'from' => $pembayarans->firstItem(),
                    'to' => $pembayarans->lastItem(),
                ],
            ],
        ]);
    }

    public function store(
        StorePembayaranRequest $request
    ): JsonResponse {
        Gate::authorize('create', Pembayaran::class);

        $pembayaran = $this->pembayaranService->create(
            $request->validated()
        );

        return response()->json([
            'success' => true,
            'message' => 'Pembayaran created successfully.',
            'data' => [
                'pembayaran' => new PembayaranResource($pembayaran),
            ],
        ], 201);
    }

    public function show(Pembayaran $pembayaran): JsonResponse
    {
        Gate::authorize('view', $pembayaran);

        $pembayaran->load([
            'pemeriksaan.pasien',
            'pemeriksaan.poli',
            'pemeriksaan.antrian',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Pembayaran retrieved successfully.',
            'data' => [
                'pembayaran' => new PembayaranResource($pembayaran),
            ],
        ]);
    }

    public function update(
        UpdatePembayaranRequest $request,
        Pembayaran $pembayaran
    ): JsonResponse {
        Gate::authorize('update', $pembayaran);

        $pembayaran = $this->pembayaranService->update(
            $pembayaran,
            $request->validated()
        );

        return response()->json([
            'success' => true,
            'message' => 'Pembayaran updated successfully.',
            'data' => [
                'pembayaran' => new PembayaranResource($pembayaran),
            ],
        ]);
    }

    public function destroy(Pembayaran $pembayaran): JsonResponse
    {
        Gate::authorize('delete', $pembayaran);

        $this->pembayaranService->delete($pembayaran);

        return response()->json([
            'success' => true,
            'message' => 'Pembayaran deleted successfully.',
            'data' => null,
        ]);
    }
}
