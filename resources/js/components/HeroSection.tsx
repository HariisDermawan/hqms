import { Link } from '@inertiajs/react';
import { getKioskPolis, type KioskPoli } from '@/api/kiosk';
import { useEffect, useState } from 'react';
import React from 'react';

const POLI_ICON_MAP: { keywords: string[]; src: string }[] = [
    { keywords: ['gigi', 'mulut'], src: '/icons/Gigi.svg' },
    { keywords: ['mata'], src: '/icons/iconDok2.svg' },
    { keywords: ['jantung'], src: '/icons/iconDok3.svg' },
    { keywords: ['umum'], src: '/icons/iconDok1.svg' },
    { keywords: ['anak'], src: '/icons/iconDok1.svg' },
];

function poliIcon(poli: KioskPoli): string {
    const name = poli.name.toLowerCase();
    const match = POLI_ICON_MAP.find((entry) =>
        entry.keywords.some((keyword) => name.includes(keyword)),
    );

    return match?.src ?? poli.image_url ?? '/icons/iconDok1.svg';
}

function FloatingPoliCard() {
    const [polis, setPolis] = useState<KioskPoli[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAll, setShowAll] = useState(false);

    useEffect(() => {
        let active = true;

        const load = async () => {
            try {
                const response = await getKioskPolis();
                if (active) {
                    setPolis(response.data?.items ?? []);
                }
            } catch {
                if (active) {
                    setPolis([]);
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

    const visiblePolis = polis.slice(0, 5);
    return (
        <div className="pointer-events-auto relative z-30 mx-auto mt-6 w-[92%] max-w-7xl sm:mt-8 sm:w-[88%] md:-mt-24">
            <div className="overflow-hidden rounded-3xl border border-white/60 bg-white/95 shadow-2xl shadow-sky-950/30 backdrop-blur-xl">
                {loading ? (
                    <div className="grid grid-cols-2 gap-3 p-4 sm:grid-cols-3 sm:p-6 md:grid-cols-6">
                        {Array.from({ length: 6 }).map((_, index) => (
                            <div
                                key={index}
                                className="h-16 animate-pulse rounded-2xl bg-slate-200"
                            />
                        ))}
                    </div>
                ) : polis.length === 0 ? (
                    <p className="py-8 text-center text-sm text-slate-500">
                        Belum ada poli yang tersedia.
                    </p>
                ) : (
                    <div className="grid grid-cols-2 gap-3 overflow-x-auto p-4 sm:grid-cols-3 sm:p-6 md:grid-cols-6">
                        {visiblePolis.map((poli) => (
                            <Link
                                key={poli.id}
                                href="/ticket"
                                className="group flex flex-col items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white p-4 text-center transition hover:-translate-y-0.5 hover:border-[#0284c7] hover:shadow-lg hover:shadow-sky-200/60"
                            >
                                <img
                                    src={poliIcon(poli)}
                                    alt={poli.name}
                                    className="h-10 w-10 shrink-0 object-contain transition group-hover:scale-110 sm:h-11 sm:w-11"
                                />
                                <span className="line-clamp-2 text-xs leading-tight font-semibold text-slate-700 group-hover:text-[#075985] sm:text-sm">
                                    {poli.name}
                                </span>
                            </Link>
                        ))}

                        <button
                            type="button"
                            onClick={() => setShowAll((value) => !value)}
                            className="group flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-[#0284c7]/40 bg-[#f0f9ff] p-4 text-center transition hover:-translate-y-0.5 hover:border-[#0284c7] hover:bg-[#e0f2fe] hover:shadow-lg hover:shadow-sky-200/60"
                        >
                            <img
                                src="/icons/dashboard.svg"
                                alt="Show"
                                className="h-10 w-10 shrink-0 object-contain transition group-hover:scale-110 sm:h-11 sm:w-11"
                            />
                            <span className="text-xs font-semibold text-[#075985] sm:text-sm">
                                {showAll ? 'Show Less' : 'Show'}
                            </span>
                        </button>

                        {showAll &&
                            polis.slice(5).map((poli) => (
                                <Link
                                    key={poli.id}
                                    href="/ticket"
                                    className="group flex flex-col items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white p-4 text-center transition hover:-translate-y-0.5 hover:border-[#0284c7] hover:shadow-lg hover:shadow-sky-200/60"
                                >
                                    <img
                                        src={poliIcon(poli)}
                                        alt={poli.name}
                                        className="h-10 w-10 shrink-0 object-contain transition group-hover:scale-110 sm:h-11 sm:w-11"
                                    />
                                    <span className="line-clamp-2 text-xs leading-tight font-semibold text-slate-700 group-hover:text-[#075985] sm:text-sm">
                                        {poli.name}
                                    </span>
                                </Link>
                            ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default function HeroSection() {
    return (
        <>
            <section className="relative min-h-screen w-full overflow-hidden bg-[#075985]">
                <div
                    className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
                    style={{ backgroundImage: "url('/banner/bn1.png')" }}
                />
                <div className="absolute inset-0 z-[1] bg-gradient-to-r from-[#075985]/95 via-[#075985]/85 to-[#0284c7]/55" />
                <div className="absolute inset-0 z-[1] bg-[radial-gradient(circle_at_75%_50%,rgba(56,189,248,0.25),transparent_40%)]" />
                <div className="pointer-events-none absolute right-0 bottom-[-80px] z-[2] h-[78%] w-[82%] sm:bottom-[-60px] sm:h-[78%] sm:w-[76%] md:bottom-[-20px] md:h-[74%] md:w-[54%] lg:bottom-[-10px] lg:h-[86%] lg:w-[52%] xl:bottom-0 xl:h-[90%] xl:w-[50%]">
                    <img
                        src="/banner/hero.png"
                        alt="Doctor"
                        className="absolute right-[-35px] bottom-0 h-full w-auto max-w-none object-contain object-bottom sm:right-[-25px] md:right-[-15px] lg:right-[-10px] xl:right-0"
                    />
                </div>

                <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl -translate-y-32 items-center px-5 pt-[105px] pb-24 sm:-translate-y-24 sm:px-8 sm:pt-[115px] sm:pb-20 md:translate-y-0 md:px-10 md:pt-[100px] md:pb-16 lg:px-14 lg:pt-[100px]">
                    <div className="relative z-20 w-full max-w-[620px] lg:max-w-[680px] xl:max-w-[720px]">
                        <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/95 px-5 py-2.5 shadow-lg backdrop-blur-sm sm:mb-7 sm:px-6 sm:py-3">
                            <img
                                src="/icons/wc.svg"
                                alt=""
                                className="h-6 w-6 shrink-0 object-contain sm:h-5 sm:w-5"
                            />
                            <span className="text-[11px] font-semibold text-[#075985] sm:text-xs md:text-sm">
                                Welcome to the hospital services.
                            </span>
                        </div>
                        <h1 className="text-[40px] leading-[0.98] font-extrabold tracking-tight text-white drop-shadow-sm sm:text-[48px] md:text-[60px] lg:text-[70px] xl:text-[76px]">
                            A Great Place to
                            <br />
                            Receive Care
                        </h1>
                        <p className="mt-2 max-w-[580px] text-sm leading-6 text-white/90 sm:mt-7 sm:text-base sm:leading-7 md:text-lg">
                            Overcome any hurdle or any other problem with
                            professional medical services.
                        </p>
                    </div>
                </div>
            </section>

            <FloatingPoliCard />
        </>
    );
}
