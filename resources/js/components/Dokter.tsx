import { Link } from '@inertiajs/react';
import { getKioskDokters } from '@/api/kiosk';
import { useEffect, useState } from 'react';

interface DokterCard {
    id: number;
    name: string;
    image_url: string | null;
}

const getInitials = (name: string): string =>
    name
        .replace(/^dr[a-z]*\.\s*/i, '')
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part.charAt(0).toUpperCase())
        .join('');

export default function Dokter() {
    const [dokters, setDokters] = useState<DokterCard[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let active = true;

        const load = async () => {
            try {
                const response = await getKioskDokters();
                if (!active) {
                    return;
                }

                setDokters(
                    (response.data?.items ?? []).map((dokter) => ({
                        id: dokter.id,
                        name: dokter.name,
                        image_url: dokter.image_url ?? null,
                    })),
                );
            } catch {
                if (active) {
                    setDokters([]);
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

    return (
        <section className="bg-white py-16 sm:py-20">
            <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 md:px-10 lg:px-14">
                <div className="flex items-end justify-between gap-4 sm:mb-10">
                    <div>
                        <h2 className="text-2xl font-extrabold tracking-tight text-[#075985] sm:text-3xl">
                            Dokter
                        </h2>
                        <p className="mt-1 text-sm text-slate-500 sm:text-base">
                            Tim dokter siap melayani Anda
                        </p>
                    </div>

                    <Link
                        href="/dokters"
                        className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-[#075985] transition hover:text-[#0284c7]"
                    >
                        All
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <path d="M5 12h14M13 6l6 6-6 6" />
                        </svg>
                    </Link>
                </div>

                {loading ? (
                    <div className="flex gap-4 overflow-hidden">
                        {Array.from({ length: 4 }).map((_, index) => (
                            <div
                                key={index}
                                className="h-[380px] w-[75%] shrink-0 animate-pulse rounded-3xl bg-slate-100 sm:w-[45%] md:w-[30%] lg:w-[24%]"
                            />
                        ))}
                    </div>
                ) : dokters.length === 0 ? (
                    <p className="py-12 text-center text-sm text-slate-500">
                        Belum ada dokter yang tersedia.
                    </p>
                ) : (
                    <div className="-mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-5 pb-2 [scrollbar-width:none] sm:-mx-8 sm:px-8 md:-mx-10 md:px-10 lg:-mx-14 lg:px-14 [&::-webkit-scrollbar]:hidden">
                        {dokters.map((dokter) => (
                            <Link
                                key={dokter.id}
                                href="/dokters"
                                className="group w-[75%] shrink-0 snap-start rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-sm transition hover:-translate-y-1 hover:border-[#0284c7] hover:shadow-xl hover:shadow-sky-100 sm:w-[45%] md:w-[30%] lg:w-[24%]"
                            >
                                <div className="mx-auto flex aspect-[3/4] w-full max-w-[220px] items-center justify-center overflow-hidden rounded-2xl bg-[#075985]/10">
                                    {dokter.image_url ? (
                                        <img
                                            src={dokter.image_url}
                                            alt={dokter.name}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <span className="text-2xl font-bold text-[#075985]">
                                            {getInitials(dokter.name) || '?'}
                                        </span>
                                    )}
                                </div>

                                <p className="mt-4 line-clamp-2 text-sm leading-tight font-bold text-slate-800 group-hover:text-[#075985] sm:text-base">
                                    {dokter.name}
                                </p>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
