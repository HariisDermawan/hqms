import { Head, Link } from '@inertiajs/react';
import { useCallback, useEffect, useState } from 'react';
import { getPerawats, type Perawat } from '@/api/perawat';
import {
    deletePresensi,
    getPresensis,
    storePresensi,
    type Presensi,
    type PresensiStatus,
} from '@/api/presensi';
import { usePermissions } from '@/lib/permissions';
import AppLayout from '@/Layouts/AppLayout';

const statusLabel: Record<PresensiStatus, string> = {
    hadir: 'Hadir',
    ijin: 'Izin',
    sakit: 'Sakit',
    cuti: 'Cuti',
    alpa: 'Alpa',
};

const statusColor: Record<PresensiStatus, string> = {
    hadir: 'bg-green-50 text-green-600',
    ijin: 'bg-blue-50 text-blue-600',
    sakit: 'bg-orange-50 text-orange-600',
    cuti: 'bg-purple-50 text-purple-600',
    alpa: 'bg-red-50 text-red-600',
};

const formatDateShort = (date?: string): string => {
    if (!date) return '-';

    const parsed = new Date(`${date}T00:00:00`);
    return parsed.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });
};

const time = (value?: string | null): string =>
    value ? value.slice(0, 5) : '-';

const todayShort = (): string => {
    const now = new Date();

    const pad = (n: number) => String(n).padStart(2, '0');

    return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
};

const nowTime = (): string => {
    const now = new Date();

    const pad = (n: number) => String(n).padStart(2, '0');

    return `${pad(now.getHours())}:${pad(now.getMinutes())}`;
};

const inputClass =
    'h-[42px] rounded-[12px] bg-[#d9d9d9] px-[12px] text-[13px] text-gray-700 outline-none focus:bg-[#d5d5d5] focus:ring-2 focus:ring-[#084e7a]/30 transition';

