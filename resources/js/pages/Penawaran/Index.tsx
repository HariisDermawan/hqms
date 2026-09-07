import { Head, Link } from '@inertiajs/react';
import { useCallback, useEffect, useState } from 'react';
import {
    deletePenawaran,
    getPenawarans,
    type Penawaran,
} from '@/api/penawaran';
import AppLayout from '@/Layouts/AppLayout';

export default function PenawaranIndex() {
    const [penawarans, setPenawarans] = useState<Penawaran[]>([]);
    const [page, setPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');
    const [deletingId, setDeletingId] = useState<number | null>(null);

    const loadPenawarans = useCallback(async (targetPage = 1) => {
        try {
            setLoading(true);
            setError('');
            setPage(targetPage);

            const response = await getPenawarans(targetPage);

            setPenawarans(response.data?.items ?? []);
            setLastPage(response.data?.pagination?.last_page ?? 1);
            setTotal(response.data?.pagination?.total ?? 0);
        } catch (error: any) {
            console.error('Gagal memuat penawaran', error);

            if (error.response?.status === 401) {
                window.location.href = '/login';
                return;
            }

            setError(
                error.response?.data?.message ||
                    'Gagal mengambil data penawaran.',
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void loadPenawarans();
    }, [loadPenawarans]);

    const handleDelete = async (penawaran: Penawaran) => {
        const confirmed = window.confirm(
            `Hapus penawaran "${penawaran.title}"? Tindakan ini tidak bisa dibatalkan.`,
        );

        if (!confirmed) {
            return;
        }

        try {
            setDeletingId(penawaran.id);

            await deletePenawaran(penawaran.id);

            await loadPenawarans(page);
        } catch (error: any) {
            console.error('Gagal menghapus penawaran', error);

            window.alert(
                error.response?.data?.message || 'Gagal menghapus penawaran.',
            );
        } finally {
            setDeletingId(null);
        }
    };

    const filtered = penawarans.filter((penawaran) => {
        const keyword = search.toLowerCase().trim();

        if (!keyword) {
            return true;
        }

        return (
            penawaran.title.toLowerCase().includes(keyword) ||
            penawaran.slug.toLowerCase().includes(keyword) ||
            (penawaran.description ?? '').toLowerCase().includes(keyword)
        );
    });

    return (
        <>
            <Head title="Penawaran" />

            <AppLayout wide>
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h2 className="text-lg font-bold text-gray-800 sm:text-xl">
                            Penawaran
                        </h2>

                        <p className="mt-1 text-xs text-gray-400 sm:text-sm">
                            Kelola data penawaran
                        </p>
                    </div>

                    <Link
                        href="/penawarans/create"
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
                        Tambah Penawaran
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
                            placeholder="Cari judul, slug, atau deskripsi penawaran..."
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
                            Data penawaran tidak ditemukan.
                        </div>
                    ) : (
                        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {filtered.map((penawaran) => (
                                <div
                                    key={penawaran.id}
                                    className="group overflow-hidden rounded-xl bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                                >
                                    {/* BANNER */}
                                    <Link
                                        href={`/penawarans/${penawaran.id}`}
                                        className="relative block h-[110px] bg-gradient-to-br from-[#07577f] to-[#0a8fd4]"
                                    >
                                        {penawaran.image_url ? (
                                            <img
                                                src={penawaran.image_url}
                                                alt={penawaran.title}
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-9 w-9 text-white/60"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="1.5"
                                                >
                                                    <path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 7.65l.78.77L12 20.68l7.64-7.65.78-.77a5.4 5.4 0 0 0 0-7.68Z" />
                                                </svg>
                                            </div>
                                        )}

                                        <span className="absolute right-3 bottom-3 rounded-md bg-black/40 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur">
                                            {penawaran.slug}
                                        </span>
                                    </Link>

                                    <div className="p-4">
                                        <h3 className="line-clamp-2 min-h-[36px] text-[14px] font-bold text-gray-800">
                                            {penawaran.title}
                                        </h3>

                                        <p className="mt-2 line-clamp-2 min-h-[32px] text-[12px] leading-relaxed text-gray-500">
                                            {penawaran.description || '-'}
                                        </p>

                                        <div className="mt-4 flex items-center gap-2 border-t border-gray-50 pt-3">
                                            <Link
                                                href={`/penawarans/${penawaran.id}`}
                                                className="flex h-10 flex-1 items-center justify-center gap-1.5 rounded-lg bg-[#07577f]/10 text-[11px] font-semibold text-[#07577f] transition hover:bg-[#07577f]/20 sm:h-8"
                                            >
                                                Detail
                                            </Link>

                                            <Link
                                                href={`/penawarans/${penawaran.id}/edit`}
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
                                                    handleDelete(penawaran)
                                                }
                                                disabled={
                                                    deletingId === penawaran.id
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
                                Menampilkan {penawarans.length} dari {total}{' '}
                                data
                            </p>

                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    disabled={page <= 1}
                                    onClick={() => loadPenawarans(page - 1)}
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
                                    onClick={() => loadPenawarans(page + 1)}
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
