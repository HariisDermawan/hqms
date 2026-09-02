<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\MonitoringService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Gate;

class MonitoringController extends Controller
{
    public function __construct(
        private readonly MonitoringService $monitoringService
    ) {}

    /**
     * Display aggregated monitoring statistics and charts.
     */
    public function index(): JsonResponse
    {
        Gate::authorize('viewAny', Monitoring::class);

        return response()->json([
            'success' => true,
            'message' => 'Monitoring data retrieved successfully.',
            'data' => $this->monitoringService->stats(),
        ]);
    }
}
