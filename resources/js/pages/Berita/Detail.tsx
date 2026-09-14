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
    const [copied, setCopied] = useState(false);

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

    const shareUrl =
        (typeof window !== 'undefined' ? window.location.origin : '') +
        `/berita/${berita.slug}`;

    const shareText = `${berita.title} - RS Merdeka`;

    const shareLinks = {
        whatsapp: `https://wa.me/?text=${encodeURIComponent(`${shareText}: ${shareUrl}`)}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
        twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`,
        telegram: `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`,
    };

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 2000);
        } catch {
            // fallback untuk browser lama
            const input = document.createElement('input');
            input.value = shareUrl;
            document.body.appendChild(input);
            input.select();
            document.execCommand('copy');
            document.body.removeChild(input);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 2000);
        }
    };

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
                            <div className="space-y-6">
                                {/* BAGIKAN */}
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
                                                    <circle
                                                        cx="18"
                                                        cy="5"
                                                        r="3"
                                                    />
                                                    <circle
                                                        cx="6"
                                                        cy="12"
                                                        r="3"
                                                    />
                                                    <circle
                                                        cx="18"
                                                        cy="19"
                                                        r="3"
                                                    />
                                                    <path d="m8.59 13.51 6.83 3.98M15.41 6.51l-6.82 3.98" />
                                                </svg>
                                            </span>
                                            <h3 className="text-base font-extrabold text-slate-900">
                                                Bagikan
                                            </h3>
                                        </div>

                                        <p className="mt-1 text-[11px] text-slate-400">
                                            Bagikan berita ini ke teman Anda.
                                        </p>

                                        <div className="mt-4 flex items-center gap-2">
                                            <a
                                                href={shareLinks.whatsapp}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                title="WhatsApp"
                                                className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#25D366]/10 text-[#1da851] transition hover:-translate-y-0.5 hover:bg-[#25D366]/20"
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-[18px] w-[18px]"
                                                    viewBox="0 0 24 24"
                                                    fill="currentColor"
                                                >
                                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413" />
                                                </svg>
                                            </a>

                                            <a
                                                href={shareLinks.facebook}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                title="Facebook"
                                                className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#1877f2]/10 text-[#1170e0] transition hover:-translate-y-0.5 hover:bg-[#1877f2]/20"
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-[18px] w-[18px]"
                                                    viewBox="0 0 24 24"
                                                    fill="currentColor"
                                                >
                                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                                </svg>
                                            </a>

                                            <a
                                                href={shareLinks.twitter}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                title="X (Twitter)"
                                                className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900/10 text-slate-800 transition hover:-translate-y-0.5 hover:bg-slate-900/20"
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-4 w-4"
                                                    viewBox="0 0 24 24"
                                                    fill="currentColor"
                                                >
                                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                                </svg>
                                            </a>

                                            <a
                                                href={shareLinks.telegram}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                title="Telegram"
                                                className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#229ED9]/10 text-[#1d8fc4] transition hover:-translate-y-0.5 hover:bg-[#229ED9]/20"
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-4 w-4"
                                                    viewBox="0 0 24 24"
                                                    fill="currentColor"
                                                >
                                                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                                                </svg>
                                            </a>

                                            <button
                                                type="button"
                                                onClick={handleCopyLink}
                                                title="Salin Link"
                                                className="flex h-9 items-center justify-center gap-1.5 rounded-xl bg-[#075985]/10 px-3 text-[11px] font-bold text-[#075985] transition hover:-translate-y-0.5 hover:bg-[#075985]/20"
                                            >
                                                {copied ? (
                                                    <>
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            className="h-3.5 w-3.5 text-green-600"
                                                            viewBox="0 0 24 24"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            strokeWidth="2.5"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                        >
                                                            <path d="M20 6 9 17l-5-5" />
                                                        </svg>
                                                        Tersalin!
                                                    </>
                                                ) : (
                                                    <>
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
                                                            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                                                            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                                                        </svg>
                                                        Salin Link
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* BERITA LAINNYA */}
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
                                                related
                                                    .slice(0, 4)
                                                    .map((item) => (
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
                                                                        alt={
                                                                            item.title
                                                                        }
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
                                                                    ).slice(
                                                                        0,
                                                                        60,
                                                                    ) || '-'}
                                                                </p>
                                                            </div>
                                                        </Link>
                                                    ))
                                            )}
                                        </div>
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
