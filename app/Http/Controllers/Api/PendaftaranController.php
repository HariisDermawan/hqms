<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePendaftaranRequest;
use App\Http\Requests\UpdatePendaftaranRequest;
use App\Http\Resources\PendaftaranResource;
use App\Models\Pendaftaran;
use App\Services\PendaftaranService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class PendaftaranController extends Controller
{
    public function __construct(
        private readonly PendaftaranService $pendaftaranService
    ) {}

    /**
     * Display a listing of registrations.
     */
    public function index(Request $request): JsonResponse
    {
        Gate::authorize('viewAny', Pendaftaran::class);

        $pendaftarans = $this->pendaftaranService->getAll(
            min(100, $request->integer('per_page', 10))
        );

        return response()->json([
            'success' => true,
            'message' => 'Pendaftaran retrieved successfully.',
            'data' => [
                'items' => PendaftaranResource::collection(
                    $pendaftarans->items()
                ),
                'pagination' => [
                    'current_page' => $pendaftarans->currentPage(),
                    'per_page' => $pendaftarans->perPage(),
                    'total' => $pendaftarans->total(),
                    'last_page' => $pendaftarans->lastPage(),
                    'from' => $pendaftarans->firstItem(),
                    'to' => $pendaftarans->lastItem(),
                ],
            ],
        ]);
    }

    /**
     * Store a newly created registration.
     */
    public function store(
        StorePendaftaranRequest $request
    ): JsonResponse {
        Gate::authorize('create', Pendaftaran::class);

        $pendaftaran = $this->pendaftaranService->create(
            $request->validated()
        );

        return response()->json([
            'success' => true,
            'message' => 'Pendaftaran created successfully.',
            'data' => [
                'pendaftaran' => new PendaftaranResource(
                    $pendaftaran
                ),
            ],
        ], 201);
    }

    /**
     * Display the specified registration.
     */
    public function show(Pendaftaran $pendaftaran): JsonResponse
    {
        Gate::authorize('view', $pendaftaran);

        $pendaftaran->load([
            'pasien',
            'poli',
            'antrian',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Pendaftaran retrieved successfully.',
            'data' => [
                'pendaftaran' => new PendaftaranResource(
                    $pendaftaran
                ),
            ],
        ]);
    }

    /**
     * Update the specified registration.
     */
    public function update(
        UpdatePendaftaranRequest $request,
        Pendaftaran $pendaftaran
    ): JsonResponse {
        Gate::authorize('update', $pendaftaran);

        $pendaftaran = $this->pendaftaranService->update(
            $pendaftaran,
            $request->validated()
        );

        return response()->json([
            'success' => true,
            'message' => 'Pendaftaran updated successfully.',
            'data' => [
                'pendaftaran' => new PendaftaranResource(
                    $pendaftaran
                ),
            ],
        ]);
    }

    /**
     * Remove the specified registration.
     */
    public function destroy(
        Pendaftaran $pendaftaran
    ): JsonResponse {
        Gate::authorize('delete', $pendaftaran);

        $this->pendaftaranService->delete($pendaftaran);

        return response()->json([
            'success' => true,
            'message' => 'Pendaftaran deleted successfully.',
            'data' => null,
        ]);
    }
}
