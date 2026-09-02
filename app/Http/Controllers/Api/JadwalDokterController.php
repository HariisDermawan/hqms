<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreJadwalDokterRequest;
use App\Http\Requests\UpdateJadwalDokterRequest;
use App\Http\Resources\JadwalDokterResource;
use App\Models\JadwalDokter;
use App\Services\JadwalDokterService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class JadwalDokterController extends Controller
{
    public function __construct(
        private readonly JadwalDokterService $jadwalDokterService
    ) {}

    public function index(Request $request): JsonResponse
    {
        Gate::authorize('viewAny', JadwalDokter::class);

        $jadwals = $this->jadwalDokterService->getAll(
            $request->integer('poli_id') ?: null,
            $request->integer('dokter_id') ?: null,
            min(100, $request->integer('per_page', 10)),
        );

        return response()->json([
            'success' => true,
            'message' => 'Jadwal dokter retrieved successfully.',
            'data' => [
                'items' => JadwalDokterResource::collection(
                    $jadwals->items()
                ),
                'pagination' => [
                    'current_page' => $jadwals->currentPage(),
                    'per_page' => $jadwals->perPage(),
                    'total' => $jadwals->total(),
                    'last_page' => $jadwals->lastPage(),
                    'from' => $jadwals->firstItem(),
                    'to' => $jadwals->lastItem(),
                ],
            ],
        ]);
    }

    public function store(
        StoreJadwalDokterRequest $request
    ): JsonResponse {
        Gate::authorize('create', JadwalDokter::class);

        $jadwal = $this->jadwalDokterService->create(
            $request->validated()
        );

        return response()->json([
            'success' => true,
            'message' => 'Jadwal dokter created successfully.',
            'data' => [
                'jadwal_dokter' => new JadwalDokterResource($jadwal),
            ],
        ], 201);
    }

    public function show(
        JadwalDokter $jadwalDokter
    ): JsonResponse {
        Gate::authorize('view', $jadwalDokter);

        $jadwalDokter->load([
            'dokter',
            'poli',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Jadwal dokter retrieved successfully.',
            'data' => [
                'jadwal_dokter' => new JadwalDokterResource(
                    $jadwalDokter
                ),
            ],
        ]);
    }

    public function update(
        UpdateJadwalDokterRequest $request,
        JadwalDokter $jadwalDokter
    ): JsonResponse {
        Gate::authorize('update', $jadwalDokter);

        $jadwalDokter = $this->jadwalDokterService->update(
            $jadwalDokter,
            $request->validated()
        );

        return response()->json([
            'success' => true,
            'message' => 'Jadwal dokter updated successfully.',
            'data' => [
                'jadwal_dokter' => new JadwalDokterResource(
                    $jadwalDokter
                ),
            ],
        ]);
    }

    public function destroy(
        JadwalDokter $jadwalDokter
    ): JsonResponse {
        Gate::authorize('delete', $jadwalDokter);

        $this->jadwalDokterService->delete($jadwalDokter);

        return response()->json([
            'success' => true,
            'message' => 'Jadwal dokter deleted successfully.',
            'data' => null,
        ]);
    }
}
