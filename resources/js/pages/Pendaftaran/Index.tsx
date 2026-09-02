import { Head, Link } from '@inertiajs/react';
import { useCallback, useEffect, useState } from 'react';
import {
    deletePendaftaran,
    getPendaftarans,
    type Pendaftaran,
} from '@/api/pendaftaran';
import AppLayout from '@/Layouts/AppLayout';
import { statusBadgeClass, statusLabel } from './Form';

const formatDate = (date: string): string => {
    if (!date) {
        return '-';
    }

    const [year, month, day] = date.split('-');

    return `${day}/${month}/${year}`;
};

export default function PendaftaranIndex() {
    const [pendaftarans, setPendaftarans] = useState<Pendaftaran[]>([]);
    const [page, setPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [dateFilter, setDateFilter] = useState('');
    const [deletingId, setDeletingId] = useState<number | null>(null);

    const loadPendaftarans = useCallback(async (targetPage = 1) => {
        try {
            setLoading(true);
            setError('');
            setPage(targetPage);

            const response = await getPendaftarans(1, 100);

            setPendaftarans(response.data?.items ?? []);
            setLastPage(response.data?.pagination?.last_page ?? 1);
            setTotal(response.data?.pagination?.total ?? 0);
        } catch (error: any) {
            console.error('Gagal memuat pendaftaran', error);

            if (error.response?.status === 401) {
                window.location.href = '/login';
                return;
            }

            setError(
                error.response?.data?.message ||
                    'Gagal mengambil data pendaftaran.',
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void loadPendaftarans();
    }, [loadPendaftarans]);

    const handleDelete = async (pendaftaran: Pendaftaran) => {
        const label = `${pendaftaran.pasien?.name ?? `Pendaftaran #${pendaftaran.id}`} (No. ${pendaftaran.queue_number})`;
        const confirmed = window.confirm(
            `Hapus pendaftaran "${label}"? Tindakan ini tidak bisa dibatalkan.`,
        );

        if (!confirmed) {
            return;
        }

        try {
            setDeletingId(pendaftaran.id);

            await deletePendaftaran(pendaftaran.id);

            await loadPendaftarans(page);
        } catch (error: any) {
            console.error('Gagal menghapus pendaftaran', error);

            window.alert(
                error.response?.data?.message || 'Gagal menghapus pendaftaran.',
            );
        } finally {
            setDeletingId(null);
        }
    };

    const filtered = pendaftarans
        .filter((pendaftaran) => {
            const keyword = search.toLowerCase().trim();

            if (keyword) {
                const patientName =
                    pendaftaran.pasien?.name.toLowerCase() ?? '';
                const mrNumber =
                    pendaftaran.pasien?.medical_record_number.toLowerCase() ??
                    '';
                const registrationNumber =
                    pendaftaran.registration_number.toLowerCase();
                const poliName = pendaftaran.poli?.name.toLowerCase() ?? '';

                if (
                    !patientName.includes(keyword) &&
                    !mrNumber.includes(keyword) &&
                    !registrationNumber.includes(keyword) &&
                    !poliName.includes(keyword)
                ) {
                    return false;
                }
            }

            if (statusFilter && pendaftaran.status !== statusFilter) {
                return false;
            }

            if (dateFilter && pendaftaran.registration_date !== dateFilter) {
                return false;
            }

            return true;
        })
        .sort(
            (a, b) =>
                b.registration_date.localeCompare(a.registration_date) ||
                a.queue_number.localeCompare(b.queue_number),
        );

    return (
        <>
            <Head title="Pendaftaran" />

            <AppLayout wide>
                <div className="flex items-end justify-between">
                    <div>
                        <h2 className="text-lg font-bold text-gray-800 sm:text-xl">
                            Pendaftaran
                        </h2>

                        <p className="mt-1 text-xs text-gray-400 sm:text-sm">
                            Daftar pendaftaran pasien per poli
                        </p>
                    </div>

                    <Link
                        href="/pendaftarans/create"
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
                        Registrasi Pasien
                    </Link>
                </div>

                <div className="mt-4">
                    {/* SEARCH + FILTERS */}
                    <div className="flex flex-col gap-2 sm:flex-row">
                        <div className="flex h-11 flex-1 items-center rounded-full border border-gray-200 bg-white px-4 shadow-sm">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="mr-3 h-[17px] w-[17px] text-gray-400"
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
                                placeholder="Cari nama pasien, No. RM, No. registrasi, atau poli..."
                                className="w-full bg-transparent text-xs text-gray-700 outline-none placeholder:text-gray-400"
                            />
                        </div>

                        <select
                            value={statusFilter}
                            onChange={(event) =>
                                setStatusFilter(event.target.value)
                            }
                            className="h-11 w-full rounded-full border border-gray-200 bg-white px-4 text-xs text-gray-600 shadow-sm outline-none sm:w-[150px]"
                        >
                            <option value="">Semua Status</option>
                            <option value="waiting">Menunggu</option>
                            <option value="called">Dipanggil</option>
                            <option value="serving">Dilayani</option>
                            <option value="completed">Selesai</option>
                            <option value="cancelled">Dibatalkan</option>
                        </select>

                        <input
                            type="date"
                            value={dateFilter}
                            onChange={(event) =>
                                setDateFilter(event.target.value)
                            }
                            className="h-11 w-full rounded-full border border-gray-200 bg-white px-4 text-xs text-gray-600 shadow-sm outline-none sm:w-[170px]"
                        />
                    </div>

                    {error && (
                        <div className="mt-4 rounded-[10px] bg-red-50 px-3 py-2 text-[12px] text-red-500">
                            {error}
                        </div>
                    )}

                    {/* TABLE */}
                    {loading ? (
                        <div className="mt-4 rounded-xl bg-white p-10 text-center text-sm text-gray-400 shadow-sm">
                            Memuat data...
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="mt-4 rounded-xl bg-white p-10 text-center text-sm text-gray-400 shadow-sm">
                            Tidak ada pendaftaran yang cocok.
                        </div>
                    ) : (
                        <div className="mt-4 overflow-hidden rounded-xl bg-white shadow-sm">
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[860px] text-left">
                                    <thead>
                                        <tr className="border-b border-gray-100 text-[11px] tracking-wide text-gray-400 uppercase">
                                            <th className="px-5 py-3.5 font-semibold">
                                                Antrean
                                            </th>
                                            <th className="px-5 py-3.5 font-semibold">
                                                No. Registrasi
                                            </th>
                                            <th className="px-5 py-3.5 font-semibold">
                                                Pasien
                                            </th>
                                            <th className="px-5 py-3.5 font-semibold">
                                                Poli
                                            </th>
                                            <th className="px-5 py-3.5 font-semibold">
                                                Tanggal
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
                                        {filtered.map((pendaftaran) => (
                                            <tr
                                                key={pendaftaran.id}
                                                className="border-b border-gray-50 last:border-0 hover:bg-[#f7f9fb]/60"
                                            >
                                                <td className="px-5 py-3.5">
                                                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#07577f]/10 text-[13px] font-bold text-[#07577f]">
                                                        {
                                                            pendaftaran.queue_number
                                                        }
                                                    </span>
                                                </td>

                                                <td className="px-5 py-3.5">
                                                    <p className="text-[13px] font-semibold text-gray-700">
                                                        {
                                                            pendaftaran.registration_number
                                                        }
                                                    </p>

                                                    <p className="text-[11px] text-gray-400">
                                                        Antrean yang sama dapat
                                                        dibuat ulang
                                                    </p>
                                                </td>

                                                <td className="px-5 py-3.5">
                                                    <div>
                                                        <p className="text-[13px] font-semibold text-gray-800">
                                                            {pendaftaran.pasien
                                                                ?.name ?? '-'}
                                                        </p>

                                                        <p className="text-[11px] text-gray-400">
                                                            No. RM{' '}
                                                            {pendaftaran.pasien
                                                                ?.medical_record_number ??
                                                                '-'}
                                                        </p>
                                                    </div>
                                                </td>

                                                <td className="px-5 py-3.5">
                                                    <span className="rounded-md bg-[#07577f]/10 px-2 py-1 text-[11px] font-semibold text-[#07577f]">
                                                        {pendaftaran.poli
                                                            ?.name || '-'}
                                                    </span>
                                                </td>

                                                <td className="px-5 py-3.5 text-[13px] text-gray-600">
                                                    {formatDate(
                                                        pendaftaran.registration_date,
                                                    )}
                                                </td>

                                                <td className="px-5 py-3.5">
                                                    <span
                                                        className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${statusBadgeClass(pendaftaran.status)}`}
                                                    >
                                                        {statusLabel(
                                                            pendaftaran.status,
                                                        )}
                                                    </span>
                                                </td>

                                                <td className="px-5 py-3.5">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Link
                                                            href={`/pendaftarans/${pendaftaran.id}`}
                                                            className="flex h-8 items-center gap-1.5 rounded-lg bg-[#07577f]/10 px-3 text-[11px] font-semibold text-[#07577f] transition hover:bg-[#07577f]/20"
                                                        >
                                                            Detail
                                                        </Link>

                                                        <Link
                                                            href={`/pendaftarans/${pendaftaran.id}/edit`}
                                                            className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-500 transition hover:bg-blue-100"
                                                        >
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                className="h-[15px] w-[15px]"
                                                                viewBox="0 0 24 24"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                strokeWidth="1.8"
                                                            >
                                                                <path d="M12 20h9" />
                                                                <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
                                                            </svg>
                                                        </Link>

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleDelete(
                                                                    pendaftaran,
                                                                )
                                                            }
                                                            disabled={
                                                                deletingId ===
                                                                pendaftaran.id
                                                            }
                                                            className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-red-500 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
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

                    {/* PAGINATION */}
                    {!loading && total > 0 && (
                        <div className="mt-4 flex items-center justify-between rounded-xl bg-white px-5 py-3 shadow-sm">
                            <p className="text-xs text-gray-400">
                                Menampilkan {filtered.length} dari {total} data
                            </p>

                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    disabled={page <= 1}
                                    onClick={() => loadPendaftarans(page - 1)}
                                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:bg-[#f7f9fb] disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    ‹
                                </button>

                                <span className="min-w-[70px] text-center text-xs font-medium text-gray-500">
                                    Hal {page} / {lastPage}
                                </span>

                                <button
                                    type="button"
                                    disabled={page >= lastPage}
                                    onClick={() => loadPendaftarans(page + 1)}
                                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:bg-[#f7f9fb] disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    ›
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </AppLayout>
        </>
    );
}
