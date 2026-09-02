import { Head, Link } from '@inertiajs/react';
import { useCallback, useEffect, useState } from 'react';
import { deleteDokter, getDokters, type Dokter } from '@/api/dokter';
import AppLayout from '@/Layouts/AppLayout';

const getInitials = (name: string): string =>
    name
        .replace(/^dr[a-z]*\.\s*/i, '')
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part.charAt(0).toUpperCase())
        .join('');

export default function DokterIndex() {
    const [dokters, setDokters] = useState<Dokter[]>([]);
    const [page, setPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');
    const [deletingId, setDeletingId] = useState<number | null>(null);

    const loadDokters = useCallback(async (targetPage = 1) => {
        try {
            setLoading(true);
            setError('');
            setPage(targetPage);

            const response = await getDokters(targetPage);

            setDokters(response.data?.items ?? []);
            setLastPage(response.data?.pagination?.last_page ?? 1);
            setTotal(response.data?.pagination?.total ?? 0);
        } catch (error: any) {
            console.error('Gagal memuat dokter', error);

            if (error.response?.status === 401) {
                window.location.href = '/login';
                return;
            }

            setError(
                error.response?.data?.message || 'Gagal mengambil data dokter.',
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void loadDokters();
    }, [loadDokters]);

    const handleDelete = async (dokter: Dokter) => {
        const confirmed = window.confirm(
            `Hapus dokter "${dokter.name}"? Tindakan ini tidak bisa dibatalkan.`,
        );

        if (!confirmed) {
            return;
        }

        try {
            setDeletingId(dokter.id);

            await deleteDokter(dokter.id);

            await loadDokters(page);
        } catch (error: any) {
            console.error('Gagal menghapus dokter', error);

            window.alert(
                error.response?.data?.message || 'Gagal menghapus dokter.',
            );
        } finally {
            setDeletingId(null);
        }
    };

    const filtered = dokters.filter((dokter) => {
        const keyword = search.toLowerCase().trim();

        if (!keyword) {
            return true;
        }

        return (
            dokter.name.toLowerCase().includes(keyword) ||
            dokter.code.toLowerCase().includes(keyword) ||
            (dokter.specialization ?? '').toLowerCase().includes(keyword) ||
            dokter.sip_number.toLowerCase().includes(keyword)
        );
    });

    return (
        <>
            <Head title="Dokter" />

            <AppLayout wide>
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h2 className="text-lg font-bold text-gray-800 sm:text-xl">
                            Dokter
                        </h2>

                        <p className="mt-1 text-xs text-gray-400 sm:text-sm">
                            Kelola data dokter
                        </p>
                    </div>

                    <Link
                        href="/dokters/create"
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
                        Tambah Dokter
                    </Link>
                </div>

                <div className="mt-4">
                    {/* SEARCH */}
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

                        <input
                            type="text"
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder="Cari nama, kode, spesialisasi, atau No. SIP..."
                            className="w-full bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400"
                        />
                    </div>

                    {error && (
                        <div className="mt-4 rounded-[10px] bg-red-50 px-3 py-2 text-[12px] text-red-500">
                            {error}
                        </div>
                    )}

                    {/* CARD GRID */}
                    {loading ? (
                        <div className="mt-4 rounded-xl bg-white p-10 text-center text-sm text-gray-400 shadow-sm">
                            Memuat data...
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="mt-4 rounded-xl bg-white p-10 text-center text-sm text-gray-400 shadow-sm">
                            Data dokter tidak ditemukan.
                        </div>
                    ) : (
                        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5">
                            {filtered.map((dokter) => (
                                <div
                                    key={dokter.id}
                                    className="group overflow-hidden rounded-xl bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                                >
                                    {/* IMAGE */}
                                    <Link
                                        href={`/dokters/${dokter.id}`}
                                        className="block h-[128px]"
                                    >
                                        {dokter.image_url ? (
                                            <img
                                                src={dokter.image_url}
                                                alt={dokter.name}
                                                className="h-full w-full object-cover"
                                                style={{
                                                    objectPosition:
                                                        'center 20%',
                                                }}
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center bg-[#07577f]/10">
                                                <span className="text-3xl font-bold text-[#07577f]">
                                                    {dokter.name
                                                        ? getInitials(
                                                              dokter.name,
                                                          )
                                                        : '?'}
                                                </span>
                                            </div>
                                        )}
                                    </Link>

                                    <div className="p-4">
                                        <div className="flex items-center justify-between gap-2">
                                            <h3 className="truncate text-[14px] font-bold text-gray-800">
                                                {dokter.name}
                                            </h3>

                                            <span
                                                className={`shrink-0 rounded-md px-2 py-0.5 text-[10px] font-bold ${
                                                    dokter.is_active
                                                        ? 'bg-green-50 text-green-600'
                                                        : 'bg-gray-100 text-gray-500'
                                                }`}
                                            >
                                                {dokter.is_active
                                                    ? 'Aktif'
                                                    : 'Nonaktif'}
                                            </span>
                                        </div>

                                        <p className="mt-1 text-[11px] font-semibold tracking-wide text-[#07577f]/70">
                                            {dokter.specialization || 'Dokter'}
                                        </p>

                                        <p className="mt-2 text-[11px] text-gray-400">
                                            SIP: {dokter.sip_number}
                                        </p>

                                        <div className="mt-4 flex items-center gap-2 border-t border-gray-50 pt-3">
                                            <Link
                                                href={`/dokters/${dokter.id}`}
                                                className="flex h-10 flex-1 items-center justify-center gap-1.5 rounded-lg bg-[#07577f]/10 text-[11px] font-semibold text-[#07577f] transition hover:bg-[#07577f]/20 sm:h-8"
                                            >
                                                Detail
                                            </Link>

                                            <Link
                                                href={`/dokters/${dokter.id}/edit`}
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
                                                    handleDelete(dokter)
                                                }
                                                disabled={
                                                    deletingId === dokter.id
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
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* PAGINATION */}
                    {!loading && total > 0 && (
                        <div className="mt-4 flex items-center justify-between rounded-xl bg-white px-5 py-3 shadow-sm">
                            <p className="text-xs text-gray-400">
                                Menampilkan {dokters.length} dari {total} data
                            </p>

                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    disabled={page <= 1}
                                    onClick={() => loadDokters(page - 1)}
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
                                    onClick={() => loadDokters(page + 1)}
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
