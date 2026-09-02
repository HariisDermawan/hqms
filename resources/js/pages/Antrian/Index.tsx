import { Head, Link } from '@inertiajs/react';
import { useCallback, useEffect, useState } from 'react';
import {
    deleteAntrian,
    getAntrians,
    updateAntrian,
    type Antrian,
    type AntrianStatus,
} from '@/api/antrian';
import { getPolis, type Poli } from '@/api/poli';
import AppLayout from '@/Layouts/AppLayout';
import {
    formatTime,
    statusBadgeClass,
    statusLabel,
    todayLocal,
} from './status';

const STATUS_ORDER: Record<AntrianStatus, number> = {
    waiting: 0,
    called: 1,
    serving: 2,
    completed: 3,
    skipped: 4,
};

const waktuLabel = (antrian: Antrian): string => {
    switch (antrian.status) {
        case 'called':
            return `Panggil ${formatTime(antrian.called_at)}`;
        case 'serving':
            return `Mulai ${formatTime(antrian.started_at)}`;
        case 'completed':
            return `Selesai ${formatTime(antrian.completed_at)}`;
        default:
            return '—';
    }
};

export default function AntrianIndex() {
    const [antrians, setAntrians] = useState<Antrian[]>([]);
    const [polis, setPolis] = useState<Poli[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');
    const [poliFilter, setPoliFilter] = useState('all');
    const [scope, setScope] = useState<'today' | 'all'>('today');
    const [busyId, setBusyId] = useState<number | null>(null);

    const loadAntrians = useCallback(async (silent = false): Promise<void> => {
        try {
            if (!silent) {
                setLoading(true);
            }

            const [antriansResponse, polisResponse] = await Promise.all([
                getAntrians({ perPage: 100 }),
                getPolis(1, 100),
            ]);

            setAntrians(antriansResponse.data?.items ?? []);
            setPolis(polisResponse.data?.items ?? []);

            setError('');
        } catch (error: any) {
            console.error('Gagal memuat antrean', error);

            if (error.response?.status === 401) {
                window.location.href = '/login';
                return;
            }

            setError(
                error.response?.data?.message ||
                    'Gagal mengambil data antrean.',
            );
        } finally {
            if (!silent) {
                setLoading(false);
            }
        }
    }, []);

    useEffect(() => {
        void loadAntrians();

        const interval = window.setInterval(() => {
            void loadAntrians(true);
        }, 10_000);

        return () => window.clearInterval(interval);
    }, [loadAntrians]);

    const changeStatus = async (
        antrian: Antrian,
        status: AntrianStatus,
        label: string,
    ) => {
        const confirmed = window.confirm(
            `Pindahkan antrean ${antrian.queue_number} ke status "${label}"?`,
        );

        if (!confirmed) {
            return;
        }

        try {
            setBusyId(antrian.id);

            setAntrians((current) =>
                current.map((item) =>
                    item.id === antrian.id ? { ...item, status } : item,
                ),
            );

            await updateAntrian(antrian.id, { status });

            await loadAntrians();
        } catch (error: any) {
            console.error('Gagal memperbarui status antrean', error);

            if (error.response?.status === 401) {
                window.location.href = '/login';
            }

            window.alert(
                error.response?.data?.message ||
                    'Gagal memperbarui status antrean.',
            );

            await loadAntrians(true);
        } finally {
            setBusyId(null);
        }
    };

    const handleDelete = async (antrian: Antrian) => {
        const confirmed = window.confirm(
            `Hapus antrean ${antrian.queue_number}? Tindakan ini tidak bisa dibatalkan.`,
        );

        if (!confirmed) {
            return;
        }

        try {
            setBusyId(antrian.id);

            await deleteAntrian(antrian.id);

            await loadAntrians();
        } catch (error: any) {
            console.error('Gagal menghapus antrean', error);

            window.alert(
                error.response?.data?.message || 'Gagal menghapus antrean.',
            );
        } finally {
            setBusyId(null);
        }
    };

    const filtered = antrians
        .filter((antrian) => {
            if (scope === 'today') {
                const registeredToday =
                    antrian.pendaftaran?.registration_date === todayLocal();
                const isFreshTicket = !antrian.pendaftaran;

                if (!registeredToday && !isFreshTicket) {
                    return false;
                }
            }

            if (
                poliFilter !== 'all' &&
                antrian.poli?.id !== Number(poliFilter)
            ) {
                return false;
            }

            const keyword = search.toLowerCase().trim();

            if (keyword) {
                const queueNumber = antrian.queue_number.toLowerCase();
                const poliName = antrian.poli?.name.toLowerCase() ?? '';

                if (
                    !queueNumber.includes(keyword) &&
                    !poliName.includes(keyword)
                ) {
                    return false;
                }
            }

            return true;
        })
        .sort(
            (a, b) =>
                STATUS_ORDER[a.status] - STATUS_ORDER[b.status] || a.id - b.id,
        );

    const active = filtered.filter(
        (antrian) =>
            antrian.status !== 'completed' && antrian.status !== 'skipped',
    );

    const nowServing =
        active.find((antrian) => antrian.status === 'serving') ??
        active.find((antrian) => antrian.status === 'called') ??
        null;

    const waitingCount = active.filter(
        (antrian) => antrian.status === 'waiting',
    ).length;

    return (
        <>
            <Head title="Antrean" />

            <AppLayout wide>
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h2 className="text-lg font-bold text-gray-800 sm:text-xl">
                            Antrean
                        </h2>

                        <p className="mt-1 text-xs text-gray-400 sm:text-sm">
                            Kelola antrean pasien per poli
                        </p>
                    </div>

                    <Link
                        href="/antrians/create"
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
                        Tambah Antrean
                    </Link>
                </div>

                <div className="mt-4">
                    {/* NOW SERVING */}
                    <div className="overflow-hidden rounded-xl bg-[#07577f] text-white shadow-sm">
                        <div className="flex flex-col gap-6 p-5 sm:flex-row sm:items-center sm:p-6">
                            <div className="flex-1">
                                <p className="text-[11px] font-semibold tracking-[0.14em] text-white/50 uppercase">
                                    Sedang dilayani
                                </p>

                                {nowServing ? (
                                    <div className="mt-3 flex flex-wrap items-end gap-x-4 gap-y-2">
                                        <span className="text-4xl font-black tracking-tight sm:text-5xl">
                                            {nowServing.queue_number}
                                        </span>

                                        <div>
                                            {nowServing.pendaftaran?.pasien ? (
                                                <>
                                                    <p className="text-base font-bold sm:text-lg">
                                                        {
                                                            nowServing
                                                                .pendaftaran
                                                                .pasien.name
                                                        }
                                                    </p>

                                                    <p className="text-[12px] text-white/60">
                                                        {nowServing.poli?.name}{' '}
                                                        · No. RM{' '}
                                                        {
                                                            nowServing
                                                                .pendaftaran
                                                                .pasien
                                                                .medical_record_number
                                                        }
                                                    </p>
                                                </>
                                            ) : (
                                                <>
                                                    <p className="text-base font-bold text-white/80">
                                                        Pasien belum didaftarkan
                                                    </p>

                                                    <p className="text-[12px] text-white/60">
                                                        {nowServing.poli
                                                            ?.name ?? '-'}
                                                    </p>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="mt-3">
                                        <p className="text-lg font-semibold text-white/70">
                                            Belum ada pasien dipanggil
                                        </p>
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="text-center">
                                    <div className="flex h-14 w-14 flex-col items-center justify-center rounded-xl bg-white/10">
                                        <span className="text-xl font-black">
                                            {waitingCount}
                                        </span>
                                    </div>
                                    <p className="mt-1.5 text-[10px] tracking-wide text-white/50 uppercase">
                                        Menunggu
                                    </p>
                                </div>

                                <div className="text-center">
                                    <div className="flex h-14 w-14 flex-col items-center justify-center rounded-xl bg-white/10">
                                        <span className="text-xl font-black">
                                            {active.length}
                                        </span>
                                    </div>
                                    <p className="mt-1.5 text-[10px] tracking-wide text-white/50 uppercase">
                                        Aktif
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* SEARCH */}
                    <div className="mt-4 flex h-12 items-center rounded-full border border-gray-200 bg-white px-4 shadow-sm">
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
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder="Cari nomor antrean atau poli..."
                            className="w-full bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400"
                        />
                    </div>

                    {/* FILTERS */}
                    <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center">
                        <select
                            value={poliFilter}
                            onChange={(event) =>
                                setPoliFilter(event.target.value)
                            }
                            className="h-12 w-full rounded-full border border-gray-200 bg-white px-4 text-xs text-gray-600 shadow-sm outline-none sm:w-[190px]"
                        >
                            <option value="all">Semua Poli</option>
                            {polis.map((poli) => (
                                <option key={poli.id} value={poli.id}>
                                    {poli.name}
                                </option>
                            ))}
                        </select>

                        <div className="flex h-12 items-center overflow-hidden rounded-full border border-gray-200 bg-white shadow-sm">
                            <button
                                type="button"
                                onClick={() => setScope('today')}
                                className={`h-full px-4 text-xs font-semibold transition ${
                                    scope === 'today'
                                        ? 'bg-[#07577f] text-white'
                                        : 'text-gray-500 hover:bg-[#f7f9fb]'
                                }`}
                            >
                                Hari Ini
                            </button>

                            <button
                                type="button"
                                onClick={() => setScope('all')}
                                className={`h-full px-4 text-xs font-semibold transition ${
                                    scope === 'all'
                                        ? 'bg-[#07577f] text-white'
                                        : 'text-gray-500 hover:bg-[#f7f9fb]'
                                }`}
                            >
                                Semua
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div className="mt-4 rounded-[10px] bg-red-50 px-3 py-2 text-[12px] text-red-500">
                            {error}
                        </div>
                    )}

                    {/* CARDS */}
                    {loading ? (
                        <div className="mt-4 rounded-xl bg-white p-10 text-center text-sm text-gray-400 shadow-sm">
                            Memuat data...
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="mt-4 rounded-xl bg-white p-10 text-center text-sm text-gray-400 shadow-sm">
                            Tidak ada antrean yang cocok.
                        </div>
                    ) : (
                        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {filtered.map((antrian) => (
                                <div
                                    key={antrian.id}
                                    className={`rounded-xl border bg-white p-4 shadow-sm ${
                                        antrian.status === 'serving'
                                            ? 'border-indigo-200 ring-1 ring-indigo-100'
                                            : antrian.status === 'completed' ||
                                                antrian.status === 'skipped'
                                              ? 'border-gray-100 opacity-55'
                                              : 'border-gray-100'
                                    }`}
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <span
                                            className={`flex h-12 items-center justify-center rounded-xl px-3 text-lg font-black tracking-tight ${
                                                antrian.status === 'serving'
                                                    ? 'bg-indigo-100 text-indigo-600'
                                                    : 'bg-[#07577f]/10 text-[#07577f]'
                                            }`}
                                        >
                                            {antrian.queue_number}
                                        </span>

                                        <span
                                            className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${statusBadgeClass(antrian.status)}`}
                                        >
                                            {statusLabel(antrian.status)}
                                        </span>
                                    </div>

                                    <div className="mt-3">
                                        <p className="text-[13px] font-bold text-gray-800">
                                            {antrian.poli?.name ?? '-'}
                                        </p>

                                        <p className="mt-0.5 text-[11px] text-gray-400">
                                            {waktuLabel(antrian)}
                                        </p>
                                    </div>

                                    <div className="mt-4 space-y-2">
                                        {antrian.status === 'waiting' && (
                                            <button
                                                type="button"
                                                disabled={busyId === antrian.id}
                                                onClick={() =>
                                                    changeStatus(
                                                        antrian,
                                                        'called',
                                                        'Dipanggil',
                                                    )
                                                }
                                                className="flex h-10 w-full items-center justify-center gap-1 rounded-lg bg-[#07577f] text-[12px] font-semibold text-white transition hover:bg-[#063f62] disabled:cursor-not-allowed disabled:opacity-60"
                                            >
                                                Panggil
                                            </button>
                                        )}

                                        {antrian.status === 'called' && (
                                            <button
                                                type="button"
                                                disabled={busyId === antrian.id}
                                                onClick={() =>
                                                    changeStatus(
                                                        antrian,
                                                        'serving',
                                                        'Dilayani',
                                                    )
                                                }
                                                className="flex h-10 w-full items-center justify-center gap-1 rounded-lg bg-indigo-600 text-[12px] font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                                            >
                                                Mulai
                                            </button>
                                        )}

                                        {antrian.status === 'serving' && (
                                            <button
                                                type="button"
                                                disabled={busyId === antrian.id}
                                                onClick={() =>
                                                    changeStatus(
                                                        antrian,
                                                        'completed',
                                                        'Selesai',
                                                    )
                                                }
                                                className="flex h-10 w-full items-center justify-center gap-1 rounded-lg bg-green-600 text-[12px] font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
                                            >
                                                Selesai
                                            </button>
                                        )}

                                        <div className="flex items-center justify-between gap-2">
                                            <Link
                                                href={`/antrians/${antrian.id}`}
                                                className="text-[12px] font-semibold text-[#07577f] hover:underline"
                                            >
                                                Detail
                                            </Link>

                                            <div className="flex items-center gap-2">
                                                {(antrian.status ===
                                                    'waiting' ||
                                                    antrian.status ===
                                                        'called') && (
                                                    <button
                                                        type="button"
                                                        disabled={
                                                            busyId ===
                                                            antrian.id
                                                        }
                                                        onClick={() =>
                                                            changeStatus(
                                                                antrian,
                                                                'skipped',
                                                                'Dilewati',
                                                            )
                                                        }
                                                        className="flex h-8 items-center rounded-lg bg-gray-100 px-3 text-[11px] font-semibold text-gray-500 transition hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-60"
                                                    >
                                                        Lewati
                                                    </button>
                                                )}

                                                <button
                                                    type="button"
                                                    disabled={
                                                        busyId === antrian.id
                                                    }
                                                    onClick={() =>
                                                        handleDelete(antrian)
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
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </AppLayout>
        </>
    );
}
