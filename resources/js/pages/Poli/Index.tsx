import { Head, Link } from '@inertiajs/react';
import { useCallback, useEffect, useState } from 'react';
import { deletePoli, getPolis, type Poli } from '@/api/poli';
import AppLayout from '@/Layouts/AppLayout';

export default function PoliIndex() {
    const [polis, setPolis] = useState<Poli[]>([]);
    const [page, setPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');
    const [deletingId, setDeletingId] = useState<number | null>(null);

    const loadPolis = useCallback(async (targetPage = 1) => {
        try {
            setLoading(true);
            setError('');
            setPage(targetPage);

            const response = await getPolis(targetPage);

            setPolis(response.data?.items ?? []);
            setLastPage(response.data?.pagination?.last_page ?? 1);
            setTotal(response.data?.pagination?.total ?? 0);
        } catch (error: any) {
            console.error('Gagal memuat poli', error);

            if (error.response?.status === 401) {
                window.location.href = '/login';
                return;
            }

            setError(
                error.response?.data?.message || 'Gagal mengambil data poli.',
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void loadPolis();
    }, [loadPolis]);

    const handleDelete = async (poli: Poli) => {
        const confirmed = window.confirm(
            `Hapus poli "${poli.name}"? Tindakan ini tidak bisa dibatalkan.`,
        );

        if (!confirmed) {
            return;
        }

        try {
            setDeletingId(poli.id);

            await deletePoli(poli.id);

            await loadPolis(page);
        } catch (error: any) {
            console.error('Gagal menghapus poli', error);

            window.alert(
                error.response?.data?.message || 'Gagal menghapus poli.',
            );
        } finally {
            setDeletingId(null);
        }
    };

    const filtered = polis.filter((poli) => {
        const keyword = search.toLowerCase().trim();

        if (!keyword) {
            return true;
        }

        return (
            poli.name.toLowerCase().includes(keyword) ||
            poli.code.toLowerCase().includes(keyword) ||
            (poli.description ?? '').toLowerCase().includes(keyword)
        );
    });

    return (
        <>
            <Head title="Poli" />

            <AppLayout wide>
                <div className="flex items-end justify-between">
                    <div>
                        <h2 className="text-lg font-bold text-gray-800 sm:text-xl">
                            Poli
                        </h2>

                        <p className="mt-1 text-xs text-gray-400 sm:text-sm">
                            Kelola data poli
                        </p>
                    </div>

                    <Link
                        href="/polis/create"
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
                        Tambah Poli
                    </Link>
                </div>

                <div className="mt-4">
                    {/* SEARCH */}
                    <div className="flex h-11 items-center rounded-full border border-gray-200 bg-white px-4 shadow-sm">
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
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder="Cari nama, kode, atau deskripsi poli..."
                            className="w-full bg-transparent text-xs text-gray-700 outline-none placeholder:text-gray-400"
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
                            Data poli tidak ditemukan.
                        </div>
                    ) : (
                        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {filtered.map((poli) => (
                                <div
                                    key={poli.id}
                                    className="group overflow-hidden rounded-xl bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                                >
                                    {/* IMAGE */}
                                    <Link
                                        href={`/polis/${poli.id}`}
                                        className="block h-[140px]"
                                    >
                                        {(poli.dokters?.length ?? 0) > 0 ? (
                                            <div className="relative flex h-full w-full bg-[#07577f]">
                                                {poli.dokters
                                                    ?.slice(0, 2)
                                                    .map((dokter, index) =>
                                                        dokter.image_url ? (
                                                            <img
                                                                key={dokter.id}
                                                                src={
                                                                    dokter.image_url
                                                                }
                                                                alt={
                                                                    dokter.name
                                                                }
                                                                className={
                                                                    'h-full object-cover ' +
                                                                    ((poli
                                                                        .dokters
                                                                        ?.length ??
                                                                        0) > 1
                                                                        ? 'w-1/2'
                                                                        : 'w-full')
                                                                }
                                                                style={{
                                                                    objectPosition: `center ${index === 0 ? '20%' : '35%'}`,
                                                                }}
                                                            />
                                                        ) : (
                                                            <div
                                                                key={dokter.id}
                                                                className={
                                                                    (poli
                                                                        .dokters
                                                                        ?.length ??
                                                                        0) > 1
                                                                        ? 'flex w-1/2 items-center justify-center text-lg font-bold text-white'
                                                                        : 'flex h-full w-full items-center justify-center text-3xl font-bold text-white'
                                                                }
                                                            >
                                                                {dokter.name
                                                                    ?.charAt(0)
                                                                    ?.toUpperCase()}
                                                            </div>
                                                        ),
                                                    )}

                                                {(poli.dokters?.length ?? 0) >
                                                    2 && (
                                                    <span className="absolute right-2 bottom-2 flex h-6 w-6 items-center justify-center rounded-full bg-green-500 text-[11px] font-bold text-white">
                                                        +
                                                        {poli.dokters!.length -
                                                            2}
                                                    </span>
                                                )}
                                            </div>
                                        ) : poli.image_url ? (
                                            <img
                                                src={poli.image_url}
                                                alt={poli.name}
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center bg-[#07577f]/10">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-12 w-12 text-[#07577f]/40"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="1.2"
                                                >
                                                    <rect
                                                        x="5"
                                                        y="3"
                                                        width="14"
                                                        height="18"
                                                        rx="2"
                                                    />
                                                    <path d="M9 7h6M9 11h6M9 15h4" />
                                                </svg>
                                            </div>
                                        )}
                                    </Link>

                                    <div className="p-4">
                                        <div className="flex items-center justify-between gap-2">
                                            <h3 className="truncate text-[14px] font-bold text-gray-800">
                                                {poli.name}
                                            </h3>

                                            {poli.queue_prefix && (
                                                <span className="ml-2 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[#07577f]/10 text-[11px] font-bold text-[#07577f]">
                                                    {poli.queue_prefix}
                                                </span>
                                            )}

                                            <span
                                                className={`shrink-0 rounded-md px-2 py-0.5 text-[10px] font-bold ${
                                                    poli.is_active
                                                        ? 'bg-green-50 text-green-600'
                                                        : 'bg-gray-100 text-gray-500'
                                                }`}
                                            >
                                                {poli.is_active
                                                    ? 'Aktif'
                                                    : 'Nonaktif'}
                                            </span>
                                        </div>

                                        <p className="mt-1 text-[11px] font-semibold tracking-wide text-[#07577f]/70">
                                            {poli.code}
                                        </p>

                                        <p className="mt-2 line-clamp-2 min-h-[32px] text-[12px] leading-relaxed text-gray-500">
                                            {poli.description || '-'}
                                        </p>

                                        <div className="mt-4 flex items-center gap-2 border-t border-gray-50 pt-3">
                                            <Link
                                                href={`/polis/${poli.id}`}
                                                className="flex h-8 flex-1 items-center justify-center gap-1.5 rounded-lg bg-[#07577f]/10 text-[11px] font-semibold text-[#07577f] transition hover:bg-[#07577f]/20"
                                            >
                                                Detail
                                            </Link>

                                            <Link
                                                href={`/polis/${poli.id}/edit`}
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
                                                    handleDelete(poli)
                                                }
                                                disabled={
                                                    deletingId === poli.id
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
                            ))}
                        </div>
                    )}

                    {/* PAGINATION */}
                    {!loading && total > 0 && (
                        <div className="mt-4 flex items-center justify-between rounded-xl bg-white px-5 py-3 shadow-sm">
                            <p className="text-xs text-gray-400">
                                Menampilkan {polis.length} dari {total} data
                            </p>

                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    disabled={page <= 1}
                                    onClick={() => loadPolis(page - 1)}
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
                                    onClick={() => loadPolis(page + 1)}
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
