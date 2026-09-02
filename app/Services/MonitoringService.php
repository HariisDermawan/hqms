<?php

namespace App\Services;

use App\Models\Antrian;
use App\Models\Pasien;
use App\Models\Pemeriksaan;
use App\Models\Pendaftaran;
use App\Models\Poli;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;

class MonitoringService
{
    public function stats(): array
    {
        $today = now()->toDateString();
        $startOfMonth = now()->startOfMonth();
        $endOfMonth = now()->endOfMonth();

        return [
            'summary' => [
                'total_pasien' => Pasien::query()->count(),
                'total_poli' => Poli::query()->count(),
                'pendaftaran_hari_ini' => Pendaftaran::query()
                    ->whereDate('registration_date', $today)
                    ->count(),
                'pendaftaran_bulan_ini' => Pendaftaran::query()
                    ->whereBetween('registration_date', [
                        $startOfMonth,
                        $endOfMonth,
                    ])
                    ->count(),
                'antrian_hari_ini' => Antrian::query()
                    ->whereDate('created_at', $today)
                    ->count(),
                'pemeriksaan_hari_ini' => Pemeriksaan::query()
                    ->whereDate('examined_at', $today)
                    ->count(),
                'pemeriksaan_bulan_ini' => Pemeriksaan::query()
                    ->whereBetween('examined_at', [
                        $startOfMonth,
                        $endOfMonth,
                    ])
                    ->count(),
            ],
            'charts' => [
                'pasien_per_month' => $this->pasienPerMonth(),
                'pasien_per_poli' => $this->pasienPerPoli(),
                'pendaftaran_per_day' => $this->pendaftaranPerDay(),
                'pendaftaran_per_poli' => $this->pendaftaranPerPoli(),
                'antrian_status' => $this->antrianStatus(),
            ],
        ];
    }

    private function pasienPerMonth(): array
    {
        $months = collect();

        for ($i = 5; $i >= 0; $i--) {
            $start = now()->subMonths($i)->startOfMonth();
            $end = now()->subMonths($i)->endOfMonth();

            $months->push([
                'bulan' => $start->translatedFormat('M'),
                'jumlah' => Pasien::query()
                    ->whereBetween(
                        'created_at',
                        [$start, $end]
                    )
                    ->count(),
            ]);
        }

        return $months->all();
    }

    private function pasienPerPoli(): array
    {
        return Poli::query()
            ->get()
            ->map(function (Poli $poli) {
                return [
                    'poli' => $poli->name,
                    'jumlah' => Pasien::query()
                        ->where('poli_id', $poli->id)
                        ->count(),
                ];
            })
            ->all();
    }

    private function pendaftaranPerDay(): array
    {
        $days = collect();

        for ($i = 6; $i >= 0; $i--) {
            $date = now()->subDays($i)->toDateString();

            $days->push([
                'tanggal' => Carbon::parse($date)->translatedFormat('d M'),
                'jumlah' => Pendaftaran::query()
                    ->whereDate('registration_date', $date)
                    ->count(),
            ]);
        }

        return $days->all();
    }

    private function pendaftaranPerPoli(): array
    {
        return Poli::query()
            ->get()
            ->map(function (Poli $poli) {
                return [
                    'poli' => $poli->name,
                    'jumlah' => Pendaftaran::query()
                        ->where('poli_id', $poli->id)
                        ->count(),
                ];
            })
            ->all();
    }

    private function antrianStatus(): array
    {
        return $this->statusCounts(Antrian::class)
            ->map(function ($count, $status) {
                return [
                    'name' => $this->labelAntrianStatus($status),
                    'status' => $status,
                    'value' => $count,
                ];
            })
            ->values()
            ->all();
    }

    private function statusCounts(string $model): Collection
    {
        return $model::query()
            ->selectRaw('status, count(*) as total')
            ->groupBy('status')
            ->pluck('total', 'status');
    }

    private function labelAntrianStatus(string $status): string
    {
        $labels = [
            'waiting' => 'Menunggu',
            'called' => 'Dipanggil',
            'serving' => 'Dalam Pelayanan',
            'completed' => 'Selesai',
            'skipped' => 'Dilewati',
        ];

        return $labels[$status] ?? $status;
    }
}
