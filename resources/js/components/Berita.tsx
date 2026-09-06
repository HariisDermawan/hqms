import { Link } from '@inertiajs/react';
import { getKioskBeritas } from '@/api/kiosk';
import { useEffect, useRef, useState } from 'react';

interface BeritaCard {
    id: number;
    title: string;
    slug: string;
    description: string | null;
    image_url: string | null;
}

const DRAG_THRESHOLD = 6;

const formatDate = (): string => {
    return new Date()
        .toLocaleDateString('id-ID', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        })
        .toUpperCase();
};

export default function Berita() {
    const [beritas, setBeritas] = useState<BeritaCard[]>([]);
    const [page, setPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [isDragging, setIsDragging] = useState(false);
    const scrollerRef = useRef<HTMLDivElement>(null);
    const drag = useRef({
        down: false,
        moved: false,
        startX: 0,
        startLeft: 0,
    });

    const [featured, ...others] = beritas;
    const featuredImage = featured?.image_url;

    const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
        if (event.pointerType !== 'mouse' || event.button !== 0) {
            return;
        }

        const scroller = scrollerRef.current;

        if (!scroller) {
            return;
        }

        drag.current = {
            down: true,
            moved: false,
            startX: event.clientX,
            startLeft: scroller.scrollLeft,
        };
    };

    const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
        if (!drag.current.down) {
            return;
        }

        const scroller = scrollerRef.current;

        if (!scroller) {
            return;
        }

        if (!drag.current.moved) {
            const delta = event.clientX - drag.current.startX;

            if (Math.abs(delta) > DRAG_THRESHOLD) {
                drag.current.moved = true;
            }
        }

        if (drag.current.moved) {
            scroller.scrollLeft =
                drag.current.startLeft - (event.clientX - drag.current.startX);
        }
    };

    const endDrag = () => {
        drag.current.down = false;
        setIsDragging(false);
    };

    const onPointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
        if (event.pointerType !== 'mouse') {
            return;
        }

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

    useEffect(() => {
        let active = true;

        const load = async () => {
            try {
                const response = await getKioskBeritas(page);
                if (!active) {
                    return;
                }

                setBeritas(
                    (response.data?.items ?? []).map((berita) => ({
                        id: berita.id,
                        title: berita.title,
                        slug: berita.slug,
                        description: berita.description ?? null,
                        image_url: berita.image_url ?? null,
                    })),
                );
                setLastPage(response.data?.pagination?.last_page ?? 1);
                setTotal(response.data?.pagination?.total ?? 0);
            } catch {
                if (active) {
                    setBeritas([]);
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
    }, [page]);

    return (
        <section className="bg-white py-16 sm:py-20">
            <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 md:px-10 lg:px-14">
                <div className="mb-8 flex items-end justify-between gap-4 sm:mb-10">
                    <div>
                        <span className="text-xs font-bold tracking-widest text-[#0284c7] uppercase">
                            Kesehatan &amp; Layanan
                        </span>

                        <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-[#075985] sm:text-3xl">
                            Berita &amp; Info Terbaru
                        </h2>

                        <p className="mt-1 text-sm text-slate-500 sm:text-base">
                            Informasi dan kabar terbaru dari RS Merdeka
                        </p>
                    </div>

                    <Link
                        href="/berita"
                        className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-[#075985] transition hover:text-[#0284c7]"
                    >
                        Semua Berita
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
                    <>
                        <div className="h-[260px] w-full animate-pulse rounded-3xl bg-slate-100 sm:h-[300px]" />

                        <div className="mt-6 flex gap-4 overflow-hidden">
                            {Array.from({ length: 4 }).map((_, index) => (
                                <div
                                    key={index}
                                    className="h-[320px] w-[75%] shrink-0 animate-pulse rounded-3xl bg-slate-100 sm:w-[45%] md:w-[30%] lg:w-[24%]"
                                />
                            ))}
                        </div>
                    </>
                ) : beritas.length === 0 ? (
                    <p className="py-12 text-center text-sm text-slate-500">
                        Belum ada berita untuk ditampilkan.
                    </p>
                ) : (
                    <>
                        {/* FEATURED */}
                        {featured && (
                            <Link
                                href={`/berita/${featured.slug}`}
                                className="group relative block overflow-hidden rounded-3xl shadow-md"
                            >
                                <div className="relative h-[240px] w-full bg-[#075985]/10 sm:h-[320px]">
                                    {featuredImage ? (
                                        <img
                                            src={featuredImage}
                                            alt={featured.title}
                                            className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-16 w-16 text-[#075985]/40"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="1.5"
                                            >
                                                <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-4 0V7" />
                                                <path d="m4 15 3-3 3 3 3-4 4 4" />
                                            </svg>
                                        </div>
                                    )}

                                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

                                    <div className="absolute right-5 bottom-5 left-5 sm:right-8 sm:bottom-7 sm:left-8">
                                        <div className="mb-3 flex flex-wrap items-center gap-2">
                                            <span className="rounded-full bg-[#0ea5e9] px-3 py-1 text-[11px] font-bold tracking-wide text-white uppercase">
                                                Terbaru
                                            </span>

                                            <span className="text-xs font-medium text-white/70">
                                                {formatDate()}
                                            </span>
                                        </div>

                                        <h3 className="line-clamp-2 text-xl leading-tight font-extrabold text-white transition group-hover:text-sky-100 sm:text-3xl sm:leading-tight">
                                            {featured.title}
                                        </h3>

                                        <p className="mt-3 line-clamp-2 hidden max-w-2xl text-sm leading-relaxed text-white/80 sm:block">
                                            {featured.description || '-'}
                                        </p>

                                        <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-sky-300 transition group-hover:gap-2.5">
                                            Baca Selengkapnya
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
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        )}

                        {/* CAROUSEL */}
                        {others.length > 0 && (
                            <div
                                ref={scrollerRef}
                                onPointerDown={onPointerDown}
                                onPointerMove={onPointerMove}
                                onPointerUp={onPointerUp}
                                onPointerLeave={onPointerLeave}
                                onClickCapture={onClickCapture}
                                className={`-mx-5 mt-6 flex snap-x snap-mandatory [scrollbar-width:none] gap-4 overflow-x-auto px-5 pb-3 sm:-mx-8 sm:px-8 md:-mx-10 md:px-10 lg:-mx-14 lg:px-14 [&::-webkit-scrollbar]:hidden ${
                                    isDragging
                                        ? 'cursor-grabbing'
                                        : 'cursor-grab'
                                }`}
                            >
                                {others.map((berita, index) => (
                                    <Link
                                        key={berita.id}
                                        href={`/berita/${berita.slug}`}
                                        className="group w-[75%] shrink-0 snap-start overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-[#0284c7] hover:shadow-xl hover:shadow-sky-100 sm:w-[45%] md:w-[30%] lg:w-[24%]"
                                    >
                                        <div className="relative h-[140px] overflow-hidden bg-[#075985]/10">
                                            {berita.image_url ? (
                                                <img
                                                    src={berita.image_url}
                                                    alt={berita.title}
                                                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                                                />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className="h-10 w-10 text-[#075985]/40"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="1.5"
                                                    >
                                                        <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-4 0V7" />
                                                        <path d="m4 15 3-3 3 3 3-4 4 4" />
                                                    </svg>
                                                </div>
                                            )}

                                            <span className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-[11px] font-bold text-white ring-1 ring-white/30 backdrop-blur">
                                                {index + 1}
                                            </span>
                                        </div>

                                        <div className="flex min-h-[150px] flex-col p-5">
                                            <h3 className="line-clamp-2 text-sm leading-snug font-bold text-slate-800 group-hover:text-[#075985] sm:text-base">
                                                {berita.title}
                                            </h3>

                                            <p className="mt-2 line-clamp-2 text-[13px] leading-relaxed text-slate-500">
                                                {berita.description || '-'}
                                            </p>

                                            <span className="mt-auto inline-flex items-center gap-1 pt-4 text-[13px] font-semibold text-[#075985]">
                                                Baca Selengkapnya
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-4 w-4 transition group-hover:translate-x-0.5"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                >
                                                    <path d="M5 12h14M13 6l6 6-6 6" />
                                                </svg>
                                            </span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </>
                )}

                {/* PAGINATION */}
                {!loading && total > 0 && (
                    <div className="mt-6 flex items-center justify-between gap-4 border-t border-slate-100 pt-5">
                        <p className="text-xs text-slate-400">
                            Menampilkan {beritas.length} dari {total} berita
                        </p>

                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() =>
                                    page > 1 &&
                                    (setLoading(true),
                                    setPage((current) => current - 1))
                                }
                                disabled={page <= 1}
                                className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:bg-[#075985] hover:text-white disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-slate-500"
                                aria-label="Halaman sebelumnya"
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

                            <span className="min-w-[90px] text-center text-xs font-medium text-slate-500">
                                Hal {page} / {lastPage}
                            </span>

                            <button
                                type="button"
                                onClick={() =>
                                    page < lastPage &&
                                    (setLoading(true),
                                    setPage((current) => current + 1))
                                }
                                disabled={page >= lastPage}
                                className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:bg-[#075985] hover:text-white disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-slate-500"
                                aria-label="Halaman berikutnya"
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
                )}
            </div>
        </section>
    );
}
