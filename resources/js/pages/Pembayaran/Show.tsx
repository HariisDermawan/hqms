import { Head, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import {
    getPembayaran,
    type DetailItem,
    type MetodePembayaran,
    type Pembayaran,
    type StatusPembayaran,
} from '@/api/pembayaran';
import AppLayout from '@/Layouts/AppLayout';

const formatRupiah = (value: string | number): string => {
    const number = Number(value ?? 0);

    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(number);
};

const formatDate = (date: string | null): string => {
    if (!date) {
        return '-';
    }

    const [year, month, day] = date.split('-');

    return `${day}/${month}/${year}`;
};

const metodeLabel = (metode: MetodePembayaran): string => {
    const map: Record<MetodePembayaran, string> = {
        cash: 'Tunai',
        transfer: 'Transfer',
        debit: 'Debit',
        credit: 'Kredit',
        qris: 'QRIS',
    };

    return map[metode] ?? metode;
};

const statusBadgeClass = (status: StatusPembayaran): string => {
    const map: Record<StatusPembayaran, string> = {
        unpaid: 'bg-amber-50 text-amber-600',
        paid: 'bg-green-50 text-green-600',
        refunded: 'bg-blue-50 text-blue-600',
        cancelled: 'bg-gray-100 text-gray-500',
    };

    return map[status] ?? 'bg-gray-100 text-gray-500';
};

const statusLabel = (status: StatusPembayaran): string => {
    const map: Record<StatusPembayaran, string> = {
        unpaid: 'Belum Bayar',
        paid: 'Lunas',
        refunded: 'Refund',
        cancelled: 'Dibatalkan',
    };

    return map[status] ?? status;
};

export default function PembayaranShow() {
    const { id } = usePage<{ id: number }>().props;

    const [pembayaran, setPembayaran] = useState<Pembayaran | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        getPembayaran(id)
            .then((response) => {
                setPembayaran(response.data?.pembayaran ?? null);
            })
            .catch((error: any) => {
                console.error('Gagal memuat pembayaran', error);

                if (error.response?.status === 401) {
                    window.location.href = '/login';
                    return;
                }

                setError(
                    error.response?.data?.message ||
                        'Gagal mengambil data pembayaran.',
                );
            })
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) {
        return (
            <>
                <Head title="Detail Pembayaran" />

                <AppLayout>
                    <div className="rounded-xl bg-white p-10 text-center text-sm text-gray-400 shadow-sm">
                        Memuat data...
                    </div>
                </AppLayout>
            </>
        );
    }

    if (error || !pembayaran) {
        return (
            <>
                <Head title="Detail Pembayaran" />

                <AppLayout>
                    <div className="rounded-xl bg-white p-10 text-center text-sm text-gray-400 shadow-sm">
                        {error || 'Pembayaran tidak ditemukan.'}
                    </div>
                </AppLayout>
            </>
        );
    }

    const items: DetailItem[] = pembayaran.detail_items ?? [];

    return (
        <>
            <Head title={`Pembayaran ${pembayaran.invoice_number}`} />

            <AppLayout wide>
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-3">
                        <button
                            type="button"
                            onClick={() => router.visit('/pembayarans')}
                            className="flex h-10 items-center justify-center rounded-full bg-[#d9d9d9] px-3 text-[13px] font-bold text-gray-600 transition hover:bg-[#c9c9c9]"
                        >
                            Kembali
                        </button>

                        <div>
                            <h2 className="text-lg font-bold text-gray-800 sm:text-xl">
                                {pembayaran.invoice_number}
                            </h2>

                            <p className="mt-0.5 text-xs text-gray-400">
                                Detail tagihan pembayaran
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mt-4">
                    {/* STATUS STRIP */}
                    <div className="flex items-center justify-between rounded-xl bg-[#084e7a] p-5 text-white sm:px-6">
                        <div>
                            <p className="text-[12px] text-white/70 uppercase">
                                Status Pembayaran
                            </p>

                            <p className="mt-1 text-2xl font-bold">
                                {statusLabel(pembayaran.status)}
                            </p>
                        </div>

                        <span
                            className={`rounded-lg px-3 py-1.5 text-[12px] font-bold ${statusBadgeClass(
                                pembayaran.status,
                            )}`}
                        >
                            {pembayaran.status === 'paid'
                                ? 'Sudah dibayar'
                                : pembayaran.status}
                        </span>
                    </div>

                    <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
                        {/* INFORMASI PEMBAYARAN */}
                        <div className="rounded-xl bg-white p-5 shadow-sm">
                            <h3 className="text-[13px] font-bold text-gray-700">
                                Informasi Pembayaran
                            </h3>

                            <div className="mt-4 space-y-3">
                                <div>
                                    <p className="text-[11px] text-gray-400">
                                        Tanggal
                                    </p>

                                    <p className="text-[13px] font-semibold text-gray-700">
                                        {formatDate(pembayaran.tanggal)}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-[11px] text-gray-400">
                                        Metode
                                    </p>

                                    <p className="text-[13px] font-semibold text-gray-700">
                                        {metodeLabel(pembayaran.metode)}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-[11px] text-gray-400">
                                        Total
                                    </p>

                                    <p className="text-[16px] font-bold text-[#07577f]">
                                        {formatRupiah(pembayaran.total)}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-[11px] text-gray-400">
                                        Keterangan
                                    </p>

                                    <p className="text-[13px] font-semibold text-gray-700">
                                        {pembayaran.keterangan || '-'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* INFORMASI PEMERIKSAAN */}
                        <div className="rounded-xl bg-white p-5 shadow-sm">
                            <h3 className="text-[13px] font-bold text-gray-700">
                                Informasi Pemeriksaan
                            </h3>

                            <div className="mt-4 space-y-3">
                                <div className="flex items-center gap-2">
                                    <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#07577f]/10 text-[14px] font-bold text-[#07577f]">
                                        {pembayaran.pemeriksaan?.queue_number ??
                                            '-'}
                                    </span>

                                    <div>
                                        <p className="text-[13px] font-semibold text-gray-700">
                                            {pembayaran.pemeriksaan?.pasien
                                                ?.name ?? '-'}
                                        </p>

                                        <p className="text-[11px] text-gray-400">
                                            No. RM{' '}
                                            {pembayaran.pemeriksaan?.pasien
                                                ?.medical_record_number ?? '-'}
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-[11px] text-gray-400">
                                        Poli
                                    </p>

                                    <p className="text-[13px] font-semibold text-gray-700">
                                        {pembayaran.pemeriksaan?.poli?.name ??
                                            '-'}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-[11px] text-gray-400">
                                        Diagnosis
                                    </p>

                                    <p className="text-[13px] font-semibold text-gray-700">
                                        {pembayaran.pemeriksaan?.diagnosis ||
                                            '-'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* ITEM TAGIHAN */}
                        <div className="rounded-xl bg-white p-5 shadow-sm">
                            <h3 className="text-[13px] font-bold text-gray-700">
                                Item Tagihan
                            </h3>

                            {items.length === 0 ? (
                                <p className="mt-4 text-[13px] text-gray-400">
                                    Tidak ada item rincian.
                                </p>
                            ) : (
                                <div className="mt-4 space-y-3">
                                    {items.map((item, index) => (
                                        <div
                                            key={index}
                                            className="flex items-start justify-between gap-2 rounded-[10px] bg-[#f7f9fb] p-3"
                                        >
                                            <div>
                                                <p className="text-[13px] font-semibold text-gray-700">
                                                    {item.description}
                                                </p>

                                                <p className="text-[11px] text-gray-400">
                                                    {item.quantity ?? '-'} x{' '}
                                                    {formatRupiah(
                                                        item.unit_price ?? 0,
                                                    )}
                                                </p>
                                            </div>

                                            <p className="text-[13px] font-bold text-gray-800">
                                                {formatRupiah(
                                                    (item.quantity ?? 0) *
                                                        (item.unit_price ?? 0),
                                                )}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </AppLayout>
        </>
    );
}
