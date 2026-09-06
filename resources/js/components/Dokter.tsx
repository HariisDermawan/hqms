import { Link } from '@inertiajs/react';
import { getKioskDokters, getKioskPolis, type KioskPoli } from '@/api/kiosk';
import { useEffect, useRef, useState } from 'react';

interface JadwalCard {
    id: number;
    day: string;
    start_time: string;
    end_time: string;
    poli?: string | null;
}

interface DokterCard {
    id: number;
    name: string;
    specialization?: string | null;
    image_url: string | null;
    schedules: JadwalCard[];
}

const DRAG_THRESHOLD = 6;

const DAY_OPTIONS = [
    'Senin',
    'Selasa',
    'Rabu',
    'Kamis',
    'Jumat',
    'Sabtu',
    'Minggu',
];

const getInitials = (name: string): string =>
    name
        .replace(/^dr[a-z]*\.\s*/i, '')
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part.charAt(0).toUpperCase())
        .join('');

const selectClass =
    'h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm text-slate-700 outline-none transition focus:border-[#0284c7] focus:ring-2 focus:ring-[#0284c7]/20';

function SearchDoctorCard({ specializations }: { specializations: string[] }) {
    const [polis, setPolis] = useState<KioskPoli[]>([]);
    const [query, setQuery] = useState('');
    const [spec, setSpec] = useState('');
    const [hari, setHari] = useState('');

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
            }
        };

        void load();

        return () => {
            active = false;
        };
    }, []);

    const uniqueSpecs = Array.from(
        new Set(
            specializations
                .filter((value) => Boolean(value && value.trim()))
                .map((value) => value.trim()),
        ),
    );

    const combinedOptions = Array.from(
        new Set(
            [
                ...uniqueSpecs,
                ...polis.map((poli) => poli.name).filter(Boolean),
            ].filter((value) => Boolean(value && value.trim())),
        ),
    );

    return (
        <div className="relative z-10 mb-12 overflow-hidden rounded-3xl border border-[#075985]/10 bg-white shadow-2xl shadow-sky-100/70">
            <div className="border-b border-slate-100 bg-gradient-to-r from-[#f0f9ff] via-white to-white px-6 py-5 sm:px-8">
                <div className="flex items-center gap-3 sm:gap-4">
                    <img
                        src="/assets/LG1.png"
                        alt="RS Merdeka"
                        className="h-12 w-auto shrink-0 object-contain sm:h-14"
                    />
                    <div>
                        <h3 className="text-lg font-extrabold tracking-tight text-[#075985] sm:text-xl">
                            Cari Dokter
                        </h3>
                        <p className="text-xs text-slate-500 sm:text-sm">
                            Temukan dokter yang Anda butuhkan
                        </p>
                    </div>
                </div>
            </div>

            <div className="p-6 sm:p-8">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="relative">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-slate-400"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <circle cx="11" cy="11" r="8" />
                            <path d="m21 21-4.3-4.3" />
                        </svg>
                        <input
                            type="text"
                            value={query}
                            onChange={(event) => setQuery(event.target.value)}
                            placeholder="Masukkan nama dokter..."
                            className="h-12 w-full rounded-xl border border-slate-300 bg-white pr-4 pl-10 text-sm text-slate-700 transition outline-none placeholder:text-slate-400 focus:border-[#0284c7] focus:ring-2 focus:ring-[#0284c7]/20"
                        />
                    </div>

                    <select
                        value={spec}
                        onChange={(event) => setSpec(event.target.value)}
                        className={selectClass}
                    >
                        <option value="">Spesialisasi / Poli</option>
                        {combinedOptions.map((item) => (
                            <option key={item} value={item}>
                                {item}
                            </option>
                        ))}
                    </select>

                    <select
                        value={hari}
                        onChange={(event) => setHari(event.target.value)}
                        className={selectClass}
                    >
                        <option value="">Hari</option>
                        {DAY_OPTIONS.map((item) => (
                            <option key={item} value={item}>
                                {item}
                            </option>
                        ))}
                    </select>

                    <Link
                        href="/dokters"
                        className="flex h-12 items-center justify-center gap-2 rounded-xl bg-[#075985] px-5 text-sm font-bold text-white shadow-md shadow-sky-200/60 transition hover:bg-[#064e73] hover:shadow-lg active:scale-[0.98]"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <circle cx="11" cy="11" r="8" />
                            <path d="m21 21-4.3-4.3" />
                        </svg>
                        Cari
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default function Dokter() {
    const [dokters, setDokters] = useState<DokterCard[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDragging, setIsDragging] = useState(false);
    const scrollerRef = useRef<HTMLDivElement>(null);
    const drag = useRef({
        down: false,
        moved: false,
        startX: 0,
        startLeft: 0,
    });

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
                const response = await getKioskDokters();
                if (!active) {
                    return;
                }

                setDokters(
                    (response.data?.items ?? []).map((dokter) => ({
                        id: dokter.id,
                        name: dokter.name,
                        specialization: dokter.specialization ?? null,
                        image_url: dokter.image_url ?? null,
                        schedules: dokter.schedules ?? [],
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
                <SearchDoctorCard
                    specializations={dokters.map(
                        (dokter) => dokter.specialization ?? '',
                    )}
                />

                <div className="mb-10 flex flex-col items-start gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div className="text-left">
                        <h2 className="text-2xl font-extrabold tracking-tight text-[#075985] sm:text-3xl">
                            Dokter Kami
                        </h2>
                        <p className="mt-4 text-sm leading-6 text-slate-600 sm:text-base">
                            Profesional, Ramah, dan Siap Melayani Anda
                        </p>
                    </div>

                    <Link
                        href="/dokters"
                        className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-[#0369a1] transition hover:text-[#075985]"
                    >
                        Lihat Semua
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <path d="M5 12h14" />
                            <path d="M13 6l6 6-6 6" />
                        </svg>
                    </Link>
                </div>

                {loading ? (
                    <div className="flex gap-5 overflow-hidden">
                        {Array.from({ length: 4 }).map((_, index) => (
                            <div
                                key={index}
                                className="w-[75%] shrink-0 animate-pulse overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-md sm:w-[45%] md:w-[30%] lg:w-[24%]"
                            >
                                <div className="aspect-[4/5] w-full bg-slate-100" />
                                <div className="p-4">
                                    <div className="h-4 w-3/4 rounded-full bg-slate-100" />
                                    <div className="mt-2 h-3 w-1/2 rounded-full bg-slate-100" />
                                    <div className="mt-4 h-3 w-2/5 rounded-full bg-slate-100" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : dokters.length === 0 ? (
                    <p className="py-12 text-center text-sm text-slate-500">
                        Belum ada dokter yang tersedia.
                    </p>
                ) : (
                    <div
                        ref={scrollerRef}
                        onPointerDown={onPointerDown}
                        onPointerMove={onPointerMove}
                        onPointerUp={onPointerUp}
                        onPointerLeave={onPointerLeave}
                        onClickCapture={onClickCapture}
                        className={`-mx-5 flex snap-x snap-mandatory [scrollbar-width:none] gap-5 overflow-x-auto px-5 pb-4 sm:-mx-8 sm:px-8 md:-mx-10 md:px-10 lg:-mx-14 lg:px-14 [&::-webkit-scrollbar]:hidden ${
                            isDragging ? 'cursor-grabbing' : 'cursor-grab'
                        }`}
                    >
                        {dokters.map((dokter) => (
                            <Link
                                key={dokter.id}
                                href="/dokters"
                                className="group w-[75%] shrink-0 snap-start overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-md transition duration-300 hover:-translate-y-1.5 hover:border-[#bae6fd] hover:shadow-2xl hover:shadow-sky-100 sm:w-[45%] md:w-[30%] lg:w-[24%]"
                            >
                                <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#f0f9ff]">
                                    {dokter.image_url ? (
                                        <img
                                            src={dokter.image_url}
                                            alt={dokter.name}
                                            className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#e0f2fe] via-[#bae6fd] to-[#7dd3fc]">
                                            <span className="text-5xl font-extrabold text-[#075985]/40">
                                                {getInitials(dokter.name) ||
                                                    '?'}
                                            </span>
                                        </div>
                                    )}
                                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#075985]/50 via-[#0284c7]/15 to-transparent" />
                                </div>

                                <div className="p-4 text-left sm:p-5">
                                    <p className="line-clamp-1 text-sm leading-snug font-bold text-slate-800 transition group-hover:text-[#075985] sm:text-[15px]">
                                        {dokter.name}
                                        {dokter.specialization
                                            ? `, ${dokter.specialization}`
                                            : ''}
                                    </p>

                                    <p className="mt-1.5 line-clamp-1 text-[11px] font-semibold tracking-wider text-[#0369a1]/70 uppercase">
                                        {dokter.schedules[0]?.poli ?? 'Dokter'}
                                    </p>

                                    <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-[#0284c7] transition group-hover:gap-1.5 group-hover:text-[#075985]">
                                        Lihat Jadwal Dokter
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2.5"
                                        >
                                            <path d="M5 12h14" />
                                            <path d="M13 6l6 6-6 6" />
                                        </svg>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
