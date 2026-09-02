import { Head, Link } from '@inertiajs/react';
import { useCallback, useEffect, useState } from 'react';
import {
    deleteTestimonial,
    getTestimonials,
    type Testimonial,
} from '@/api/testimonial';
import AppLayout from '@/Layouts/AppLayout';

const RatingStars = ({ rating }: { rating: number }) => (
    <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((value) => (
            <svg
                key={value}
                xmlns="http://www.w3.org/2000/svg"
                className={`h-3.5 w-3.5 ${
                    value <= rating ? 'text-amber-400' : 'text-gray-200'
                }`}
                viewBox="0 0 24 24"
                fill="currentColor"
            >
                <path d="M12 2.6l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 17.6l-5.8 3-1.1-6.5L.4 9.4l6.5-.9L12 2.6z" />
            </svg>
        ))}
    </div>
);

export default function TestimonialIndex() {
    const [items, setItems] = useState<Testimonial[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [busyId, setBusyId] = useState<number | null>(null);

    const load = useCallback(async (): Promise<void> => {
        try {
            setLoading(true);

            const response = await getTestimonials(1, 100);

            setItems(response.data?.items ?? []);
            setLastPage(response.data?.pagination?.last_page ?? 1);
            setTotal(response.data?.pagination?.total ?? 0);
            setError('');
        } catch (error: any) {
            console.error('Gagal memuat testimoni', error);

            if (error.response?.status === 401) {
                window.location.href = '/login';
                return;
            }

            setError(
                error.response?.data?.message ||
                    'Gagal mengambil data testimoni.',
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void load();
    }, [load]);

    const handleDelete = async (testimonial: Testimonial) => {
        const confirmed = window.confirm(
            `Hapus testimoni dari ${testimonial.name}? Tindakan ini tidak bisa dibatalkan.`,
        );

        if (!confirmed) {
            return;
        }

        try {
            setBusyId(testimonial.id);

            await deleteTestimonial(testimonial.id);

            await load();
        } catch (error: any) {
            console.error('Gagal menghapus testimoni', error);

            window.alert(
                error.response?.data?.message || 'Gagal menghapus testimoni.',
            );
        } finally {
            setBusyId(null);
        }
    };

    const filtered = items
        .filter((testimonial) => {
            const keyword = search.toLowerCase().trim();

            if (!keyword) {
                return true;
            }

            return (
                testimonial.name.toLowerCase().includes(keyword) ||
                (testimonial.role ?? '').toLowerCase().includes(keyword) ||
                testimonial.message.toLowerCase().includes(keyword)
            );
        })
        .sort((a, b) => a.sort_order - b.sort_order);

    return (
        <>
            <Head title="Testimoni" />

            <AppLayout wide>
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h2 className="text-lg font-bold text-gray-800 sm:text-xl">
                            Testimoni
                        </h2>

                        <p className="mt-1 text-xs text-gray-400 sm:text-sm">
                            Ulasan dan pesan dari pasien
                        </p>
                    </div>

                    <Link
                        href="/testimonials/create"
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

                        <span>Buat Testimoni</span>
                    </Link>
                </div>

                <div className="mt-4">
                    {/* SEARCH */}
                    <div className="flex h-12 items-center rounded-full border border-gray-200 bg-white px-4 shadow-sm sm:max-w-sm">
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
                            placeholder="Cari nama, peran, atau pesan..."
                            className="w-full bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400"
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
                            Tidak ada testimoni yang cocok.
                        </div>
                    ) : (
                        <div className="mt-4 overflow-hidden rounded-xl bg-white shadow-sm">
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[880px] text-left">
                                    <thead>
                                        <tr className="border-b border-gray-100 text-[11px] tracking-wide text-gray-400 uppercase">
                                            <th className="px-5 py-3.5 font-semibold">
                                                Pemberi
                                            </th>
                                            <th className="px-5 py-3.5 font-semibold">
                                                Pesan
                                            </th>
                                            <th className="px-5 py-3.5 font-semibold">
                                                Rating
                                            </th>
                                            <th className="px-5 py-3.5 font-semibold">
                                                Urutan
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
                                        {filtered.map((testimonial) => (
                                            <tr
                                                key={testimonial.id}
                                                className="border-b border-gray-50 last:border-0 hover:bg-[#f7f9fb]/60"
                                            >
                                                <td className="px-5 py-3.5">
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#07577f]/10">
                                                            <span className="text-[12px] font-bold text-[#07577f]">
                                                                {testimonial.name
                                                                    .split(' ')
                                                                    .filter(
                                                                        Boolean,
                                                                    )
                                                                    .slice(0, 2)
                                                                    .map(
                                                                        (
                                                                            part,
                                                                        ) =>
                                                                            part
                                                                                .charAt(
                                                                                    0,
                                                                                )
                                                                                .toUpperCase(),
                                                                    )
                                                                    .join('')}
                                                            </span>
                                                        </div>

                                                        <div>
                                                            <p className="text-[13px] font-semibold text-gray-800">
                                                                {
                                                                    testimonial.name
                                                                }
                                                            </p>

                                                            <p className="text-[11px] text-gray-400">
                                                                {testimonial.role ||
                                                                    '—'}
                                                                {testimonial
                                                                    .pasien
                                                                    ?.medical_record_number
                                                                    ? ` · RM ${testimonial.pasien.medical_record_number}`
                                                                    : ''}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>

                                                <td className="max-w-[300px] px-5 py-3.5">
                                                    <p className="truncate text-[12px] text-gray-600">
                                                        {testimonial.message}
                                                    </p>
                                                </td>

                                                <td className="px-5 py-3.5">
                                                    <RatingStars
                                                        rating={
                                                            testimonial.rating
                                                        }
                                                    />
                                                </td>

                                                <td className="px-5 py-3.5 text-[12px] text-gray-500">
                                                    {testimonial.sort_order}
                                                </td>

                                                <td className="px-5 py-3.5">
                                                    <span
                                                        className={
                                                            testimonial.is_active
                                                                ? 'inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-600'
                                                                : 'inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-semibold text-gray-500'
                                                        }
                                                    >
                                                        <span
                                                            className={
                                                                testimonial.is_active
                                                                    ? 'h-1.5 w-1.5 rounded-full bg-emerald-500'
                                                                    : 'h-1.5 w-1.5 rounded-full bg-gray-400'
                                                            }
                                                        />

                                                        {testimonial.is_active
                                                            ? 'Aktif'
                                                            : 'Nonaktif'}
                                                    </span>
                                                </td>

                                                <td className="px-5 py-3.5">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Link
                                                            href={`/testimonials/${testimonial.id}`}
                                                            className="flex h-10 items-center gap-1.5 rounded-lg bg-[#07577f]/10 px-3 text-[11px] font-semibold text-[#07577f] transition hover:bg-[#07577f]/20 sm:h-8"
                                                        >
                                                            Detail
                                                        </Link>

                                                        <Link
                                                            href={`/testimonials/${testimonial.id}/edit`}
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
                                                                testimonial.id
                                                            }
                                                            onClick={() =>
                                                                handleDelete(
                                                                    testimonial,
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
