import { getKioskPenawarans } from '@/api/kiosk';
import { useEffect, useRef, useState } from 'react';

interface PenawaranCard {
    id: number;
    title: string;
    slug: string;
    description: string | null;
    image_url: string | null;
}

const DRAG_THRESHOLD = 6;

const chevron = (direction: 'left' | 'right') => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        {direction === 'left' ? (
            <path d="M15 18l-6-6 6-6" />
        ) : (
            <path d="M9 6l6 6-6 6" />
        )}
    </svg>
);

export default function Penawaran() {
    const [penawarans, setPenawarans] = useState<PenawaranCard[]>([]);
    const [loading, setLoading] = useState(true);
    const [activePage, setActivePage] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const scrollerRef = useRef<HTMLDivElement>(null);
    const drag = useRef({
        down: false,
        moved: false,
        startX: 0,
        startLeft: 0,
    });

    useEffect(() => {
        let active = true;

        const load = async () => {
            try {
                const response = await getKioskPenawarans();
                if (!active) {
                    return;
                }

                setPenawarans(
                    (response.data?.items ?? []).map((penawaran) => ({
                        id: penawaran.id,
                        title: penawaran.title,
                        slug: penawaran.slug,
                        description: penawaran.description ?? null,
                        image_url: penawaran.image_url ?? null,
                    })),
                );
            } catch {
                if (active) {
                    setPenawarans([]);
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

    const scroller = scrollerRef.current;
    const pages =
        scroller && scroller.scrollWidth > 0
            ? Math.max(
                  1,
                  Math.round(scroller.scrollWidth / scroller.clientWidth),
              )
            : 1;
    const safePage = Math.min(activePage, pages - 1);

    const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
        if (event.pointerType !== 'mouse' || event.button !== 0) {
            return;
        }

        const element = scrollerRef.current;

        if (!element) {
            return;
        }

        drag.current = {
            down: true,
            moved: false,
            startX: event.clientX,
            startLeft: element.scrollLeft,
        };
    };

    const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
        if (!drag.current.down) {
            return;
        }

        const element = scrollerRef.current;

        if (!element) {
            return;
        }

        if (!drag.current.moved) {
            const delta = event.clientX - drag.current.startX;

            if (Math.abs(delta) > DRAG_THRESHOLD) {
                drag.current.moved = true;
            }
        }

        if (drag.current.moved) {
            element.scrollLeft =
                drag.current.startLeft - (event.clientX - drag.current.startX);
        }
    };

    const endDrag = () => {
        drag.current.down = false;
        setIsDragging(false);
    };

    const onPointerUp = () => {
        endDrag();
    };

    const onPointerLeave = () => {
        endDrag();
    };

    const onClickCapture = (event: React.MouseEvent<HTMLDivElement>) => {
        if (drag.current.moved) {
            event.preventDefault();
            event.stopPropagation();
            drag.current.moved = false;
        }

        setIsDragging(false);
    };

    const handleScroll = () => {
        const element = scrollerRef.current;

        if (!element) {
            return;
        }

        const page = Math.round(element.scrollLeft / element.clientWidth);
        const max = Math.max(
            1,
            Math.round(element.scrollWidth / element.clientWidth),
        );

        setActivePage(Math.min(page, max - 1));
    };

    const scrollByPage = (delta: number) => {
        const element = scrollerRef.current;

        if (!element) {
            return;
        }

        element.scrollBy({
            left: delta * element.clientWidth * 0.92,
            behavior: 'smooth',
        });
    };

    const goToPage = (page: number) => {
        const element = scrollerRef.current;

        if (!element) {
            return;
        }

        element.scrollTo({
            left: page * element.clientWidth,
            behavior: 'smooth',
        });
    };

    return (
        <section className="bg-slate-50 py-16 sm:py-20">
            <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 md:px-10 lg:px-14">
                <div className="mb-8 flex items-end justify-between gap-4 sm:mb-10">
                    <div>
                        <span className="text-xs font-bold tracking-widest text-[#0284c7] uppercase">
                            Promo &amp; Penawaran
                        </span>

                        <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-[#075985] sm:text-3xl">
                            Penawaran Terbaru
                        </h2>

                        <p className="mt-1 text-sm text-slate-500 sm:text-base">
                            Nikmati promo dan penawaran menarik dari RS Merdeka
                        </p>
                    </div>
                </div>

                {loading ? (
                    <div className="flex gap-4 overflow-hidden">
                        {Array.from({ length: 3 }).map((_, index) => (
                            <div
                                key={index}
                                className="h-[330px] w-[85%] shrink-0 animate-pulse rounded-3xl bg-white sm:w-[46%] md:w-[32%] lg:w-[calc((100%-2rem)/3)]"
                            />
                        ))}
                    </div>
                ) : penawarans.length === 0 ? (
                    <p className="py-12 text-center text-sm text-slate-500">
                        Belum ada penawaran untuk ditampilkan.
                    </p>
                ) : (
                    <>
                        <div className="relative">
                            <div
                                ref={scrollerRef}
                                onPointerDown={onPointerDown}
                                onPointerMove={onPointerMove}
                                onPointerUp={onPointerUp}
                                onPointerLeave={onPointerLeave}
                                onClickCapture={onClickCapture}
                                onScroll={handleScroll}
                                className={`-mx-5 flex snap-x snap-mandatory [scrollbar-width:none] gap-4 overflow-x-auto px-5 pb-3 sm:-mx-8 sm:px-8 md:-mx-10 md:px-10 lg:-mx-14 lg:px-14 [&::-webkit-scrollbar]:hidden ${
                                    isDragging
                                        ? 'cursor-grabbing'
                                        : 'cursor-grab'
                                }`}
                            >
                                {penawarans.map((penawaran) => (
                                    <article
                                        key={penawaran.id}
                                        className="w-[85%] shrink-0 snap-start overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-[#0284c7] hover:shadow-xl hover:shadow-sky-100 sm:w-[46%] md:w-[32%] lg:w-[calc((100%-2rem)/3)]"
                                    >
                                        <div className="relative h-[170px] overflow-hidden bg-gradient-to-br from-[#e0f2fe] via-[#bae6fd] to-[#7dd3fc] sm:h-[190px]">
                                            {penawaran.image_url ? (
                                                <img
                                                    src={penawaran.image_url}
                                                    alt={penawaran.title}
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className="h-14 w-14 text-[#075985]/40"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="1.5"
                                                    >
                                                        <path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 7.65l.78.77L12 20.68l7.64-7.65.78-.77a5.4 5.4 0 0 0 0-7.68Z" />
                                                    </svg>
                                                </div>
                                            )}

                                            <span className="absolute top-3 right-3 rounded-full bg-[#0ea5e9] px-3 py-1 text-[11px] font-bold tracking-wide text-white uppercase shadow-sm">
                                                Promo
                                            </span>
                                        </div>

                                        <div className="flex min-h-[150px] flex-col p-5">
                                            <h3 className="line-clamp-2 text-sm leading-snug font-bold text-slate-800 sm:text-base">
                                                {penawaran.title}
                                            </h3>

                                            <p className="mt-2 line-clamp-3 text-[13px] leading-relaxed text-slate-500">
                                                {penawaran.description || '-'}
                                            </p>
                                        </div>
                                    </article>
                                ))}
                            </div>

                            <button
                                type="button"
                                onClick={() => scrollByPage(-1)}
                                disabled={safePage <= 0}
                                aria-label="Geser ke kiri"
                                className="absolute top-1/2 left-2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-[#075985] shadow-md transition hover:bg-[#075985] hover:text-white disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-[#075985]"
                            >
                                {chevron('left')}
                            </button>

                            <button
                                type="button"
                                onClick={() => scrollByPage(1)}
                                disabled={safePage >= pages - 1}
                                aria-label="Geser ke kanan"
                                className="absolute top-1/2 right-2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-[#075985] shadow-md transition hover:bg-[#075985] hover:text-white disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-[#075985]"
                            >
                                {chevron('right')}
                            </button>
                        </div>

                        <div className="mt-6 flex items-center justify-center gap-2.5">
                            {Array.from({ length: pages }).map(
                                (_, dotIndex) => (
                                    <button
                                        key={dotIndex}
                                        type="button"
                                        onClick={() => goToPage(dotIndex)}
                                        aria-label={`Ke halaman ${dotIndex + 1}`}
                                        className={`h-2.5 rounded-full transition-all duration-300 ${
                                            dotIndex === safePage
                                                ? 'w-7 bg-[#0ea5e9]'
                                                : 'w-2.5 bg-slate-300 hover:bg-[#7dd3fc]'
                                        }`}
                                    />
                                ),
                            )}
                        </div>
                    </>
                )}
            </div>
        </section>
    );
}
