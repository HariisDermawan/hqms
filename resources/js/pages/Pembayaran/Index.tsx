import { Head, Link } from '@inertiajs/react';
import { useCallback, useEffect, useState } from 'react';
import {
    deletePembayaran,
    getPembayarans,
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

const metodeLabel = (metode: Pembayaran['metode']): string => {
    const map: Record<Pembayaran['metode'], string> = {
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

export default function PembayaranIndex() {
    const [items, setItems] = useState<Pembayaran[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [deletingId, setDeletingId] = useState<number | null>(null);

    const load = useCallback(async () => {
        try {
            setLoading(true);

            const response = await getPembayarans(1, 100);

            setItems(response.data?.items ?? []);
            setError('');
        } catch (error: any) {
            console.error('Gagal memuat pembayaran', error);

            if (error.response?.status === 401) {
                window.location.href = '/login';
                return;
            }

            setError(
                error.response?.data?.message ||
                    'Gagal mengambil data pembayaran.',
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void load();
    }, [load]);

    const handleDelete = async (pembayaran: Pembayaran) => {
        const confirmed = window.confirm(
            `Hapus ${pembayaran.invoice_number}? Tindakan ini tidak bisa dibatalkan.`,
        );

        if (!confirmed) {
            return;
        }

        try {
            setDeletingId(pembayaran.id);

            await deletePembayaran(pembayaran.id);

            await load();
        } catch (error: any) {
            console.error('Gagal menghapus pembayaran', error);

            window.alert(
                error.response?.data?.message || 'Gagal menghapus pembayaran.',
            );
        } finally {
            setDeletingId(null);
        }
    };

    const filtered = items
        .filter((pembayaran) => {
            if (statusFilter && pembayaran.status !== statusFilter) {
                return false;
            }

            const keyword = search.toLowerCase().trim();

            if (!keyword) {
                return true;
            }

            const invoice = pembayaran.invoice_number.toLowerCase();
            const patientName =
                pembayaran.pemeriksaan?.pasien?.name.toLowerCase() ?? '';
            const mrNumber =
                pembayaran.pemeriksaan?.pasien?.medical_record_number.toLowerCase() ??
                '';
            const queueNumber =
                pembayaran.pemeriksaan?.queue_number?.toLowerCase() ?? '';

            return (
                invoice.includes(keyword) ||
                patientName.includes(keyword) ||
                mrNumber.includes(keyword) ||
                queueNumber.includes(keyword)
            );
        })
        .sort(
            (a, b) =>
                (b.tanggal ?? '').localeCompare(a.tanggal ?? '') ||
                b.invoice_number.localeCompare(a.invoice_number),
        );

    return (
        <>
            <Head title="Pembayaran" />

            <AppLayout wide>
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h2 className="text-lg font-bold text-gray-800 sm:text-xl">
                            Pembayaran
                        </h2>

                        <p className="mt-1 text-xs text-gray-400 sm:text-sm">
                            Tagihan pembayaran pasien
                        </p>
                    </div>

                    <Link
                        href="/pembayarans/create"
                        className="flex h-[43px] items-center gap-2 rounded-[12px] bg-[#084e7a] px-4 text-[13px] font-bold text-white transition hover:bg-[#063f62] hover:shadow-md active:scale-[0.99]"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <path d="M12 5v14M5 12h14" />
                        </svg>
                        Buat Pembayaran
                    </Link>
                </div>

                <div className="mt-4">
                    <div className="flex flex-col gap-2 sm:flex-row">
                        <div className="flex h-12 w-full flex-1 items-center rounded-full border border-gray-200 bg-white px-4 shadow-sm">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="mr-3 h-5 w-5 shrink-0 text-gray-400"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                            >
                                <circle cx="11" cy="11" r="7" />
                                <path d="m20 20-4-4" />
                            </svg>

                            <input
                                type="text"
                                value={search}
                                onChange={(event) =>
                                    setSearch(event.target.value)
                                }
                                placeholder="Cari No. invoice, nama pasien, No. RM, atau no. antrian..."
                                className="w-full bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400"
                            />
                        </div>

                        <select
                            value={statusFilter}
                            onChange={(event) =>
                                setStatusFilter(event.target.value)
                            }
                            className="h-11 w-full rounded-full border border-gray-200 bg-white px-4 text-xs text-gray-600 shadow-sm outline-none sm:w-[180px]"
                        >
                            <option value="">Semua Status</option>
                            <option value="unpaid">Belum Bayar</option>
                            <option value="paid">Lunas</option>
                            <option value="refunded">Refund</option>
                            <option value="cancelled">Dibatalkan</option>
                        </select>
                    </div>

                    {error && (
                        <div className="mt-4 rounded-[10px] bg-red-50 px-3 py-2 text-[12px] text-red-500">
                            {error}
                        </div>
                    )}

                    {loading ? (
                        <div className="mt-4 rounded-xl bg-white p-10 text-center text-sm text-gray-400 shadow-sm">
                            Memuat data...
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="mt-4 rounded-xl bg-white p-10 text-center text-sm text-gray-400 shadow-sm">
                            Tidak ada pembayaran yang cocok.
                        </div>
                    ) : (
                        <div className="mt-4 overflow-hidden rounded-xl bg-white shadow-sm">
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[880px] text-left">
                                    <thead>
                                        <tr className="border-b border-gray-100 text-[11px] tracking-wide text-gray-400 uppercase">
                                            <th className="px-5 py-3.5 font-semibold">
                                                No. Invoice
                                            </th>
                                            <th className="px-5 py-3.5 font-semibold">
                                                Pasien
                                            </th>
                                            <th className="px-5 py-3.5 font-semibold">
                                                Antrian
                                            </th>
                                            <th className="px-5 py-3.5 font-semibold">
                                                Tanggal
                                            </th>
                                            <th className="px-5 py-3.5 font-semibold">
                                                Metode
                                            </th>
                                            <th className="px-5 py-3.5 font-semibold">
                                                Total
                                            </th>
                                            <th className="px-5 py-3.5 font-semibold">
                                                Status
                                            </th>
                                            <th className="px-5 py-3.5 text-right font-semibold">
                                                Aksi
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {filtered.map((pembayaran) => (
                                            <tr
                                                key={pembayaran.id}
                                                className="border-b border-gray-50 last:border-0 hover:bg-[#f7f9fb]/60"
                                            >
                                                <td className="px-5 py-3.5">
                                                    <p className="text-[13px] font-bold text-[#07577f]">
                                                        {
                                                            pembayaran.invoice_number
                                                        }
                                                    </p>
                                                </td>

                                                <td className="px-5 py-3.5">
                                                    <p className="text-[13px] font-semibold text-gray-800">
                                                        {pembayaran.pemeriksaan
                                                            ?.pasien?.name ??
                                                            '-'}
                                                    </p>

                                                    <p className="text-[11px] text-gray-400">
                                                        No. RM{' '}
                                                        {pembayaran.pemeriksaan
                                                            ?.pasien
                                                            ?.medical_record_number ??
                                                            '-'}
                                                    </p>
                                                </td>

                                                <td className="px-5 py-3.5">
                                                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#07577f]/10 text-[13px] font-bold text-[#07577f]">
                                                        {pembayaran.pemeriksaan
                                                            ?.queue_number ??
                                                            '-'}
                                                    </span>
                                                </td>

                                                <td className="px-5 py-3.5 text-[13px] text-gray-600">
                                                    {formatDate(
                                                        pembayaran.tanggal,
                                                    )}
                                                </td>

                                                <td className="px-5 py-3.5 text-[13px] text-gray-600">
                                                    {metodeLabel(
                                                        pembayaran.metode,
                                                    )}
                                                </td>

                                                <td className="px-5 py-3.5 text-[13px] font-bold text-gray-800">
                                                    {formatRupiah(
                                                        pembayaran.total,
                                                    )}
                                                </td>

                                                <td className="px-5 py-3.5">
                                                    <span
                                                        className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${statusBadgeClass(
                                                            pembayaran.status,
                                                        )}`}
                                                    >
                                                        {statusLabel(
                                                            pembayaran.status,
                                                        )}
                                                    </span>
                                                </td>

                                                <td className="px-5 py-3.5">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Link
                                                            href={`/pembayarans/${pembayaran.id}`}
                                                            className="flex h-10 items-center gap-1.5 rounded-lg bg-[#07577f]/10 px-3 text-[11px] font-semibold text-[#07577f] transition hover:bg-[#07577f]/20 sm:h-8"
                                                        >
                                                            Detail
                                                        </Link>

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleDelete(
                                                                    pembayaran,
                                                                )
                                                            }
                                                            disabled={
                                                                deletingId ===
                                                                pembayaran.id
                                                            }
                                                            className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50 text-red-500 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60 sm:h-8 sm:w-8"
                                                        >
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                className="h-[15px] w-[15px]"
                                                                viewBox="0 0 24 24"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                strokeWidth="1.8"
                                                            >
                                                                <path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                                                                <path d="M10 11v6M14 11v6" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </AppLayout>
        </>
    );
}
