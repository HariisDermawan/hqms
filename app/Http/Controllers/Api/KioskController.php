<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ScanAttendanceRequest;
use App\Http\Requests\StoreAntrianRequest;
use App\Http\Resources\AntrianResource;
use App\Http\Resources\PoliResource;
use App\Models\Antrian;
use App\Models\Perawat;
use App\Services\AntrianService;
use App\Services\PoliService;
use App\Services\PresensiService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Storage;

class KioskController extends Controller
{
    public function __construct(
        private readonly AntrianService $antrianService,
        private readonly PoliService $poliService,
        private readonly PresensiService $presensiService,
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
     * Scan an RFID tag to toggle attendance (check-in / check-out).
     */
    public function scanAttendance(ScanAttendanceRequest $request): JsonResponse
    {
        $value = $request->input('rfid_id');

        $matches = Perawat::query()
            ->where('rfid_id', $value)
            ->orWhere('code', $value)
            ->get();

        if ($matches->isEmpty()) {
            return response()->json([
                'success' => false,
                'message' => 'Kartu tidak terdaftar.',
                'data' => [
                    'action' => 'error',
                    'reason' => 'not_found',
                ],
            ], 422);
        }

        if ($matches->count() > 1) {
            return response()->json([
                'success' => false,
                'message' => 'RFID terdaftar di beberapa karyawan.',
                'data' => [
                    'action' => 'error',
                    'reason' => 'duplicate',
                ],
            ], 422);
        }

        $perawat = $matches->first();

        $scan = $this->presensiService->tap($perawat);

        $actionLabel = match ($scan['action']) {
            'in' => 'Check-in',
            'out' => 'Check-out',
            default => 'Selesai',
        };

        return response()->json([
            'success' => true,
            'message' => "$actionLabel berhasil.",
            'data' => [
                'action' => $scan['action'],
                'time_in' => $scan['presensi']->time_in,
                'time_out' => $scan['presensi']->time_out,
                'perawat' => [
                    'id' => $perawat->id,
                    'code' => $perawat->code,
                    'name' => $perawat->name,
                    'gender' => $perawat->gender,
                    'gender_label' => $perawat->gender === 'P'
                        ? 'Perempuan'
                        : 'Laki-laki',
                    'image_url' => $perawat->image
                        ? Storage::disk(
                            'public'
                        )->url($perawat->image)
                        : null,
                ],
            ],
        ]);
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
     * All called/serving tickets active today (per loket for the TV display).
     *
     * @return Collection<int, array<string, mixed>>
     */
    private function currentActiveTickets(): Collection
    {
        $tickets = Antrian::query()
            ->with(['poli', 'pendaftaran.pasien'])
            ->whereIn('status', ['called', 'serving'])
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
            ->sortByDesc(fn (Antrian $antrian) => $antrian->called_at)
            ->values()
            ->map(fn (Antrian $antrian) => [
                'id' => $antrian->id,
                'queue_number' => $antrian->queue_number,
                'status' => $antrian->status,
                'loket' => $antrian->loket,
                'called_at' => $antrian->called_at?->toISOString(),
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
