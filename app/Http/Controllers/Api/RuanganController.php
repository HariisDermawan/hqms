<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\AssignRuanganPasienRequest;
use App\Http\Requests\StoreRuanganRequest;
use App\Http\Requests\UpdateRuanganRequest;
use App\Http\Resources\AntrianResource;
use App\Http\Resources\RuanganResource;
use App\Models\Antrian;
use App\Models\Ruangan;
use App\Models\RuanganPasien;
use App\Services\RuanganService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class RuanganController extends Controller
{
    public function __construct(
        private readonly RuanganService $ruanganService
    ) {}

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        Gate::authorize('viewAny', Ruangan::class);

        $ruangans = $this->ruanganService->getAll(
            min(100, $request->integer('per_page', 10))
        );

        return response()->json([
            'success' => true,
            'message' => 'Ruangan retrieved successfully.',
            'data' => [
                'items' => RuanganResource::collection($ruangans->items()),
                'pagination' => [
                    'current_page' => $ruangans->currentPage(),
                    'per_page' => $ruangans->perPage(),
                    'total' => $ruangans->total(),
                    'last_page' => $ruangans->lastPage(),
                    'from' => $ruangans->firstItem(),
                    'to' => $ruangans->lastItem(),
                ],
            ],
        ]);
    }

    /**
     * Store a newly created resource.
     */
    public function store(StoreRuanganRequest $request): JsonResponse
    {
        Gate::authorize('create', Ruangan::class);
        $ruangan = $this->ruanganService->create(
            $request->validated()
        );

        return response()->json([
            'success' => true,
            'message' => 'Ruangan created successfully.',
            'data' => [
                'ruangan' => new RuanganResource($ruangan),
            ],
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Ruangan $ruangan): JsonResponse
    {
        Gate::authorize('view', $ruangan);

        $ruangan->load([
            'poli',
            'poli',
            'ruanganPasiens.antrian.poli',
            'ruanganPasiens.pendaftaran',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Ruangan retrieved successfully.',
            'data' => [
                'ruangan' => new RuanganResource($ruangan),
            ],
        ]);
    }

    /**
     * List available antrian tickets assignable to this ruangan.
     */
    public function antrians(Ruangan $ruangan): JsonResponse
    {
        Gate::authorize('view', $ruangan);

        $assignedAntrianIds = RuanganPasien::query()
            ->whereNull('tanggal_keluar')
            ->whereNotNull('antrian_id')
            ->pluck('antrian_id');

        $antrians = Antrian::query()
            ->with(['poli', 'pendaftaran.pasien'])
            ->whereIn('status', ['waiting', 'called', 'serving'])
            ->whereHas('pendaftaran.pasien')
            ->when(
                $ruangan->poli_id !== null,
                fn ($query) => $query->where('poli_id', $ruangan->poli_id)
            )
            ->when(
                $assignedAntrianIds->isNotEmpty(),
                fn ($query) => $query->whereNotIn('id', $assignedAntrianIds)
            )
            ->orderBy('queue_number')
            ->get();

        return response()->json([
            'success' => true,
            'message' => 'Antrians retrieved successfully.',
            'data' => [
                'antrians' => AntrianResource::collection($antrians),
            ],
        ]);
    }

    /**
     * Update the specified resource.
     */
    public function update(
        UpdateRuanganRequest $request,
        Ruangan $ruangan
    ): JsonResponse {
        Gate::authorize('update', $ruangan);

        $ruangan = $this->ruanganService->update(
            $ruangan,
            $request->validated()
        );

        return response()->json([
            'success' => true,
            'message' => 'Ruangan updated successfully.',
            'data' => [
                'ruangan' => new RuanganResource($ruangan),
            ],
        ]);
    }

    /**
     * Remove the specified resource.
     */
    public function destroy(Ruangan $ruangan): JsonResponse
    {
        Gate::authorize('delete', $ruangan);

        $this->ruanganService->delete($ruangan);

        return response()->json([
            'success' => true,
            'message' => 'Ruangan deleted successfully.',
            'data' => null,
        ]);
    }

    /**
     * Assign a pasien to the ruangan.
     */
    public function assignPasien(
        AssignRuanganPasienRequest $request,
        Ruangan $ruangan
    ): JsonResponse {
        Gate::authorize('update', $ruangan);

        $item = $this->ruanganService->assignPasien(
            $ruangan,
            $request->validated()
        );

        $ruangan->load([
            'poli',
            'ruanganPasiens.antrian.poli',
            'ruanganPasiens.pendaftaran',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Pasien assigned successfully.',
            'data' => [
                'ruangan' => new RuanganResource($ruangan),
                'item' => [
                    'id' => $item->id,
                    'pasien_id' => $item->pasien_id,
                    'antrian_id' => $item->antrian_id,
                    'pendaftaran_id' => $item->pendaftaran_id,
                    'name' => $item->pasien_name,
                    'mrn' => $item->pasien_mrn,
                    'gender' => $item->pasien_gender,
                    'age' => $item->pasien_age,
                    'tanggal_masuk' => $item->tanggal_masuk?->format('Y-m-d'),
                    'tanggal_keluar' => $item->tanggal_keluar?->format(
                        'Y-m-d'
                    ),
                ],
            ],
        ], 201);
    }

    /**
     * Remove a pasien from the ruangan.
     */
    public function removePasien(
        Ruangan $ruangan,
        RuanganPasien $ruanganPasien
    ): JsonResponse {
        Gate::authorize('update', $ruangan);

        $item = $this->ruanganService->removePasien(
            $ruangan,
            $ruanganPasien
        );

        $ruangan->load([
            'poli',
            'ruanganPasiens.antrian.poli',
            'ruanganPasiens.pendaftaran',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Pasien removed successfully.',
            'data' => [
                'ruangan' => new RuanganResource($ruangan),
                'item' => [
                    'id' => $item->id,
                    'pasien_id' => $item->pasien_id,
                    'antrian_id' => $item->antrian_id,
                    'pendaftaran_id' => $item->pendaftaran_id,
                    'name' => $item->pasien_name,
                    'mrn' => $item->pasien_mrn,
                    'gender' => $item->pasien_gender,
                    'age' => $item->pasien_age,
                    'tanggal_masuk' => $item->tanggal_masuk?->format('Y-m-d'),
                    'tanggal_keluar' => $item->tanggal_keluar?->format(
                        'Y-m-d'
                    ),
                ],
            ],
        ]);
    }
}
