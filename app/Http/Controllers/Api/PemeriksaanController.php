<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePemeriksaanRequest;
use App\Http\Requests\UpdatePemeriksaanRequest;
use App\Http\Resources\PemeriksaanResource;
use App\Models\Pemeriksaan;
use App\Services\PemeriksaanService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Gate;

class PemeriksaanController extends Controller
{
    public function __construct(
        private readonly PemeriksaanService $pemeriksaanService
    ) {}

    public function index(): JsonResponse
    {
        Gate::authorize('viewAny', Pemeriksaan::class);

        $pemeriksaans = $this->pemeriksaanService->getAll();

        return response()->json([
            'success' => true,
            'message' => 'Pemeriksaan retrieved successfully.',
            'data' => [
                'items' => PemeriksaanResource::collection(
                    $pemeriksaans->items()
                ),
                'pagination' => [
                    'current_page' => $pemeriksaans->currentPage(),
                    'per_page' => $pemeriksaans->perPage(),
                    'total' => $pemeriksaans->total(),
                    'last_page' => $pemeriksaans->lastPage(),
                    'from' => $pemeriksaans->firstItem(),
                    'to' => $pemeriksaans->lastItem(),
                ],
            ],
        ]);
    }

    public function store(
        StorePemeriksaanRequest $request
    ): JsonResponse {
        Gate::authorize('create', Pemeriksaan::class);

        $pemeriksaan = $this->pemeriksaanService->create(
            $request->validated()
        );

        return response()->json([
            'success' => true,
            'message' => 'Pemeriksaan created successfully.',
            'data' => [
                'pemeriksaan' => new PemeriksaanResource(
                    $pemeriksaan
                ),
            ],
        ], 201);
    }

    public function show(
        Pemeriksaan $pemeriksaan
    ): JsonResponse {
        Gate::authorize('view', $pemeriksaan);

        $pemeriksaan->load([
            'antrian.pendaftaran.pasien',
            'antrian.poli',
            'dokter',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Pemeriksaan retrieved successfully.',
            'data' => [
                'pemeriksaan' => new PemeriksaanResource(
                    $pemeriksaan
                ),
            ],
        ]);
    }

    public function update(
        UpdatePemeriksaanRequest $request,
        Pemeriksaan $pemeriksaan
    ): JsonResponse {
        Gate::authorize('update', $pemeriksaan);

        $pemeriksaan = $this->pemeriksaanService->update(
            $pemeriksaan,
            $request->validated()
        );

        return response()->json([
            'success' => true,
            'message' => 'Pemeriksaan updated successfully.',
            'data' => [
                'pemeriksaan' => new PemeriksaanResource(
                    $pemeriksaan
                ),
            ],
        ]);
    }

    public function destroy(
        Pemeriksaan $pemeriksaan
    ): JsonResponse {
        Gate::authorize('delete', $pemeriksaan);

        $this->pemeriksaanService->delete($pemeriksaan);

        return response()->json([
            'success' => true,
            'message' => 'Pemeriksaan deleted successfully.',
            'data' => null,
        ]);
    }
}

