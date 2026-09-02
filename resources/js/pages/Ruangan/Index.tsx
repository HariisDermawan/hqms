import { Head, Link } from '@inertiajs/react';
import { useCallback, useEffect, useState } from 'react';
import { deleteRuangan, getRuangans, type Ruangan } from '@/api/ruangan';
import AppLayout from '@/Layouts/AppLayout';

export default function RuanganIndex() {
    const [ruangans, setRuangans] = useState<Ruangan[]>([]);
    const [page, setPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');
    const [deletingId, setDeletingId] = useState<number | null>(null);

    const loadRuangans = useCallback(async (targetPage = 1) => {
        try {
            setLoading(true);
            setError('');
            setPage(targetPage);

            const response = await getRuangans(targetPage);

            setRuangans(response.data?.items ?? []);
            setLastPage(response.data?.pagination?.last_page ?? 1);
            setTotal(response.data?.pagination?.total ?? 0);
        } catch (error: any) {
            console.error('Gagal memuat ruangan', error);

            if (error.response?.status === 401) {
                window.location.href = '/login';
                return;
            }

            setError(
                error.response?.data?.message ||
                    'Gagal mengambil data ruangan.',
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void loadRuangans();
    }, [loadRuangans]);

    const handleDelete = async (ruangan: Ruangan) => {
        const confirmed = window.confirm(
            `Hapus ruangan "${ruangan.name}"? Tindakan ini tidak bisa dibatalkan.`,
        );

        if (!confirmed) {
            return;
        }

        try {
            setDeletingId(ruangan.id);

            await deleteRuangan(ruangan.id);

            await loadRuangans(page);
        } catch (error: any) {
            console.error('Gagal menghapus ruangan', error);

            window.alert(
                error.response?.data?.message || 'Gagal menghapus ruangan.',
            );
        } finally {
            setDeletingId(null);
        }
    };

    const filtered = ruangans.filter((ruangan) => {
        const keyword = search.toLowerCase().trim();

        if (!keyword) {
            return true;
        }

        return (
            ruangan.name.toLowerCase().includes(keyword) ||
            ruangan.code.toLowerCase().includes(keyword) ||
            ruangan.category.toLowerCase().includes(keyword) ||
            (ruangan.description ?? '').toLowerCase().includes(keyword)
        );
    });

    const groupByCategory = (
        items: Ruangan[],
    ): Array<{
        category: string;
        items: Ruangan[];
    }> => {
        const map = new Map<string, Ruangan[]>();

        items.forEach((item) => {
            const list = map.get(item.category) ?? [];

            list.push(item);

            map.set(item.category, list);
        });

        return Array.from(map.entries())
            .sort((a, b) => a[0].localeCompare(b[0]))
            .map(([category, list]) => ({ category, items: list }));
    };

    const groups = groupByCategory(filtered);

    return (
        <>
            <Head title="Ruangan" />

            <AppLayout wide>
                <div className="flex items-end justify-between">
                    <div>
                        <h2 className="text-lg font-bold text-gray-800 sm:text-xl">
                            Ruangan
                        </h2>

                        <p className="mt-1 text-xs text-gray-400 sm:text-sm">
                            Kelola data ruangan
                        </p>
                    </div>

                    <Link
                        href="/ruangans/create"
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
                        Tambah Ruangan
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
                            placeholder="Cari nama, kode, atau kategori ruangan..."
                            className="w-full bg-transparent text-xs text-gray-700 outline-none placeholder:text-gray-400"
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
                            Memuat data ruangan...
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="mt-4 rounded-xl bg-white p-10 text-center text-sm text-gray-400 shadow-sm">
                            Data ruangan tidak ditemukan.
                        </div>
                    ) : (
                        groups.map((group) => (
                            <section key={group.category} className="mt-6">
                                <h3 className="flex items-center gap-2 text-[13px] font-bold text-gray-700">
                                    <span className="h-2 w-2 rounded-full bg-[#07577f]" />
                                    {group.category}
                                    <span className="text-[11px] font-medium text-gray-400">
                                        ({group.items.length})
                                    </span>
                                </h3>

                                <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                    {group.items.map((ruangan) => (
                                        <div
                                            key={ruangan.id}
                                            className="group overflow-hidden rounded-xl bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                                        >
                                            <div className="flex h-[110px] items-center justify-center gap-3 bg-[#07577f]/5 px-4">
                                                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#07577f]/10">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className="h-7 w-7 text-[#07577f]/60"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="1.5"
                                                    >
                                                        <path d="M4 21V4a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v17" />
                                                        <path d="M8 7h2M14 7h2M8 11h2M14 11h2M8 15h2M14 15h2" />
                                                        <path d="M10 21v-3h4v3" />
                                                    </svg>
                                                </div>

                                                <div className="min-w-0 text-center">
                                                    <p className="text-[18px] font-bold text-[#07577f]">
                                                        {ruangan.code}
                                                    </p>

                                                    <p className="truncate text-[10px] font-semibold tracking-wide text-[#07577f]/60 uppercase">
                                                        {ruangan.category}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="p-4">
                                                <div className="flex items-center justify-between gap-2">
                                                    <h4 className="truncate text-[14px] font-bold text-gray-800">
                                                        {ruangan.name}
                                                    </h4>

                                                    <span
                                                        className={`shrink-0 rounded-md px-2 py-0.5 text-[10px] font-bold ${
                                                            ruangan.is_active
                                                                ? 'bg-green-50 text-green-600'
                                                                : 'bg-gray-100 text-gray-500'
                                                        }`}
                                                    >
                                                        {ruangan.is_active
                                                            ? 'Aktif'
                                                            : 'Nonaktif'}
                                                    </span>
                                                </div>

                                                <p className="mt-2 line-clamp-2 min-h-[32px] text-[12px] leading-relaxed text-gray-500">
                                                    {ruangan.description || '-'}
                                                </p>

                                                <div className="mt-4 flex items-center gap-2 border-t border-gray-50 pt-3">
                                                    <Link
                                                        href={`/ruangans/${ruangan.id}`}
                                                        className="flex h-8 flex-1 items-center justify-center gap-1.5 rounded-lg bg-[#07577f]/10 text-[11px] font-semibold text-[#07577f] transition hover:bg-[#07577f]/20"
                                                    >
                                                        Detail
                                                    </Link>

                                                    <Link
                                                        href={`/ruangans/${ruangan.id}/edit`}
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
                                                                ruangan,
                                                            )
                                                        }
                                                        disabled={
                                                            deletingId ===
                                                            ruangan.id
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
                            </section>
                        ))
                    )}

                    {/* PAGINATION */}
                    {!loading && total > 0 && (
                        <div className="mt-4 flex items-center justify-between rounded-xl bg-white px-5 py-3 shadow-sm">
                            <p className="text-xs text-gray-400">
                                Menampilkan {ruangans.length} dari {total} data
                            </p>

                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    disabled={page <= 1}
                                    onClick={() => loadRuangans(page - 1)}
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
                                    onClick={() => loadRuangans(page + 1)}
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
