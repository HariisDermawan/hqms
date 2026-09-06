import { Head, Link } from '@inertiajs/react';
import { getKioskDokters, type KioskDoktersResponse } from '@/api/kiosk';
import type { Dokter } from '@/api/dokter';
import Navbar from '@/components/Navbar';
import { useEffect, useState } from 'react';

const DAY_TO_KEY: Record<string, string> = {
    Senin: 'monday',
    Selasa: 'tuesday',
    Rabu: 'wednesday',
    Kamis: 'thursday',
    Jumat: 'friday',
    Sabtu: 'saturday',
    Minggu: 'sunday',
};

const DAY_OPTIONS = Object.keys(DAY_TO_KEY);

const getInitials = (name: string): string =>
    name
        .replace(/^dr[a-z]*\.\s*/i, '')
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part.charAt(0).toUpperCase())
        .join('');

const selectClass =
    'w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-[#0284c7] focus:ring-2 focus:ring-[#0284c7]/20';

export default function Cari() {
    const [dokters, setDokters] = useState<Dokter[]>([]);
    const [loading, setLoading] = useState(true);
    const [query, setQuery] = useState('');
    const [spec, setSpec] = useState('');
    const [hari, setHari] = useState('');
    const [appliedQuery, setAppliedQuery] = useState('');
    const [appliedSpec, setAppliedSpec] = useState('');
    const [appliedHari, setAppliedHari] = useState('');
    const [sort, setSort] = useState('');
    const [page, setPage] = useState(1);
    const pageSize = 8;

    useEffect(() => {
        let active = true;

        const load = async () => {
            try {
                const response: KioskDoktersResponse = await getKioskDokters();
                if (active) {
                    setDokters(response.data?.items ?? []);
                }
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

    const uniqueSpecs = Array.from(
        new Set(
            dokters
                .map((d) => d.specialization ?? '')
                .filter((v) => Boolean(v && v.trim()))
                .map((v) => v.trim()),
        ),
    );

    const uniquePolis = Array.from(
        new Set(
            dokters
                .flatMap((d) => (d.schedules ?? []).map((s) => s.poli ?? ''))
                .filter((v) => Boolean(v && v.trim()))
                .map((v) => v.trim()),
        ),
    );

    const combinedOptions = Array.from(
        new Set([...uniqueSpecs, ...uniquePolis]),
    );

    const keyword = appliedQuery.trim().toLowerCase();
    const dayKey = DAY_TO_KEY[appliedHari];

    const filtered = dokters.filter((dokter) => {
        const matchesKeyword =
            !keyword ||
            dokter.name.toLowerCase().includes(keyword) ||
            (dokter.specialization ?? '').toLowerCase().includes(keyword);

        const matchesSpec =
            !appliedSpec ||
            (dokter.specialization ?? '') === appliedSpec ||
            (dokter.schedules ?? []).some((s) => s.poli === appliedSpec);

        const matchesHari =
            !dayKey || (dokter.schedules ?? []).some((s) => s.day === dayKey);

        return matchesKeyword && matchesSpec && matchesHari;
    });

    const sorted = [...filtered].sort((a, b) => {
        if (sort === 'az') {
            return a.name.localeCompare(b.name);
        }
        if (sort === 'za') {
            return b.name.localeCompare(a.name);
        }
        return 0;
    });

    const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
    const currentPage = Math.min(page, totalPages);
    const paginated = sorted.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize,
    );

    const goToPage = (target: number) => {
        setPage(Math.min(Math.max(1, target), totalPages));
    };

    const applyFilters = () => {
        setAppliedQuery(query);
        setAppliedSpec(spec);
        setAppliedHari(hari);
        setPage(1);
    };

    const removeAppliedQuery = () => {
        setAppliedQuery('');
        setQuery('');
        setPage(1);
    };

    const removeAppliedSpec = () => {
        setAppliedSpec('');
        setSpec('');
        setPage(1);
    };

    const removeAppliedHari = () => {
        setAppliedHari('');
        setHari('');
        setPage(1);
    };

    const resetFilters = () => {
        setQuery('');
        setSpec('');
        setHari('');
        setAppliedQuery('');
        setAppliedSpec('');
        setAppliedHari('');
        setPage(1);
    };

    const activeChips = [
        appliedSpec && {
            key: 'spec',
            label: appliedSpec,
            onRemove: removeAppliedSpec,
        },
        appliedHari && {
            key: 'hari',
            label: appliedHari,
            onRemove: removeAppliedHari,
        },
        appliedQuery.trim() && {
            key: 'query',
            label: `"${appliedQuery.trim()}"`,
            onRemove: removeAppliedQuery,
        },
    ].filter(Boolean) as Array<{
        key: string;
        label: string;
        onRemove: () => void;
    }>;

    return (
        <>
            <Head title="Cari Dokter - RS Merdeka" />
            <Navbar />

            <main className="bg-slate-50">
                <section className="relative w-full overflow-hidden bg-[#075985]">
                    <div
                        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
                        style={{ backgroundImage: "url('/banner/bn1.png')" }}
                    />
                    <div className="absolute inset-0 z-[1] bg-gradient-to-r from-[#075985]/95 via-[#075985]/85 to-[#0284c7]/55" />
                    <div className="absolute inset-0 z-[1] bg-[radial-gradient(circle_at_75%_50%,rgba(56,189,248,0.25),transparent_40%)]" />

                    <div className="relative z-10 mx-auto flex w-full max-w-7xl items-center px-5 pt-[110px] pb-20 sm:px-8 sm:pt-[120px] sm:pb-24 md:px-10 md:pt-[130px] lg:px-14">
                        <div className="relative z-20 w-full max-w-[680px]">
                            <h1 className="text-[34px] leading-[0.98] font-extrabold tracking-tight text-white drop-shadow-sm sm:text-[42px] md:text-[50px] lg:text-[58px]">
                                Cari Dokter
                            </h1>
                            <p className="mt-3 max-w-[580px] text-sm leading-6 text-white/90 sm:mt-5 sm:text-base sm:leading-7 md:text-lg">
                                Temukan dokter dan jadwal praktik terbaik untuk
                                keluarga Anda.
                            </p>

                            <nav className="mt-7 inline-flex items-center gap-1.5 rounded-full bg-white/10 px-5 py-2.5 text-[13px] font-semibold backdrop-blur-sm">
                                <Link
                                    href="/"
                                    className="inline-flex items-center gap-1.5 text-white/90 transition hover:text-white"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-3.5 w-3.5"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M3 10.182V22a1 1 0 0 0 1 1h5v-7h6v7h5a1 1 0 0 0 1-1V10.182" />
                                        <path d="M1.462 10.182 11.73 2.41a1 1 0 0 1 1.54 0l10.268 7.772" />
                                    </svg>
                                    Beranda
                                </Link>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-3.5 w-3.5 text-white/50"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="m9 18 6-6-6-6" />
                                </svg>
                                <span className="text-white">Cari Dokter</span>
                            </nav>
                        </div>
                    </div>
                </section>

                <div className="w-full py-16 pr-5 pl-5 sm:pr-8 sm:pl-8 md:pr-10 md:pl-10 lg:pr-14 lg:pl-4">
                    <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[420px_1fr]">
                        <aside className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-xl shadow-sky-100/70 lg:rounded-r-3xl lg:border-l-0">
                            <div className="border-b border-[#075985]/10 bg-gradient-to-r from-[#075985] via-[#0369a1] to-[#0284c7] px-6 py-5">
                                <h2 className="text-base font-extrabold tracking-tight text-white">
                                    FILTER DOKTER
                                </h2>
                            </div>

                            <div className="space-y-4 p-6">
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
                                        onChange={(event) =>
                                            setQuery(event.target.value)
                                        }
                                        placeholder="Masukkan nama dokter..."
                                        className="w-full rounded-xl border border-slate-300 bg-white py-3 pr-4 pl-10 text-sm text-slate-700 transition outline-none placeholder:text-slate-400 focus:border-[#0284c7] focus:ring-2 focus:ring-[#0284c7]/20"
                                    />
                                </div>

                                <div>
                                    <label className="mb-1.5 block text-xs font-bold tracking-wide text-slate-600 uppercase">
                                        Spesialisasi / Poli
                                    </label>
                                    <select
                                        value={spec}
                                        onChange={(event) =>
                                            setSpec(event.target.value)
                                        }
                                        className={selectClass}
                                    >
                                        <option value="">Semua</option>
                                        {combinedOptions.map((item) => (
                                            <option key={item} value={item}>
                                                {item}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="mb-1.5 block text-xs font-bold tracking-wide text-slate-600 uppercase">
                                        Hari Praktik
                                    </label>
                                    <select
                                        value={hari}
                                        onChange={(event) =>
                                            setHari(event.target.value)
                                        }
                                        className={selectClass}
                                    >
                                        <option value="">Semua Hari</option>
                                        {DAY_OPTIONS.map((item) => (
                                            <option key={item} value={item}>
                                                {item}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <button
                                    type="button"
                                    onClick={applyFilters}
                                    className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#075985] text-sm font-bold text-white transition hover:bg-[#0284c7] hover:shadow-lg hover:shadow-sky-200"
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
                                </button>
                            </div>
                        </aside>

                        <div className="min-w-0">
                            <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
                                <div>
                                    <h2 className="text-2xl font-extrabold tracking-tight text-[#075985] sm:text-3xl">
                                        Dokter Kami
                                    </h2>
                                    <p className="mt-2 text-sm leading-6 text-slate-600 sm:text-base">
                                        Profesional, Ramah, dan Siap Melayani
                                        Anda
                                    </p>
                                    <p className="mt-1 text-xs text-slate-400">
                                        {loading
                                            ? 'Memuat data dokter...'
                                            : `Menampilkan ${sorted.length} dari total ${dokters.length} dokter`}
                                    </p>
                                </div>

                                <div className="flex items-center gap-2">
                                    <label className="text-sm font-semibold text-slate-600">
                                        Urutkan:
                                    </label>
                                    <select
                                        value={sort}
                                        onChange={(event) => {
                                            setSort(event.target.value);
                                            setPage(1);
                                        }}
                                        className="rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 transition outline-none focus:border-[#0284c7] focus:ring-2 focus:ring-[#0284c7]/20"
                                    >
                                        <option value="">Paling Relevan</option>
                                        <option value="az">Nama A-Z</option>
                                        <option value="za">Nama Z-A</option>
                                    </select>
                                </div>
                            </div>

                            {activeChips.length > 0 && (
                                <div className="mb-6 flex flex-wrap items-center gap-2">
                                    {activeChips.map((chip) => (
                                        <button
                                            key={chip.key}
                                            type="button"
                                            onClick={chip.onRemove}
                                            className="inline-flex items-center gap-1.5 rounded-full bg-[#e0f2fe] py-1.5 pr-2.5 pl-3.5 text-xs font-bold text-[#075985] transition hover:bg-[#bae6fd]"
                                        >
                                            {chip.label}
                                            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#075985]/10 text-[#075985] hover:bg-[#075985]/20">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-3 w-3"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2.5"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                >
                                                    <path d="M18 6 6 18" />
                                                    <path d="m6 6 12 12" />
                                                </svg>
                                            </span>
                                        </button>
                                    ))}

                                    <button
                                        type="button"
                                        onClick={resetFilters}
                                        className="text-xs font-bold text-[#0284c7] uppercase underline-offset-4 transition hover:text-[#075985] hover:underline"
                                    >
                                        Hapus Semua Filter
                                    </button>
                                </div>
                            )}

                            {loading ? (
                                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
                                    {Array.from({ length: 8 }).map(
                                        (_, index) => (
                                            <div
                                                key={index}
                                                className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-md"
                                            >
                                                <div className="aspect-[4/5] w-full animate-pulse bg-slate-100" />
                                                <div className="space-y-2.5 p-4 sm:p-5">
                                                    <div className="h-4 w-3/4 rounded-full bg-slate-100" />
                                                    <div className="h-3 w-1/2 rounded-full bg-slate-100" />
                                                    <div className="h-3 w-2/5 rounded-full bg-slate-100" />
                                                </div>
                                            </div>
                                        ),
                                    )}
                                </div>
                            ) : sorted.length === 0 ? (
                                <div className="border border-dashed border-slate-200 bg-white p-14 text-center shadow-sm">
                                    <img
                                        src="/icons/doktr.svg"
                                        alt="Dokter tidak ditemukan"
                                        className="mx-auto mb-5 h-28 w-28 opacity-30"
                                    />
                                    <p className="text-sm text-slate-500">
                                        Tidak ada dokter yang cocok dengan
                                        filter Anda.
                                    </p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
                                    {paginated.map((dokter) => (
                                        <Link
                                            key={dokter.id}
                                            href={
                                                dokter.slug
                                                    ? `/dokter/${dokter.slug}`
                                                    : '/cari-dokter'
                                            }
                                            className="group overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-md transition duration-300 hover:-translate-y-1.5 hover:border-[#bae6fd] hover:shadow-2xl hover:shadow-sky-100"
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
                                                            {getInitials(
                                                                dokter.name,
                                                            ) || '?'}
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
                                                    {dokter.schedules?.[0]
                                                        ?.poli ?? 'Dokter'}
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

                            {sorted.length > 0 && (
                                <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            goToPage(currentPage - 1)
                                        }
                                        disabled={currentPage === 1}
                                        className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:border-[#bae6fd] hover:text-[#075985] disabled:cursor-not-allowed disabled:opacity-40"
                                        aria-label="Halaman sebelumnya"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-4 w-4"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <path d="m15 18-6-6 6-6" />
                                        </svg>
                                    </button>

                                    {Array.from({ length: totalPages }).map(
                                        (_, index) => (
                                            <button
                                                key={index}
                                                type="button"
                                                onClick={() =>
                                                    goToPage(index + 1)
                                                }
                                                className={`h-10 w-10 rounded-xl text-sm font-bold transition ${
                                                    currentPage === index + 1
                                                        ? 'bg-[#075985] text-white shadow-md shadow-sky-200'
                                                        : 'border border-slate-200 bg-white text-slate-600 hover:border-[#bae6fd] hover:text-[#075985]'
                                                }`}
                                            >
                                                {index + 1}
                                            </button>
                                        ),
                                    )}

                                    <button
                                        type="button"
                                        onClick={() =>
                                            goToPage(currentPage + 1)
                                        }
                                        disabled={currentPage === totalPages}
                                        className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:border-[#bae6fd] hover:text-[#075985] disabled:cursor-not-allowed disabled:opacity-40"
                                        aria-label="Halaman berikutnya"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-4 w-4"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <path d="m9 18 6-6-6-6" />
                                        </svg>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}
