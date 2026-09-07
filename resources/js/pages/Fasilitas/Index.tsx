import { Head, Link } from '@inertiajs/react';
import { useCallback, useEffect, useState } from 'react';
import {
    deleteFasilitas,
    getFasilitases,
    type Fasilitas,
} from '@/api/fasilitas';
import AppLayout from '@/Layouts/AppLayout';

export default function FasilitasIndex() {
    const [items, setItems] = useState<Fasilitas[]>([]);
    const [page, setPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');
    const [deletingId, setDeletingId] = useState<number | null>(null);

    const loadItems = useCallback(async (targetPage = 1) => {
        try {
            setLoading(true);
            setError('');
            setPage(targetPage);

            const response = await getFasilitases(targetPage);

            setItems(response.data?.items ?? []);
            setLastPage(response.data?.pagination?.last_page ?? 1);
            setTotal(response.data?.pagination?.total ?? 0);
        } catch (err: any) {
            console.error('Gagal memuat fasilitas', err);

            if (err.response?.status === 401) {
                window.location.href = '/login';
                return;
            }

            setError(
                err.response?.data?.message ||
                    'Gagal mengambil data fasilitas.',
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void loadItems();
    }, [loadItems]);

    const handleDelete = async (item: Fasilitas) => {
        const confirmed = window.confirm(
            `Hapus fasilitas "${item.name}"? Semua ruangan di dalamnya akan kehilangan link fasilitas.`,
        );

        if (!confirmed) {
            return;
        }

        try {
            setDeletingId(item.id);
            await deleteFasilitas(item.id);
            await loadItems(page);
        } catch (err: any) {
            console.error('Gagal menghapus fasilitas', err);
            window.alert(
                err.response?.data?.message || 'Gagal menghapus fasilitas.',
            );
        } finally {
            setDeletingId(null);
        }
    };

    const filtered = items.filter((item) => {
        const keyword = search.toLowerCase().trim();

        if (!keyword) {
            return true;
        }

        return (
            item.name.toLowerCase().includes(keyword) ||
            item.slug.toLowerCase().includes(keyword) ||
            (item.description ?? '').toLowerCase().includes(keyword)
        );
    });

    return (
        <>
            <Head title="Fasilitas" />

            <AppLayout wide>
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h2 className="text-lg font-bold text-gray-800 sm:text-xl">
                            Fasilitas
                        </h2>

                        <p className="mt-1 text-xs text-gray-400 sm:text-sm">
                            Kelola fasilitas rumah sakit (UGD, Rawat Jalan,
                            Rawat Inap, ICU, OK, Penunjang, Umum)
                        </p>
                    </div>

                    <Link
                        href="/fasilitas/create"
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
                        Tambah Fasilitas
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
                            placeholder="Cari nama atau deskripsi fasilitas..."
                            className="w-full bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400"
                        />
                    </div>

                    {error && (
                        <div className="mt-4 rounded-[10px] bg-red-50 px-3 py-2 text-[12px] text-red-500">
                            {error}
                        </div>
                    )}

                    {/* CONTENT */}
                    {loading ? (
                        <div className="mt-4 rounded-xl bg-white p-10 text-center text-sm text-gray-400 shadow-sm">
                            Memuat data fasilitas...
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="mt-4 rounded-xl bg-white p-10 text-center text-sm text-gray-400 shadow-sm">
                            Data fasilitas tidak ditemukan.
                        </div>
                    ) : (
                        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {filtered.map((item) => (
                                <div
                                    key={item.id}
                                    className="group overflow-hidden rounded-xl bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                                >
                                    <div className="flex h-[100px] items-center justify-center bg-[#07577f]/5 px-4">
                                        {item.image_url ? (
                                            <img
                                                src={item.image_url}
                                                alt={item.name}
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <div className="flex items-center justify-center gap-3">
                                                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#07577f]/10">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className="h-7 w-7 text-[#07577f]/60"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="1.5"
                                                    >
                                                        <path d="M3 21h18" />
                                                        <path d="M5 21V7l8-4v18" />
                                                        <path d="M19 21V11l-6-4" />
                                                        <path d="M9 9h.01M9 13h.01M9 17h.01" />
                                                    </svg>
                                                </div>

                                                <div className="min-w-0 text-center">
                                                    <p className="text-[14px] font-bold text-[#07577f]">
                                                        {item.name}
                                                    </p>

                                                    <p className="truncate text-[10px] font-semibold tracking-wide text-[#07577f]/60 uppercase">
                                                        {item.slug}
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="p-4">
                                        <div className="flex items-center justify-between gap-2">
                                            <h4 className="truncate text-[14px] font-bold text-gray-800">
                                                {item.name}
                                            </h4>

                                            <span
                                                className={`shrink-0 rounded-md px-2 py-0.5 text-[10px] font-bold ${
                                                    item.is_active
                                                        ? 'bg-green-50 text-green-600'
                                                        : 'bg-gray-100 text-gray-500'
                                                }`}
                                            >
                                                {item.is_active
                                                    ? 'Aktif'
                                                    : 'Nonaktif'}
                                            </span>
                                        </div>

                                        <p className="mt-2 line-clamp-2 min-h-[32px] text-[12px] leading-relaxed text-gray-500">
                                            {item.description || '-'}
                                        </p>

                                        {item.ruangans_count !== undefined && (
                                            <p className="mt-2 text-[11px] text-gray-400">
                                                {item.ruangans_count} ruangan
                                            </p>
                                        )}

                                        <div className="mt-4 flex items-center gap-2 border-t border-gray-50 pt-3">
                                            <Link
                                                href={`/fasilitas/${item.slug}`}
                                                className="flex h-10 flex-1 items-center justify-center gap-1.5 rounded-lg bg-[#07577f]/10 text-[11px] font-semibold text-[#07577f] transition hover:bg-[#07577f]/20 sm:h-8"
                                            >
                                                Detail
                                            </Link>

                                            <Link
                                                href={`/fasilitas/${item.id}/edit`}
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
                                                    handleDelete(item)
                                                }
                                                disabled={
                                                    deletingId === item.id
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
                                Menampilkan {items.length} dari {total} data
                            </p>

                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    disabled={page <= 1}
                                    onClick={() => loadItems(page - 1)}
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
                                    onClick={() => loadItems(page + 1)}
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
