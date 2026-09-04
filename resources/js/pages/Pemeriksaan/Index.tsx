import { Head, Link } from '@inertiajs/react';
import { useCallback, useEffect, useState } from 'react';
import {
    deletePemeriksaan,
    getPemeriksaans,
    type Pemeriksaan,
} from '@/api/pemeriksaan';
import { getPolis, type Poli } from '@/api/poli';
import AppLayout from '@/Layouts/AppLayout';

const formatDate = (value: string | null): string => {
    if (!value) {
        return '—';
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return '—';
    }

    return date.toLocaleString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

export default function PemeriksaanIndex() {
    const [items, setItems] = useState<Pemeriksaan[]>([]);
    const [polis, setPolis] = useState<Poli[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');
    const [poliFilter, setPoliFilter] = useState('all');
    const [page, setPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [busyId, setBusyId] = useState<number | null>(null);

    const load = useCallback(async (): Promise<void> => {
        try {
            setLoading(true);

            const [response, polisResponse] = await Promise.all([
                getPemeriksaans(1, 100),
                getPolis(1, 100),
            ]);

            setItems(response.data?.items ?? []);
            setLastPage(response.data?.pagination?.last_page ?? 1);
            setTotal(response.data?.pagination?.total ?? 0);
            setPolis(polisResponse.data?.items ?? []);
            setError('');
        } catch (error: any) {
            console.error('Gagal memuat pemeriksaan', error);

            if (error.response?.status === 401) {
                window.location.href = '/login';
                return;
            }

            setError(
                error.response?.data?.message ||
                    'Gagal mengambil data pemeriksaan.',
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void load();
    }, [load]);

    const handleDelete = async (pemeriksaan: Pemeriksaan) => {
        const confirmed = window.confirm(
            `Hapus pemeriksaan ${pemeriksaan.pasien?.name ?? ''}? Tindakan ini tidak bisa dibatalkan.`,
        );

        if (!confirmed) {
            return;
        }

        try {
            setBusyId(pemeriksaan.id);

            await deletePemeriksaan(pemeriksaan.id);

            await load();
        } catch (error: any) {
            console.error('Gagal menghapus pemeriksaan', error);

            window.alert(
                error.response?.data?.message || 'Gagal menghapus pemeriksaan.',
            );
        } finally {
            setBusyId(null);
        }
    };

    const filtered = items
        .filter((pemeriksaan) => {
            if (
                poliFilter !== 'all' &&
                pemeriksaan.poli?.id !== Number(poliFilter)
            ) {
                return false;
            }

            const keyword = search.toLowerCase().trim();

            if (!keyword) {
                return true;
            }

            const patientName = pemeriksaan.pasien?.name.toLowerCase() ?? '';
            const queueNumber =
                pemeriksaan.antrian?.queue_number?.toLowerCase() ?? '';
            const category = (pemeriksaan.category ?? '').toLowerCase();
            const poliName = pemeriksaan.poli?.name.toLowerCase() ?? '';
            const dokterName = pemeriksaan.dokter?.name.toLowerCase() ?? '';

            return (
                patientName.includes(keyword) ||
                queueNumber.includes(keyword) ||
                category.includes(keyword) ||
                poliName.includes(keyword) ||
                dokterName.includes(keyword)
            );
        })
        .sort((a, b) => {
            const ta = a.examined_at ? new Date(a.examined_at).getTime() : 0;
            const tb = b.examined_at ? new Date(b.examined_at).getTime() : 0;

            return tb - ta;
        });

    return (
        <>
            <Head title="Pemeriksaan" />

            <AppLayout wide>
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h2 className="text-lg font-bold text-gray-800 sm:text-xl">
                            Pemeriksaan
                        </h2>

                        <p className="mt-1 text-xs text-gray-400 sm:text-sm">
                            Rekap hasil pemeriksaan pasien
                        </p>
                    </div>
                </div>

                <div className="mt-4">
                    {/* SEARCH + FILTERS */}
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
                                placeholder="Cari nama pasien, no. antrian, kategori, poli, atau dokter..."
                                className="w-full bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400"
                            />
                        </div>

                        <select
                            value={poliFilter}
                            onChange={(event) =>
                                setPoliFilter(event.target.value)
                            }
                            className="h-11 w-full rounded-full border border-gray-200 bg-white px-4 text-xs text-gray-600 shadow-sm outline-none sm:w-[190px]"
                        >
                            <option value="all">Semua Poli</option>
                            {polis.map((poli) => (
                                <option key={poli.id} value={poli.id}>
                                    {poli.name}
                                </option>
                            ))}
                        </select>
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
                            Tidak ada pemeriksaan yang cocok.
                        </div>
                    ) : (
                        <div className="mt-4 overflow-hidden rounded-xl bg-white shadow-sm">
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[960px] text-left">
                                    <thead>
                                        <tr className="border-b border-gray-100 text-[11px] tracking-wide text-gray-400 uppercase">
                                            <th className="px-5 py-3.5 font-semibold">
                                                Pasien
                                            </th>
                                            <th className="px-5 py-3.5 font-semibold">
                                                Kategori
                                            </th>
                                            <th className="px-5 py-3.5 font-semibold">
                                                Poli / Dokter
                                            </th>
                                            <th className="px-5 py-3.5 font-semibold">
                                                Resep
                                            </th>
                                            <th className="px-5 py-3.5 font-semibold">
                                                Diagnosis
                                            </th>
                                            <th className="px-5 py-3.5 font-semibold">
                                                Waktu
                                            </th>
                                            <th className="px-5 py-3.5 text-right font-semibold">
                                                Aksi
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {filtered.map((pemeriksaan) => (
                                            <tr
                                                key={pemeriksaan.id}
                                                className="border-b border-gray-50 last:border-0 hover:bg-[#f7f9fb]/60"
                                            >
                                                <td className="px-5 py-3.5">
                                                    <p className="text-[13px] font-semibold text-gray-800">
                                                        {pemeriksaan.pasien
                                                            ?.name ?? '-'}
                                                    </p>

                                                    <p className="text-[11px] text-gray-400">
                                                        No. Antrian{' '}
                                                        {pemeriksaan.antrian
                                                            ?.queue_number ??
                                                            '-'}
                                                    </p>
                                                </td>

                                                <td className="px-5 py-3.5">
                                                    <span className="inline-flex rounded-md bg-[#07577f]/10 px-2 py-1 text-[11px] font-bold text-[#07577f]">
                                                        {pemeriksaan.category ??
                                                            '-'}
                                                    </span>
                                                </td>

                                                <td className="px-5 py-3.5">
                                                    <p className="text-[12px] font-semibold text-gray-700">
                                                        {pemeriksaan.poli
                                                            ?.name ?? '-'}
                                                    </p>

                                                    <p className="text-[11px] text-gray-400">
                                                        {pemeriksaan.dokter
                                                            ?.name ?? '-'}
                                                    </p>
                                                </td>

                                                <td className="px-5 py-3.5">
                                                    {pemeriksaan.obats &&
                                                    pemeriksaan.obats.length >
                                                        0 ? (
                                                        <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-1 text-[11px] font-semibold text-green-600">
                                                            <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                                                            Sudah Resep
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1 rounded-full bg-orange-50 px-2.5 py-1 text-[11px] font-semibold text-orange-600">
                                                            <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
                                                            Belum Resep
                                                        </span>
                                                    )}
                                                </td>

                                                <td className="max-w-[260px] px-5 py-3.5">
                                                    <p className="truncate text-[12px] text-gray-600">
                                                        {pemeriksaan.diagnosis ||
                                                            '—'}
                                                    </p>
                                                </td>

                                                <td className="px-5 py-3.5 text-[12px] text-gray-500">
                                                    {formatDate(
                                                        pemeriksaan.examined_at,
                                                    )}
                                                </td>

                                                <td className="px-5 py-3.5">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Link
                                                            href={`/pemeriksaans/${pemeriksaan.id}`}
                                                            className="flex h-10 items-center gap-1.5 rounded-lg bg-[#07577f]/10 px-3 text-[11px] font-semibold text-[#07577f] transition hover:bg-[#07577f]/20 sm:h-8"
                                                        >
                                                            Detail
                                                        </Link>

                                                        <Link
                                                            href={`/pemeriksaans/${pemeriksaan.id}/edit`}
                                                            className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-500 transition hover:bg-blue-100 sm:h-8 sm:w-8"
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
                                                            disabled={
                                                                busyId ===
                                                                pemeriksaan.id
                                                            }
                                                            onClick={() =>
                                                                handleDelete(
                                                                    pemeriksaan,
                                                                )
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
                                    onClick={() => setPage(page - 1)}
                                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:bg-[#f7f9fb] disabled:cursor-not-allowed disabled:opacity-50 sm:h-9 sm:w-9"
                                >
                                    ‹
                                </button>

                                <span className="min-w-[70px] text-center text-xs font-medium text-gray-500">
                                    Hal {page} / {lastPage}
                                </span>

                                <button
                                    type="button"
                                    disabled={page >= lastPage}
                                    onClick={() => setPage(page + 1)}
                                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:bg-[#f7f9fb] disabled:cursor-not-allowed disabled:opacity-50 sm:h-9 sm:w-9"
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
