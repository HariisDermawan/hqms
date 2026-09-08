import { Head, Link } from '@inertiajs/react';
import { getKioskBeritas } from '@/api/kiosk';
import Navbar from '@/components/Navbar';
import { useEffect, useState } from 'react';
import type { Berita } from '@/api/berita';

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

const stripHtml = (html: string | null): string =>
    (html ?? '')
        .replace(/<[^>]*>/g, ' ')
        .replace(/&nbsp;/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

interface DetailProps {
    berita: {
        id: number;
        title: string;
        slug: string;
        description: string | null;
        image_url: string | null;
    };
}

export default function Detail({ berita }: DetailProps) {
    const [related, setRelated] = useState<Berita[]>([]);

    useEffect(() => {
        let active = true;

        const load = async () => {
            try {
                const response = await getKioskBeritas(1);

                if (!active) {
                    return;
                }

                setRelated(
                    (response.data?.items ?? []).filter(
                        (item) => item.id !== berita.id,
                    ),
                );
            } catch {
                if (active) {
                    setRelated([]);
                }
            }
        };

        void load();

        return () => {
            active = false;
        };
    }, [berita.id]);

    const bodyText = (berita.description ?? '').trim();

    return (
        <>
            <Head title={`${berita.title} - RS Merdeka`} />
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
                        <div className="relative z-20 w-full max-w-[760px]">
                            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-[12px] font-bold tracking-wider text-sky-200 uppercase backdrop-blur-sm">
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
                                    <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-4 0V7" />
                                    <path d="M18 14H8M15 18H8M8 6h8" />
                                </svg>
                                Berita &amp; Info
                            </span>

                            <h1 className="mt-4 text-[28px] leading-[1.05] font-extrabold tracking-tight text-white drop-shadow-sm sm:text-[38px] md:text-[44px] lg:text-[48px]">
                                {berita.title}
                            </h1>

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
                                        <path d="m12 19 7-7-7-7M5 19l7-7-7-7" />
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
                                <span className="text-white">Berita</span>
                            </nav>
                        </div>
                    </div>
                </section>

                <div className="mx-auto w-full max-w-7xl px-5 py-12 sm:px-8 sm:py-16 md:px-10 lg:px-14">
                    <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_340px]">
                        <article className="min-w-0">
                            <div className="overflow-hidden rounded-3xl bg-white shadow-xl shadow-sky-100/70">
                                <div className="h-2.5 bg-gradient-to-r from-[#075985] via-[#0284c7] to-[#38bdf8]" />

                                {berita.image_url ? (
                                    <div className="relative">
                                        <img
                                            src={berita.image_url}
                                            alt={berita.title}
                                            className="aspect-[16/9] w-full object-cover"
                                        />
                                    </div>
                                ) : (
                                    <div className="flex aspect-[16/9] w-full items-center justify-center bg-gradient-to-br from-[#e0f2fe] via-[#bae6fd] to-[#7dd3fc]">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-20 w-20 text-[#075985]/40"
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

                                <div className="px-6 py-8 sm:px-10 sm:py-10">
                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                                        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#075985]/10 px-3 py-1 text-[11px] font-bold tracking-wide text-[#075985] uppercase">
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
                                                <rect
                                                    width="18"
                                                    height="18"
                                                    x="3"
                                                    y="4"
                                                    rx="2"
                                                />
                                                <path d="M16 2v4M8 2v4M3 10h18" />
                                            </svg>
                                            {formatDate()}
                                        </span>

                                        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#075985] uppercase">
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
                                                <circle cx="12" cy="8" r="4" />
                                                <path d="M5 21a7 7 0 0 1 14 0" />
                                            </svg>
                                            RS Merdeka
                                        </span>
                                    </div>

                                    <div className="mt-6">
                                        {bodyText ? (
                                            <div
                                                className="prose-slate max-w-none space-y-4 text-[15px] leading-7 break-words text-slate-600 [&_a]:text-[#075985] [&_a]:underline [&_blockquote]:my-4 [&_blockquote]:rounded-r-2xl [&_blockquote]:border-l-4 [&_blockquote]:border-[#0284c7] [&_blockquote]:bg-[#f0f9ff] [&_blockquote]:px-5 [&_blockquote]:py-4 [&_blockquote]:italic [&_h1]:mb-3 [&_h1]:text-2xl [&_h1]:font-extrabold [&_h1]:text-slate-900 [&_h2]:mb-3 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-slate-900 [&_h3]:mb-2 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-slate-900 [&_img]:my-4 [&_img]:h-auto [&_img]:max-w-full [&_img]:rounded-xl [&_ol]:my-3 [&_ol]:list-decimal [&_ol]:pl-5 [&_ul]:my-3 [&_ul]:list-disc [&_ul]:pl-5"
                                                dangerouslySetInnerHTML={{
                                                    __html: bodyText,
                                                }}
                                            />
                                        ) : (
                                            <p className="text-slate-500">
                                                Tidak ada isi berita.
                                            </p>
                                        )}
                                    </div>

                                    <div className="mt-10 flex items-center justify-between gap-4 border-t border-slate-100 pt-6">
                                        <Link
                                            href="/"
                                            className="inline-flex items-center gap-2 text-sm font-semibold text-[#075985] transition hover:gap-3 hover:text-[#0284c7]"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-4 w-4"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                            >
                                                <path d="M19 12H5M11 18l-6-6 6-6" />
                                            </svg>
                                            Kembali ke Beranda
                                        </Link>

                                        <Link
                                            href="#berita-lainnya"
                                            className="inline-flex items-center gap-2 text-sm font-semibold text-[#075985] transition hover:gap-3 hover:text-[#0284c7]"
                                        >
                                            Berita Lainnya
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
                                </div>
                            </div>
                        </article>

                        <aside className="lg:sticky lg:top-24 lg:self-start">
                            <div className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm">
                                <div className="h-2 bg-gradient-to-r from-[#075985] via-[#0284c7] to-[#38bdf8]" />

                                <div className="p-6">
                                    <div className="flex items-center gap-2.5">
                                        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#075985]/10 text-[#075985]">
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
                                                <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-4 0V7" />
                                                <path d="M18 14H8M15 18H8M8 6h8" />
                                            </svg>
                                        </span>
                                        <h3 className="text-base font-extrabold text-slate-900">
                                            Berita Lainnya
                                        </h3>
                                    </div>

                                    <div
                                        id="berita-lainnya"
                                        className="mt-4 space-y-4"
                                    >
                                        {related.length === 0 ? (
                                            <p className="rounded-2xl bg-slate-50 px-4 py-6 text-center text-[13px] text-slate-400">
                                                Belum ada berita lainnya.
                                            </p>
                                        ) : (
                                            related.slice(0, 4).map((item) => (
                                                <Link
                                                    key={item.id}
                                                    href={`/berita/${item.slug}`}
                                                    className="group flex gap-3"
                                                >
                                                    <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-[#075985]/10">
                                                        {item.image_url ? (
                                                            <img
                                                                src={
                                                                    item.image_url
                                                                }
                                                                alt={item.title}
                                                                className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                                                            />
                                                        ) : (
                                                            <div className="flex h-full w-full items-center justify-center">
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    className="h-6 w-6 text-[#075985]/40"
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
                                                    </div>

                                                    <div className="min-w-0">
                                                        <h4 className="line-clamp-2 text-[13px] leading-snug font-semibold text-slate-800 transition group-hover:text-[#075985]">
                                                            {item.title}
                                                        </h4>
                                                        <p className="mt-1 line-clamp-1 text-[11px] text-slate-400">
                                                            {stripHtml(
                                                                item.description,
                                                            ).slice(0, 60) ||
                                                                '-'}
                                                        </p>
                                                    </div>
                                                </Link>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>
            </main>
        </>
    );
}
