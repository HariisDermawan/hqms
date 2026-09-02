import { Head, Link } from '@inertiajs/react';
import { useCallback, useEffect, useState } from 'react';
import {
    deleteMessage,
    getMessages,
    type Message,
    type MessageStatus,
} from '@/api/message';
import AppLayout from '@/Layouts/AppLayout';
import { STATUS_OPTIONS, statusBadgeClass, statusLabel } from './status';

const formatDate = (value: string | null): string => {
    if (!value) {
        return '—';
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return '—';
    }

    return date.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });
};

export default function MessageIndex() {
    const [items, setItems] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | MessageStatus>(
        'all',
    );
    const [page, setPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [busyId, setBusyId] = useState<number | null>(null);

    const load = useCallback(async (): Promise<void> => {
        try {
            setLoading(true);

            const response = await getMessages(1, 100);

            setItems(response.data?.items ?? []);
            setLastPage(response.data?.pagination?.last_page ?? 1);
            setTotal(response.data?.pagination?.total ?? 0);
            setError('');
        } catch (error: any) {
            console.error('Gagal memuat pesan', error);

            if (error.response?.status === 401) {
                window.location.href = '/login';
                return;
            }

            setError(
                error.response?.data?.message || 'Gagal mengambil data pesan.',
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void load();
    }, [load]);

    const handleDelete = async (message: Message) => {
        const confirmed = window.confirm(
            `Hapus pesan dari ${message.name}? Tindakan ini tidak bisa dibatalkan.`,
        );

        if (!confirmed) {
            return;
        }

        try {
            setBusyId(message.id);

            await deleteMessage(message.id);

            await load();
        } catch (error: any) {
            console.error('Gagal menghapus pesan', error);

            window.alert(
                error.response?.data?.message || 'Gagal menghapus pesan.',
            );
        } finally {
            setBusyId(null);
        }
    };

    const filtered = items
        .filter((message) => {
            if (statusFilter !== 'all' && message.status !== statusFilter) {
                return false;
            }

            const keyword = search.toLowerCase().trim();

            if (!keyword) {
                return true;
            }

            return (
                message.name.toLowerCase().includes(keyword) ||
                message.email.toLowerCase().includes(keyword) ||
                (message.subject ?? '').toLowerCase().includes(keyword)
            );
        })
        .sort((a, b) => b.id - a.id);

    return (
        <>
            <Head title="Pesan Masuk" />

            <AppLayout wide>
                <div className="flex items-end justify-between">
                    <div>
                        <h2 className="text-lg font-bold text-gray-800 sm:text-xl">
                            Pesan Masuk
                        </h2>

                        <p className="mt-1 text-xs text-gray-400 sm:text-sm">
                            Pesan yang dikirim melalui formulir kontak
                        </p>
                    </div>

                    <Link
                        href="/messages/create"
                        className="flex h-[43px] items-center gap-2 rounded-[12px] bg-[#084e7a] px-5 text-[13px] font-bold text-white transition hover:bg-[#063f62] hover:shadow-md"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-[16px] w-[16px]"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <path d="M12 5v14M5 12h14" />
                        </svg>

                        <span>Buat Pesan</span>
                    </Link>
                </div>

                <div className="mt-4">
                    {/* SEARCH + FILTER */}
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
                                placeholder="Cari nama, email, atau subjek..."
                                className="w-full bg-transparent text-xs text-gray-700 outline-none placeholder:text-gray-400"
                            />
                        </div>

                        <select
                            value={statusFilter}
                            onChange={(event) =>
                                setStatusFilter(
                                    event.target.value as 'all' | MessageStatus,
                                )
                            }
                            className="h-11 w-full rounded-full border border-gray-200 bg-white px-4 text-xs text-gray-600 shadow-sm outline-none sm:w-[190px]"
                        >
                            <option value="all">Semua Status</option>
                            {STATUS_OPTIONS.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
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
                            Tidak ada pesan yang cocok.
                        </div>
                    ) : (
                        <div className="mt-4 overflow-hidden rounded-xl bg-white shadow-sm">
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[860px] text-left">
                                    <thead>
                                        <tr className="border-b border-gray-100 text-[11px] tracking-wide text-gray-400 uppercase">
                                            <th className="px-5 py-3.5 font-semibold">
                                                Pengirim
                                            </th>
                                            <th className="px-5 py-3.5 font-semibold">
                                                Subjek
                                            </th>
                                            <th className="px-5 py-3.5 font-semibold">
                                                Pesan
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
                                        {filtered.map((message) => (
                                            <tr
                                                key={message.id}
                                                className="border-b border-gray-50 last:border-0 hover:bg-[#f7f9fb]/60"
                                            >
                                                <td className="px-5 py-3.5">
                                                    <p className="text-[13px] font-semibold text-gray-800">
                                                        {message.name}
                                                    </p>

                                                    <p className="text-[11px] text-gray-400">
                                                        {message.email}
                                                    </p>
                                                </td>

                                                <td className="max-w-[200px] px-5 py-3.5">
                                                    <p className="truncate text-[12px] font-semibold text-gray-700">
                                                        {message.subject || '—'}
                                                    </p>
                                                </td>

                                                <td className="max-w-[260px] px-5 py-3.5">
                                                    <p className="truncate text-[12px] text-gray-600">
                                                        {message.message}
                                                    </p>
                                                </td>

                                                <td className="px-5 py-3.5 text-[12px] text-gray-500">
                                                    {formatDate(
                                                        message.replied_at,
                                                    )}
                                                </td>

                                                <td className="px-5 py-3.5">
                                                    <span
                                                        className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${statusBadgeClass(message.status)}`}
                                                    >
                                                        {statusLabel(
                                                            message.status,
                                                        )}
                                                    </span>
                                                </td>

                                                <td className="px-5 py-3.5">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Link
                                                            href={`/messages/${message.id}`}
                                                            className="flex h-8 items-center gap-1.5 rounded-lg bg-[#07577f]/10 px-3 text-[11px] font-semibold text-[#07577f] transition hover:bg-[#07577f]/20"
                                                        >
                                                            Detail
                                                        </Link>

                                                        <Link
                                                            href={`/messages/${message.id}/edit`}
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
                                                            disabled={
                                                                busyId ===
                                                                message.id
                                                            }
                                                            onClick={() =>
                                                                handleDelete(
                                                                    message,
                                                                )
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
                                    onClick={() => setPage(page - 1)}
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
                                    onClick={() => setPage(page + 1)}
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
