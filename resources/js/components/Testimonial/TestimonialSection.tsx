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
        <section className="relative overflow-hidden bg-gradient-to-b from-sky-50 to-white py-16 sm:py-20">
            <div className="pointer-events-none absolute -top-20 -left-24 h-72 w-72 rounded-full bg-sky-200/50 blur-3xl" />
            <div className="pointer-events-none absolute -right-24 -bottom-24 h-80 w-80 rounded-full bg-cyan-200/40 blur-3xl" />

            <div className="relative mx-auto w-full max-w-7xl px-5 sm:px-8 md:px-10 lg:px-14">
                <div className="mb-8 text-center sm:mb-12">
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
                    <div className="grid overflow-hidden rounded-[2rem] bg-white shadow-xl ring-1 shadow-sky-100 ring-slate-100 md:grid-cols-[240px_1fr]">
                        <div className="relative flex flex-col items-center justify-center gap-4 bg-gradient-to-br from-[#0c4a6e] via-[#0284c7] to-[#22d3ee] px-8 py-10 text-white">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="absolute top-4 right-5 h-12 w-12 text-white/15"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                            >
                                <path d="M9.983 3v7.391c0 5.704-3.731 9.57-8.983 10.609l-.995-2.151c2.432-.917 3.995-3.638 3.995-5.849h-4v-10h9.983zm14.017 0v7.391c0 5.704-3.748 9.571-9 10.609l-.996-2.151c2.433-.917 3.996-3.638 3.996-5.849h-3.983v-10h9.983z" />
                            </svg>

                            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white/15 text-3xl font-bold ring-2 ring-white/40 backdrop-blur">
                                {getInitials(current.name)}
                            </div>

                            <div className="text-center">
                                <div className="text-lg font-semibold">
                                    {current.name}
                                </div>

                                {current.role && (
                                    <div className="mt-0.5 text-sm text-sky-100">
                                        {current.role}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-col justify-center gap-4 px-8 py-10 sm:px-12">
                            <div className="flex [&>svg]:mx-0.5">
                                {renderStars(current.rating)}
                            </div>

                            <blockquote className="text-base leading-relaxed text-slate-600 italic sm:text-lg">
                                &ldquo;{current.message}&rdquo;
                            </blockquote>
                        </div>
                    </div>

                    <div className="mt-6 flex items-center justify-center gap-3">
                        <button
                            type="button"
                            onClick={prev}
                            className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:bg-[#075985] hover:text-white"
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
                            className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:bg-[#075985] hover:text-white"
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
