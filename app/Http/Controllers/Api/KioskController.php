<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreAntrianRequest;
use App\Http\Resources\AntrianResource;
use App\Http\Resources\PoliResource;
use App\Models\Antrian;
use App\Services\AntrianService;
use App\Services\PoliService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Collection;

class KioskController extends Controller
{
    public function __construct(
        private readonly AntrianService $antrianService,
        private readonly PoliService $poliService,
    ) {}

    /**
     * List active polis available for self-service ticket taking.
     */
    public function polis(): JsonResponse
    {
        $polis = $this->poliService->getActive();

        return response()->json([
            'success' => true,
            'message' => 'Active polis retrieved successfully.',
            'data' => [
                'items' => PoliResource::collection($polis),
            ],
        ]);
    }

    /**
     * Create a queue ticket for the selected poli.
     */
    public function store(StoreAntrianRequest $request): JsonResponse
    {
        $antrian = $this->antrianService->create(
            $request->validated()
        );

        return response()->json([
            'success' => true,
            'message' => 'Ticket created successfully.',
            'data' => [
                'antrian' => new AntrianResource($antrian),
            ],
        ], 201);
    }

    /**
     * Currently serving / called tickets per poli for the TV display.
     */
    public function nowServing(): JsonResponse
    {
        $tickets = $this->currentActiveTickets();

        return response()->json([
            'success' => true,
            'message' => 'Now serving retrieved successfully.',
            'data' => [
                'items' => $tickets,
            ],
        ]);
    }

    /**
     * Latest active ticket (waiting/called/serving) for each poli today.
     *
     * @return Collection<int, array<string, mixed>>
     */
    private function currentActiveTickets(): Collection
    {
        $tickets = Antrian::query()
            ->with(['poli', 'pendaftaran.pasien'])
            ->whereIn('status', ['waiting', 'called', 'serving'])
            ->where(function ($query) {
                $query->whereDate('created_at', now()->toDateString())
                    ->orWhereDoesntHave('pendaftaran')
                    ->orWhereHas('pendaftaran', function ($pendaftaran) {
                        $pendaftaran->whereDate(
                            'registration_date',
                            now()->toDateString()
                        );
                    });
            })
            ->latest('id')
            ->get();

        return $tickets
            ->groupBy('poli_id')
            ->map(function (Collection $group) {
                return $group->firstWhere('status', 'serving')
                    ?? $group->firstWhere('status', 'called')
                    ?? $group->first();
            })
            ->values()
            ->map(fn (Antrian $antrian) => [
                'queue_number' => $antrian->queue_number,
                'status' => $antrian->status,
                'poli' => [
                    'id' => $antrian->poli?->id,
                    'name' => $antrian->poli?->name,
                ],
                'pasien' => $antrian->pendaftaran?->pasien ? [
                    'name' => $antrian->pendaftaran->pasien->name,
                    'medical_record_number' => $antrian->pendaftaran->pasien->medical_record_number,
                ] : null,
            ]);
    }
}