export default function PresensiIndex() {
    const { viewOnly } = usePermissions();
    const [presensis, setPresensis] = useState<Presensi[]>([]);
    const [page, setPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [deletingId, setDeletingId] = useState<number | null>(null);

    // filters
    const [filterPerawat, setFilterPerawat] = useState('');
    const [filterDate, setFilterDate] = useState('');

    // quick check-in / check-out form
    const [perawats, setPerawats] = useState<Perawat[]>([]);
    const [quickPerawat, setQuickPerawat] = useState('');
    const [quickDate, setQuickDate] = useState(todayShort());
    const [quickTimeIn, setQuickTimeIn] = useState('');
    const [quickTimeOut, setQuickTimeOut] = useState('');
    const [saving, setSaving] = useState(false);
    const [quickError, setQuickError] = useState('');

    const loadPresensis = useCallback(async (targetPage = 1) => {
        try {
            setLoading(true);
            setError('');
            setPage(targetPage);

            const response = await getPresensis(targetPage, 15);

            setPresensis(response.data?.items ?? []);
            setLastPage(response.data?.pagination?.last_page ?? 1);
            setTotal(response.data?.pagination?.total ?? 0);
        } catch (error: any) {
            console.error('Gagal memuat presensi', error);

            if (error.response?.status === 401) {
                window.location.href = '/login';
                return;
            }

            setError(
                error.response?.data?.message ||
                    'Gagal mengambil data presensi.',
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void loadPresensis();
    }, [loadPresensis]);

    useEffect(() => {
        getPerawats(1, 100)
            .then((response) => setPerawats(response.data?.items ?? []))
            .catch(() => setPerawats([]));
    }, []);

    const quickCheckIn = () => {
        setQuickTimeIn(nowTime());
    };

    const quickCheckOut = () => {
        setQuickTimeOut(nowTime());
    };

    const handleQuickSave = async () => {
        setQuickError('');

        if (!quickPerawat || !quickDate) {
            setQuickError('Pilih perawat dan tanggal terlebih dahulu.');
            return;
        }

        try {
            setSaving(true);

            await storePresensi({
                perawat_id: Number(quickPerawat),
                date: quickDate,
                time_in: quickTimeIn || undefined,
                time_out: quickTimeOut || undefined,
                status: 'hadir',
            });

            await loadPresensis(page);

            setQuickPerawat('');
            setQuickTimeIn('');
            setQuickTimeOut('');
            setQuickDate(todayShort());
        } catch (error: any) {
            console.error('Gagal menyimpan presensi', error);

            if (error.response?.status === 401) {
                window.location.href = '/login';
                return;
            }

            setQuickError(
                error.response?.data?.message || 'Gagal menyimpan presensi.',
            );
        } finally {
            setSaving(false);
        }
    };

    const filtered = presensis.filter((presensi) => {
        if (filterPerawat && presensi.perawat_id !== Number(filterPerawat)) {
            return false;
        }

        if (filterDate && presensi.date !== filterDate) {
            return false;
        }

        return true;
    });

    const handleDelete = async (presensi: Presensi) => {
        const label =
            presensi.perawat?.name || `Perawat #${presensi.perawat_id}`;

        const confirmed = window.confirm(
            `Hapus presensi "${label}" tanggal ${formatDateShort(presensi.date)}? Tindakan ini tidak bisa dibatalkan.`,
        );

        if (!confirmed) {
            return;
        }

        try {
            setDeletingId(presensi.id);

            await deletePresensi(presensi.id);

            await loadPresensis(page);
        } catch (error: any) {
            console.error('Gagal menghapus presensi', error);

            window.alert(
                error.response?.data?.message || 'Gagal menghapus presensi.',
            );
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <>
            <Head title="Presensi" />

            <AppLayout wide>
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h2 className="text-lg font-bold text-gray-800 sm:text-xl">
                            Presensi Perawat
                        </h2>

                        <p className="mt-1 text-xs text-gray-400 sm:text-sm">
                            Rekap kehadiran perawat (check-in / check-out)
                        </p>
                    </div>

                    {!viewOnly && (
                        <Link
                            href="/presensis/create"
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
                            Tambah Presensi
                        </Link>
                    )}
                </div>

                {/* QUICK CHECK-IN / CHECK-OUT */}
                {!viewOnly && (
                    <div className="mt-4 rounded-xl bg-gradient-to-r from-[#084e7a] to-[#07577f] p-5 shadow-sm sm:p-6">
                        <h3 className="text-sm font-bold text-white">
                            Presensi Cepat (Check-in / Check-out)
                        </h3>

                        <p className="mt-0.5 text-[12px] text-white/70">
                            Pilih perawat dan catat jam masuk / keluar hari ini
                        </p>

                        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-6">
                            <div className="lg:col-span-2">
                                <select
                                    value={quickPerawat}
                                    onChange={(event) =>
                                        setQuickPerawat(event.target.value)
                                    }
                                    className={`${inputClass} w-full bg-white/95`}
                                >
                                    <option value="">
                                        -- Pilih Perawat --
                                    </option>

                                    {perawats.map((perawat) => (
                                        <option
                                            key={perawat.id}
                                            value={perawat.id}
                                        >
                                            {perawat.name} ({perawat.code})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <input
                                type="date"
                                value={quickDate}
                                onChange={(event) =>
                                    setQuickDate(event.target.value)
                                }
                                className={`${inputClass} w-full bg-white/95`}
                            />

                            <button
                                type="button"
                                onClick={quickCheckIn}
                                className="flex h-[42px] items-center justify-center gap-2 rounded-[12px] bg-white text-[12px] font-bold text-[#084e7a] transition hover:bg-gray-100"
                            >
                                Check-in
                                {quickTimeIn && (
                                    <span className="rounded bg-[#084e7a] px-1.5 py-0.5 text-[11px] font-bold text-white">
                                        {quickTimeIn}
                                    </span>
                                )}
                            </button>

                            <button
                                type="button"
                                onClick={quickCheckOut}
                                className="flex h-[42px] items-center justify-center gap-2 rounded-[12px] bg-white text-[12px] font-bold text-[#084e7a] transition hover:bg-gray-100"
                            >
                                Check-out
                                {quickTimeOut && (
                                    <span className="rounded bg-[#084e7a] px-1.5 py-0.5 text-[11px] font-bold text-white">
                                        {quickTimeOut}
                                    </span>
                                )}
                            </button>

                            <button
                                type="button"
                                onClick={() => void handleQuickSave()}
                                disabled={saving}
                                className="flex h-[42px] items-center justify-center rounded-[12px] bg-white text-[12px] font-bold text-[#064470] ring-2 ring-white/40 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {saving ? 'Menyimpan...' : 'Simpan'}
                            </button>
                        </div>

                        {quickError && (
                            <div className="mt-3 rounded-[10px] bg-red-50 px-3 py-2 text-[12px] text-red-500">
                                {quickError}
                            </div>
                        )}
                    </div>
                )}

                {/* FILTERS */}
                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="flex h-12 items-center rounded-full border border-gray-200 bg-white px-4 shadow-sm">
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

                        <select
                            value={filterPerawat}
                            onChange={(event) =>
                                setFilterPerawat(event.target.value)
                            }
                            className="w-full bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400"
                        >
                            <option value="">Semua Perawat</option>

                            {perawats.map((perawat) => (
                                <option key={perawat.id} value={perawat.id}>
                                    {perawat.name} ({perawat.code})
                                </option>
                            ))}
                        </select>
                    </div>

                    <input
                        type="date"
                        value={filterDate}
                        onChange={(event) => setFilterDate(event.target.value)}
                        className="h-12 rounded-full border border-gray-200 bg-white px-4 text-sm text-gray-700 shadow-sm outline-none"
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
                        Data presensi tidak ditemukan.
                    </div>
                ) : (
                    <div className="mt-4 overflow-hidden rounded-xl bg-white shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[760px] text-left">
                                <thead>
                                    <tr className="border-b border-gray-100 bg-[#f7f9fb]">
                                        <th className="px-4 py-3 text-[11px] font-semibold tracking-wider text-gray-400 uppercase">
                                            Karyawan
                                        </th>
                                        <th className="px-4 py-3 text-[11px] font-semibold tracking-wider text-gray-400 uppercase">
                                            Tanggal
                                        </th>
                                        <th className="px-4 py-3 text-[11px] font-semibold tracking-wider text-gray-400 uppercase">
                                            Masuk
                                        </th>
                                        <th className="px-4 py-3 text-[11px] font-semibold tracking-wider text-gray-400 uppercase">
                                            Keluar
                                        </th>
                                        <th className="px-4 py-3 text-[11px] font-semibold tracking-wider text-gray-400 uppercase">
                                            Status
                                        </th>
                                        <th className="px-4 py-3 text-center text-[11px] font-semibold tracking-wider text-gray-400 uppercase">
                                            Aksi
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {filtered.map((presensi) => (
                                        <tr
                                            key={presensi.id}
                                            className="border-b border-gray-50 transition hover:bg-[#f7f9fb]"
                                        >
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-[#07577f]/10">
                                                        {presensi.perawat
                                                            ?.image_url ? (
                                                            <img
                                                                src={
                                                                    presensi
                                                                        .perawat
                                                                        .image_url
                                                                }
                                                                alt={
                                                                    presensi
                                                                        .perawat
                                                                        ?.name
                                                                }
                                                                className="h-full w-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="flex h-full w-full items-center justify-center">
                                                                <span className="text-[13px] font-bold text-[#07577f]">
                                                                    {(
                                                                        presensi
                                                                            .perawat
                                                                            ?.name ??
                                                                        '?'
                                                                    )
                                                                        .charAt(
                                                                            0,
                                                                        )
                                                                        .toUpperCase()}
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div>
                                                        <Link
                                                            href={`/presensis/${presensi.id}`}
                                                            className="text-[13px] font-semibold text-[#07577f] hover:underline"
                                                        >
                                                            {presensi.perawat
                                                                ?.name ||
                                                                `Perawat #${presensi.perawat_id}`}
                                                        </Link>

                                                        <p className="flex items-center gap-1.5 text-[11px] text-gray-400">
                                                            <span className="font-medium text-gray-500">
                                                                {presensi
                                                                    .perawat
                                                                    ?.code ||
                                                                    '-'}
                                                            </span>

                                                            <span className="text-gray-300">
                                                                •
                                                            </span>

                                                            <span>
                                                                {presensi
                                                                    .perawat
                                                                    ?.gender ===
                                                                'P'
                                                                    ? 'Perempuan'
                                                                    : 'Laki-laki'}
                                                            </span>
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="px-4 py-3 text-[13px] text-gray-600">
                                                {formatDateShort(presensi.date)}
                                            </td>

                                            <td className="px-4 py-3">
                                                <span
                                                    className={`inline-flex rounded-md px-2 py-1 text-[12px] font-semibold ${presensi.time_in ? 'bg-green-50 text-green-600' : 'bg-gray-50 text-gray-400'}`}
                                                >
                                                    {time(presensi.time_in) ||
                                                        'Belum'}
                                                </span>
                                            </td>

                                            <td className="px-4 py-3">
                                                <span
                                                    className={`inline-flex rounded-md px-2 py-1 text-[12px] font-semibold ${presensi.time_out ? 'bg-orange-50 text-orange-600' : 'bg-gray-50 text-gray-400'}`}
                                                >
                                                    {time(presensi.time_out) ||
                                                        'Belum'}
                                                </span>
                                            </td>

                                            <td className="px-4 py-3">
                                                <span
                                                    className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${statusColor[presensi.status]}`}
                                                >
                                                    {
                                                        statusLabel[
                                                            presensi.status
                                                        ]
                                                    }
                                                </span>
                                            </td>

                                            <td className="px-4 py-3">
                                                <div className="flex items-center justify-center gap-1.5">
                                                    <Link
                                                        href={`/presensis/${presensi.id}`}
                                                        className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#07577f]/10 text-[#07577f] transition hover:bg-[#07577f]/20"
                                                    >
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            className="h-[14px] w-[14px]"
                                                            viewBox="0 0 24 24"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            strokeWidth="1.8"
                                                        >
                                                            <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
                                                            <circle
                                                                cx="12"
                                                                cy="12"
                                                                r="3"
                                                            />
                                                        </svg>
                                                    </Link>

                                                    {!viewOnly && (
                                                        <>
                                                            <Link
                                                                href={`/presensis/${presensi.id}/edit`}
                                                                className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-500 transition hover:bg-blue-100"
                                                            >
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    className="h-[14px] w-[14px]"
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
                                                                    void handleDelete(
                                                                        presensi,
                                                                    )
                                                                }
                                                                disabled={
                                                                    deletingId ===
                                                                    presensi.id
                                                                }
                                                                className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-red-500 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                                                            >
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    className="h-[14px] w-[14px]"
                                                                    viewBox="0 0 24 24"
                                                                    fill="none"
                                                                    stroke="currentColor"
                                                                    strokeWidth="1.8"
                                                                >
                                                                    <path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                                                                    <path d="M10 11v6M14 11v6" />
                                                                </svg>
                                                            </button>
                                                        </>
                                                    )}
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
                                onClick={() => void loadPresensis(page - 1)}
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
                                onClick={() => void loadPresensis(page + 1)}
                                className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:bg-[#f7f9fb] disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                ›
                            </button>
                        </div>
                    </div>
                )}
            </AppLayout>
        </>
    );
}
