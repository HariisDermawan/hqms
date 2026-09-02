import { Head, Link, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { getTestimonial, type Testimonial } from '@/api/testimonial';
import AppLayout from '@/Layouts/AppLayout';

const getInitials = (name: string): string =>
    name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part.charAt(0).toUpperCase())
        .join('');

const RatingStars = ({ rating }: { rating: number }) => (
    <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((value) => (
            <svg
                key={value}
                xmlns="http://www.w3.org/2000/svg"
                className={`h-5 w-5 ${
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

export default function TestimonialShow() {
    const { id } = usePage<{ id: number }>().props;

    const [testimonial, setTestimonial] = useState<Testimonial | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        getTestimonial(id)
            .then((response) => {
                setTestimonial(response.data?.testimonial ?? null);
            })
            .catch((error: any) => {
                console.error('Gagal memuat testimoni', error);

                if (error.response?.status === 401) {
                    window.location.href = '/login';
                    return;
                }

                setError('Gagal mengambil data testimoni.');
            })
            .finally(() => {
                setLoading(false);
            });
    }, [id]);

    return (
        <>
            <Head title="Detail Testimoni" />

            <AppLayout wide>
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h2 className="text-lg font-bold text-gray-800 sm:text-xl">
                            Detail Testimoni
                        </h2>

                        <p className="mt-1 text-xs text-gray-400 sm:text-sm">
                            Informasi lengkap ulasan dari pasien
                        </p>
                    </div>

                    <Link
                        href={
                            testimonial
                                ? `/testimonials/${testimonial.id}/edit`
                                : '/testimonials'
                        }
                        className="flex h-[43px] items-center gap-2 rounded-[12px] bg-[#084e7a] px-4 text-[13px] font-bold text-white transition hover:bg-[#063f62] hover:shadow-md active:scale-[0.99]"
                    >
                        Edit Testimoni
                    </Link>
                </div>

                {loading ? (
                    <div className="mt-4 rounded-xl bg-white p-10 text-center text-sm text-gray-400 shadow-sm">
                        Memuat data testimoni...
                    </div>
                ) : error ? (
                    <div className="mt-4 rounded-[10px] bg-red-50 px-3 py-2 text-[12px] text-red-500">
                        {error}
                    </div>
                ) : (
                    testimonial && (
                        <div className="mt-4 rounded-xl bg-white p-5 shadow-sm sm:p-6">
                            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-[#07577f]/10">
                                    <span className="text-xl font-bold text-[#07577f]">
                                        {getInitials(testimonial.name) || '?'}
                                    </span>
                                </div>

                                <div>
                                    <div className="flex flex-wrap items-center gap-2">
                                        <h3 className="text-base font-bold text-gray-800">
                                            {testimonial.name}
                                        </h3>

                                        <span
                                            className={
                                                testimonial.is_active
                                                    ? 'rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-600'
                                                    : 'rounded-md bg-gray-100 px-2 py-0.5 text-[11px] font-bold text-gray-500'
                                            }
                                        >
                                            {testimonial.is_active
                                                ? 'Aktif'
                                                : 'Nonaktif'}
                                        </span>
                                    </div>

                                    <p className="mt-1 text-[13px] text-gray-500">
                                        {testimonial.role ?? '—'}
                                        {testimonial.pasien
                                            ?.medical_record_number
                                            ? ` · RM ${testimonial.pasien.medical_record_number}`
                                            : ''}
                                    </p>

                                    <div className="mt-2">
                                        <RatingStars
                                            rating={testimonial.rating}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div className="rounded-[10px] bg-[#f7f9fb] p-3">
                                    <p className="text-[11px] tracking-wider text-gray-400 uppercase">
                                        Urutan
                                    </p>

                                    <p className="mt-1 text-[13px] font-semibold text-gray-700">
                                        {testimonial.sort_order}
                                    </p>
                                </div>

                                <div className="rounded-[10px] bg-[#f7f9fb] p-3">
                                    <p className="text-[11px] tracking-wider text-gray-400 uppercase">
                                        Rating
                                    </p>

                                    <p className="mt-1 text-[13px] font-semibold text-gray-700">
                                        {testimonial.rating}/5
                                    </p>
                                </div>
                            </div>

                            <div className="mt-4 rounded-[10px] bg-[#f7f9fb] p-3">
                                <p className="text-[11px] tracking-wider text-gray-400 uppercase">
                                    Pesan Testimoni
                                </p>

                                <p className="mt-1 text-[13px] whitespace-pre-wrap text-gray-700">
                                    {testimonial.message}
                                </p>
                            </div>

                            <div className="mt-4">
                                <Link
                                    href="/testimonials"
                                    className="inline-flex h-[43px] items-center rounded-[12px] bg-[#d9d9d9] px-5 text-[13px] font-bold text-gray-600 transition hover:bg-[#c9c9c9]"
                                >
                                    Kembali
                                </Link>
                            </div>
                        </div>
                    )
                )}
            </AppLayout>
        </>
    );
}
