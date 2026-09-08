<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ScanAttendanceRequest;
use App\Http\Requests\StoreAntrianRequest;
use App\Http\Requests\StoreMessageRequest;
use App\Http\Resources\AntrianResource;
use App\Http\Resources\BeritaResource;
use App\Http\Resources\DokterResource;
use App\Http\Resources\FaqResource;
use App\Http\Resources\JadwalDokterResource;
use App\Http\Resources\MessageResource;
use App\Http\Resources\PenawaranResource;
use App\Http\Resources\PoliResource;
use App\Http\Resources\RuanganResource;
use App\Http\Resources\TestimonialResource;
use App\Models\Antrian;
use App\Models\Faq;
use App\Models\JadwalDokter;
use App\Models\Perawat;
use App\Models\Testimonial;
use App\Services\AntrianService;
use App\Services\BeritaService;
use App\Services\DokterService;
use App\Services\MessageService;
use App\Services\PenawaranService;
use App\Services\PoliService;
use App\Services\PresensiService;
use App\Services\RuanganService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Storage;

class KioskController extends Controller
{
    public function __construct(
        private readonly AntrianService $antrianService,
        private readonly BeritaService $beritaService,
        private readonly DokterService $dokterService,
        private readonly MessageService $messageService,
        private readonly PoliService $poliService,
        private readonly PenawaranService $penawaranService,
        private readonly PresensiService $presensiService,
        private readonly RuanganService $ruanganService,
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
     * List active doctors available on the public landing page.
     */
    public function dokters(): JsonResponse
    {
        $dokters = $this->dokterService->getActive();

        return response()->json([
            'success' => true,
            'message' => 'Active doctors retrieved successfully.',
            'data' => [
                'items' => DokterResource::collection($dokters),
            ],
        ]);
    }

    /**
     * List latest news (paginated) available on the public landing page.
     */
    public function beritas(Request $request): JsonResponse
    {
        $beritas = $this->beritaService->getPaginated(
            min(100, $request->integer('per_page', 8))
        );

        return response()->json([
            'success' => true,
            'message' => 'Latest news retrieved successfully.',
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
     * List active FAQs (ordered) available on the public landing page.
     */
    public function faqs(): JsonResponse
    {
        $faqs = Faq::query()
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->get();

        return response()->json([
            'success' => true,
            'message' => 'FAQs retrieved successfully.',
            'data' => [
                'items' => FaqResource::collection($faqs),
            ],
        ]);
    }

    /**
     * List active testimonials (ordered) available on the public landing page.
     */
    public function testimonials(): JsonResponse
    {
        $testimonials = Testimonial::query()
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->get();

        return response()->json([
            'success' => true,
            'message' => 'Testimonials retrieved successfully.',
            'data' => [
                'items' => TestimonialResource::collection($testimonials),
            ],
        ]);
    }

    /**
     * Store a public contact message sent from the landing page.
     */
    public function storeMessage(
        StoreMessageRequest $request
    ): JsonResponse {
        $message = $this->messageService->create(
            $request->validated()
        );

        return response()->json([
            'success' => true,
            'message' => 'Message sent successfully.',
            'data' => [
                'message' => new MessageResource($message),
            ],
        ], 201);
    }

    /**
     * List active doctor schedules (weekly) for the public jadwal poli page.
     */
    public function jadwalDokters(): JsonResponse
    {
        $dayOrder = [
            'monday' => 0,
            'tuesday' => 1,
            'wednesday' => 2,
            'thursday' => 3,
            'friday' => 4,
            'saturday' => 5,
            'sunday' => 6,
        ];

        $jadwals = JadwalDokter::query()
            ->with(['dokter', 'poli'])
            ->where('is_active', true)
            ->get()
            ->sortBy(fn (JadwalDokter $jadwal) => [
                $dayOrder[$jadwal->day] ?? 7,
                $jadwal->start_time ?? '00:00:00',
            ])
            ->values();

        return response()->json([
            'success' => true,
            'message' => 'Doctor schedules retrieved successfully.',
            'data' => [
                'items' => JadwalDokterResource::collection($jadwals),
            ],
        ]);
    }

    /**
     * List active rooms available on the public landing page.
     */
    public function ruangans(): JsonResponse
    {
        $ruangans = $this->ruanganService->getActive();

        return response()->json([
            'success' => true,
            'message' => 'Active rooms retrieved successfully.',
            'data' => [
                'items' => RuanganResource::collection($ruangans),
            ],
        ]);
    }

    /**
     * List latest offers (paginated) available on the public landing page.
     */
    public function penawarans(Request $request): JsonResponse
    {
        $penawarans = $this->penawaranService->getAll(
            min(100, $request->integer('per_page', 8))
        );

        return response()->json([
            'success' => true,
            'message' => 'Latest offers retrieved successfully.',
            'data' => [
                'items' => PenawaranResource::collection($penawarans->items()),
                'pagination' => [
                    'current_page' => $penawarans->currentPage(),
                    'per_page' => $penawarans->perPage(),
                    'total' => $penawarans->total(),
                    'last_page' => $penawarans->lastPage(),
                    'from' => $penawarans->firstItem(),
                    'to' => $penawarans->lastItem(),
                ],
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
