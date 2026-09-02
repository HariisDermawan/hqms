import { Head, Link } from '@inertiajs/react';
import { useCallback, useEffect, useState } from 'react';
import {
    deleteJadwalDokter,
    getJadwalDokters,
    type JadwalDokter,
} from '@/api/jadwalDokter';
import AppLayout from '@/Layouts/AppLayout';

const DAYS: Record<string, string> = {
    sunday: 'Minggu',
    monday: 'Senin',
    tuesday: 'Selasa',
    wednesday: 'Rabu',
    thursday: 'Kamis',
    friday: 'Jumat',
    saturday: 'Sabtu',
};

const DAY_ORDER: Record<string, number> = {
    monday: 0,
    tuesday: 1,
    wednesday: 2,
    thursday: 3,
    friday: 4,
    saturday: 5,
    sunday: 6,
};

const formatDay = (day: string): string => DAYS[day] ?? day;
const formatTime = (time: string): string => time.slice(0, 5);

const getInitials = (name: string): string =>
    name
        .replace(/^dr[a-z]*\.\s*/i, '')
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part.charAt(0).toUpperCase())
        .join('');

export default function JadwalDokterIndex() {
    const [jadwals, setJadwals] = useState<JadwalDokter[]>([]);
    const [page, setPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');
    const [dayFilter, setDayFilter] = useState('');
    const [deletingId, setDeletingId] = useState<number | null>(null);

    const loadJadwals = useCallback(async (targetPage = 1) => {
        try {
            setLoading(true);
            setError('');
            setPage(targetPage);

            const response = await getJadwalDokters({ perPage: 100 });

            setJadwals(response.data?.items ?? []);
            setLastPage(response.data?.pagination?.last_page ?? 1);
            setTotal(response.data?.pagination?.total ?? 0);
        } catch (error: any) {
            console.error('Gagal memuat jadwal dokter', error);

            if (error.response?.status === 401) {
                window.location.href = '/login';
                return;
            }

            setError(
                error.response?.data?.message ||
                    'Gagal mengambil data jadwal dokter.',
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void loadJadwals();
    }, [loadJadwals]);

    const handleDelete = async (jadwal: JadwalDokter) => {
        const label = jadwal.dokter
            ? `${jadwal.dokter.name} (${formatDay(jadwal.day)})`
            : `Jadwal #${jadwal.id}`;
        const confirmed = window.confirm(
            `Hapus jadwal "${label}"? Tindakan ini tidak bisa dibatalkan.`,
        );

        if (!confirmed) {
            return;
        }

        try {
            setDeletingId(jadwal.id);

            await deleteJadwalDokter(jadwal.id);

            await loadJadwals(page);
        } catch (error: any) {
            console.error('Gagal menghapus jadwal', error);

            window.alert(
                error.response?.data?.message || 'Gagal menghapus jadwal.',
            );
        } finally {
            setDeletingId(null);
        }
    };

    const filtered = jadwals
        .filter((jadwal) => {
            const keyword = search.toLowerCase().trim();

            if (keyword) {
                const doctorName = jadwal.dokter?.name.toLowerCase() ?? '';
                const poliName = jadwal.poli?.name.toLowerCase() ?? '';
                const doctorSpec =
                    jadwal.dokter?.specialization?.toLowerCase() ?? '';

                if (
                    !doctorName.includes(keyword) &&
                    !poliName.includes(keyword) &&
                    !doctorSpec.includes(keyword)
                ) {
                    return false;
                }
            }

            if (dayFilter && jadwal.day !== dayFilter) {
                return false;
            }

            return true;
        })
        .sort(
            (a, b) =>
                (DAY_ORDER[a.day] ?? 99) - (DAY_ORDER[b.day] ?? 99) ||
                a.start_time.localeCompare(b.start_time),
        );

    return (
        <>
            <Head title="Jadwal Dokter" />

            <AppLayout wide>
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h2 className="text-lg font-bold text-gray-800 sm:text-xl">
                            Jadwal Dokter
                        </h2>

                        <p className="mt-1 text-xs text-gray-400 sm:text-sm">
                            Kelola jadwal praktik dokter per poli
                        </p>
                    </div>

                    <Link
                        href="/jadwal-dokters/create"
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
                        Tambah Jadwal
                    </Link>
                </div>

                <div className="mt-4">
                    {/* SEARCH + DAY FILTER */}
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
                                placeholder="Cari nama dokter, spesialisasi, atau poli..."
                                className="w-full bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400"
                            />
                        </div>

                        <select
                            value={dayFilter}
                            onChange={(event) =>
                                setDayFilter(event.target.value)
                            }
                            className="h-11 w-full rounded-full border border-gray-200 bg-white px-4 text-xs text-gray-600 shadow-sm outline-none sm:w-[180px]"
                        >
                            <option value="">Semua Hari</option>
                            <option value="monday">Senin</option>
                            <option value="tuesday">Selasa</option>
                            <option value="wednesday">Rabu</option>
                            <option value="thursday">Kamis</option>
                            <option value="friday">Jumat</option>
                            <option value="saturday">Sabtu</option>
                            <option value="sunday">Minggu</option>
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
                            Tidak ada jadwal yang cocok.
                        </div>
                    ) : (
                        <div className="mt-4 overflow-hidden rounded-xl bg-white shadow-sm">
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[760px] text-left">
                                    <thead>
                                        <tr className="border-b border-gray-100 text-[11px] tracking-wide text-gray-400 uppercase">
                                            <th className="px-5 py-3.5 font-semibold">
                                                Dokter
                                            </th>
                                            <th className="px-5 py-3.5 font-semibold">
                                                Poli
                                            </th>
                                            <th className="px-5 py-3.5 font-semibold">
                                                Hari
                                            </th>
                                            <th className="px-5 py-3.5 font-semibold">
                                                Jam
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
                                        {filtered.map((jadwal) => (
                                            <tr
                                                key={jadwal.id}
                                                className="border-b border-gray-50 last:border-0 hover:bg-[#f7f9fb]/60"
                                            >
                                                <td className="px-5 py-3.5">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-9 w-9 shrink-0 overflow-hidden rounded-lg bg-[#07577f]/10">
                                                            {jadwal.dokter
                                                                ?.image_url ? (
                                                                <img
                                                                    src={
                                                                        jadwal
                                                                            .dokter
                                                                            .image_url
                                                                    }
                                                                    alt={
                                                                        jadwal
                                                                            .dokter
                                                                            .name
                                                                    }
                                                                    className="h-full w-full object-cover"
                                                                    style={{
                                                                        objectPosition:
                                                                            'center 20%',
                                                                    }}
                                                                />
                                                            ) : (
                                                                <span className="flex h-full w-full items-center justify-center text-[11px] font-bold text-[#07577f]">
                                                                    {jadwal.dokter
                                                                        ? getInitials(
                                                                              jadwal
                                                                                  .dokter
                                                                                  .name,
                                                                          )
                                                                        : '?'}
                                                                </span>
                                                            )}
                                                        </div>

                                                        <div>
                                                            <p className="text-[13px] font-semibold text-gray-800">
                                                                {jadwal.dokter
                                                                    ?.name ||
                                                                    '-'}
                                                            </p>

                                                            <p className="text-[11px] text-gray-400">
                                                                {jadwal.dokter
                                                                    ?.specialization ||
                                                                    'Dokter'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>

                                                <td className="px-5 py-3.5">
                                                    <span className="rounded-md bg-[#07577f]/10 px-2 py-1 text-[11px] font-semibold text-[#07577f]">
                                                        {jadwal.poli?.name ||
                                                            '-'}
                                                    </span>
                                                </td>

                                                <td className="px-5 py-3.5 text-[13px] font-medium text-gray-700">
                                                    {formatDay(jadwal.day)}
                                                </td>

                                                <td className="px-5 py-3.5 text-[13px] text-gray-600">
                                                    {formatTime(
                                                        jadwal.start_time,
                                                    )}{' '}
                                                    -{' '}
                                                    {formatTime(
                                                        jadwal.end_time,
                                                    )}
                                                </td>

                                                <td className="px-5 py-3.5">
                                                    <span
                                                        className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${
                                                            jadwal.is_active
                                                                ? 'bg-green-50 text-green-600'
                                                                : 'bg-gray-100 text-gray-500'
                                                        }`}
                                                    >
                                                        {jadwal.is_active
                                                            ? 'Aktif'
                                                            : 'Nonaktif'}
                                                    </span>
                                                </td>

                                                <td className="px-5 py-3.5">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Link
                                                            href={`/jadwal-dokters/${jadwal.id}`}
                                                            className="flex h-10 items-center gap-1.5 rounded-lg bg-[#07577f]/10 px-3 text-[11px] font-semibold text-[#07577f] transition hover:bg-[#07577f]/20 sm:h-8"
                                                        >
                                                            Detail
                                                        </Link>

                                                        <Link
                                                            href={`/jadwal-dokters/${jadwal.id}/edit`}
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
                                                            onClick={() =>
                                                                handleDelete(
                                                                    jadwal,
                                                                )
                                                            }
                                                            disabled={
                                                                deletingId ===
                                                                jadwal.id
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
                                    onClick={() => loadJadwals(page - 1)}
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
                                    onClick={() => loadJadwals(page + 1)}
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
