<?php

namespace App\Services;

use App\Models\Pembayaran;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class PembayaranService
{
    public function getAll(): LengthAwarePaginator
    {
        return Pembayaran::query()
            ->with([
                'pemeriksaan.pasien',
                'pemeriksaan.poli',
                'pemeriksaan.antrian',
            ])
            ->latest()
            ->paginate(10);
    }

    public function create(array $data): Pembayaran
    {
        return DB::transaction(function () use ($data) {
            $detail = $data['detail_items'] ?? [];
            $total = $data['total']
                ?? array_reduce($detail, function (float $carry, array $item): float {
                    $quantity = (float) ($item['quantity'] ?? 1);
                    $unitPrice = (float) ($item['unit_price'] ?? 0);

                    return $carry + ($quantity * $unitPrice);
                }, 0.0);

            $pembayaran = Pembayaran::create([
                'pemeriksaan_id' => $data['pemeriksaan_id'],
                'invoice_number' => $this->generateInvoiceNumber(),
                'total' => $total,
                'metode' => $data['metode'],
                'status' => $data['status'],
                'tanggal' => $data['tanggal'],
                'detail_items' => $detail ?: null,
                'keterangan' => $data['keterangan'] ?? null,
            ]);

            return $pembayaran->load([
                'pemeriksaan.pasien',
                'pemeriksaan.poli',
                'pemeriksaan.antrian',
            ]);
        });
    }

    public function update(
        Pembayaran $pembayaran,
        array $data
    ): Pembayaran {
        return DB::transaction(function () use ($pembayaran, $data) {
            $detail = $data['detail_items'] ?? [];
            $total = $data['total']
                ?? array_reduce($detail, function (float $carry, array $item): float {
                    $quantity = (float) ($item['quantity'] ?? 1);
                    $unitPrice = (float) ($item['unit_price'] ?? 0);

                    return $carry + ($quantity * $unitPrice);
                }, 0.0);

            $pembayaran->update([
                'pemeriksaan_id' => $data['pemeriksaan_id'],
                'total' => $total,
                'metode' => $data['metode'],
                'status' => $data['status'],
                'tanggal' => $data['tanggal'],
                'detail_items' => $detail ?: null,
                'keterangan' => $data['keterangan'] ?? null,
            ]);

            return $pembayaran->fresh([
                'pemeriksaan.pasien',
                'pemeriksaan.poli',
                'pemeriksaan.antrian',
            ]);
        });
    }

    public function delete(Pembayaran $pembayaran): void
    {
        DB::transaction(function () use ($pembayaran) {
            $pembayaran->delete();
        });
    }

    private function generateInvoiceNumber(): string
    {
        $prefix = 'INV';
        $date = now()->format('Ymd');

        $last = Pembayaran::withTrashed()
            ->whereDate('created_at', now()->toDateString())
            ->orderByDesc('id')
            ->value('invoice_number');

        $sequence = $last
            ? (int) substr((string) $last, -3) + 1
            : 1;

        return sprintf('%s-%s-%03d', $prefix, $date, $sequence);
    }
}
