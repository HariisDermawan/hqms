import { getKioskTestimonials } from '@/api/kiosk';
import { useEffect, useState } from 'react';

interface TestimonialCard {
    id: number;
    name: string;
    role: string | null;
    message: string;
    rating: number;
}

export default function TestimonialSection() {
    const [testimonials, setTestimonials] = useState<TestimonialCard[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        let active = true;

        const load = async () => {
            try {
                const response = await getKioskTestimonials();

                if (!active) {
                    return;
                }

                setTestimonials(
                    (response.data?.items ?? []).map((testimonial) => ({
                        id: testimonial.id,
                        name: testimonial.name,
                        role: testimonial.role ?? null,
                        message: testimonial.message,
                        rating: testimonial.rating,
                    })),
                );
            } catch {
                if (active) {
                    setTestimonials([]);
                }
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        };

        void load();

        return () => {
            active = false;
        };
    }, []);

    if (loading) {
        return (
            <section className="bg-white py-16 sm:py-20">
                <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 md:px-10 lg:px-14">
                    <div className="mb-8 text-center sm:mb-10">
                        <div className="mx-auto h-3 w-16 animate-pulse rounded bg-slate-200" />
                        <div className="mx-auto mt-3 h-7 w-64 animate-pulse rounded bg-slate-200" />
                    </div>
                    <div className="mx-auto h-[240px] max-w-3xl animate-pulse rounded-3xl bg-slate-200/70" />
                </div>
            </section>
        );
    }

    if (testimonials.length === 0) {
        return null;
    }

    const total = testimonials.length;
    const safeIndex = Math.min(activeIndex, total - 1);
    const current = testimonials[safeIndex];

    const prev = () => setActiveIndex((safeIndex - 1 + total) % total);

    const next = () => setActiveIndex((safeIndex + 1) % total);

    const getInitials = (name: string) =>
        name
            .split(' ')
            .filter(Boolean)
            .slice(0, 2)
            .map((part) => part[0]?.toUpperCase() ?? '')
            .join('');

    const renderStars = (rating: number) =>
        Array.from({ length: 5 }).map((_, index) => {
            const filled = index < rating;

            return (
                <svg
                    key={index}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    className={`h-5 w-5 ${
                        filled
                            ? 'fill-amber-400 text-amber-400'
                            : 'fill-slate-200 text-slate-200'
                    }`}
                >
                    <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
            );
        });

    return (
        <section className="bg-white py-16 sm:py-20">
            <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 md:px-10 lg:px-14">
                <div className="mb-8 text-center sm:mb-10">
                    <span className="text-xs font-bold tracking-widest text-[#0284c7] uppercase">
                        Testimoni
                    </span>

                    <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-[#075985] sm:text-3xl">
                        Apa Kata Mereka
                    </h2>

                    <p className="mt-1 text-sm text-slate-500 sm:text-base">
                        Cerita dan pengalaman pasien kami
                    </p>
                </div>

                <div className="relative mx-auto max-w-3xl">
                    <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
                        <div className="flex flex-col items-center text-center sm:flex-row sm:items-center sm:text-left">
                            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#e0f2fe] text-xl font-bold text-[#0284c7]">
                                {getInitials(current.name)}
                            </div>

                            <div className="mt-4 sm:mt-0 sm:ml-5 sm:flex-1">
                                <div className="font-semibold text-slate-800">
                                    {current.name}
                                </div>

                                {current.role && (
                                    <div className="mt-0.5 text-sm text-slate-500">
                                        {current.role}
                                    </div>
                                )}
                            </div>

                            <div className="mt-4 flex sm:mt-0 [&>svg]:mx-0.5">
                                {renderStars(current.rating)}
                            </div>
                        </div>

                        <blockquote className="mt-6 border-t border-slate-100 pt-6 text-base leading-relaxed text-slate-600 italic sm:text-lg">
                            &ldquo;{current.message}&rdquo;
                        </blockquote>
                    </div>

                    <div className="mt-6 flex items-center justify-center gap-3">
                        <button
                            type="button"
                            onClick={prev}
                            className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:bg-[#075985] hover:text-white"
                            aria-label="Testimoni sebelumnya"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <path d="M15 18l-6-6 6-6" />
                            </svg>
                        </button>

                        <div className="flex items-center gap-2">
                            {testimonials.map((testimonial, index) => (
                                <button
                                    key={testimonial.id}
                                    type="button"
                                    onClick={() => setActiveIndex(index)}
                                    className={`h-2.5 rounded-full transition-all ${
                                        index === safeIndex
                                            ? 'w-6 bg-[#0284c7]'
                                            : 'w-2.5 bg-slate-300 hover:bg-slate-400'
                                    }`}
                                    aria-label={`Tampilkan testimoni ${index + 1}`}
                                />
                            ))}
                        </div>

                        <button
                            type="button"
                            onClick={next}
                            className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:bg-[#075985] hover:text-white"
                            aria-label="Testimoni berikutnya"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <path d="M9 6l6 6-6 6" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
