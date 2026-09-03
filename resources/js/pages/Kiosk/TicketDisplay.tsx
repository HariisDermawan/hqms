import { Head } from '@inertiajs/react';
import { useEffect, useRef, useState, type ReactNode } from 'react';

import { getNowServing, type NowServingItem } from '@/api/kiosk';

const DIGIT_WORDS: Record<string, string> = {
    '0': 'nol',
    '1': 'satu',
    '2': 'dua',
    '3': 'tiga',
    '4': 'empat',
    '5': 'lima',
    '6': 'enam',
    '7': 'tujuh',
    '8': 'delapan',
    '9': 'sembilan',
};

const readDigits = (value: string | number): string =>
    String(value)
        .split('')
        .map((char) => DIGIT_WORDS[char] ?? char)
        .join(' ');

const announceCall = (item: NowServingItem) => {
    const audio = new Audio('/audio/bel1.mp3');

    const speak = () => {
        const match = /^([A-Za-z])-(\d+)$/.exec(item.queue_number);
        const prefix = match?.[1] ?? item.queue_number;
        const digits = match?.[2] ?? item.queue_number;

        const loket = item.loket ?? 1;

        const text = `Nomor ${prefix} ${readDigits(
            digits,
        )}, silahkan ke loket ${readDigits(loket)}`;

        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'id-ID';
        utterance.rate = 0.95;
        utterance.pitch = 1;
        window.speechSynthesis.speak(utterance);
    };

    audio.play().catch(() => {
        speak();
    });

    audio.onended = () => {
        speak();
    };

    const fallback = window.setTimeout(() => {
        speak();
    }, 4500);
    audio.addEventListener('ended', () => window.clearTimeout(fallback), {
        once: true,
    });
    audio.addEventListener('error', () => window.clearTimeout(fallback), {
        once: true,
    });
};

const STEPS: {
    label: string;
    description: string;
    icon: ReactNode;
}[] = [
    {
        label: 'Ambil Nomor Antrean',
        description: 'Ketik nomor antrean di layar kiosk',
        icon: (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <path d="M14 2v6h6" />
                <path d="M8 17h.01M12 17h.01M16 17h.01" />
            </svg>
        ),
    },
    {
        label: 'Pilih Poliklinik',
        description: 'Tentukan poli tujuan kunjungan',
        icon: (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <path d="M12 22s8-4 8-10a8 8 0 1 0-16 0c0 6 8 10 8 10z" />
                <path d="M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
            </svg>
        ),
    },
    {
        label: 'Menunggu Dipanggil',
        description: 'Pantau monitor antrean',
        icon: (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
        ),
    },
    {
        label: 'Dilayani Petugas',
        description: 'Kunjungan diproses oleh petugas',
        icon: (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <path d="M20 6L9 17l-5-5" />
            </svg>
        ),
    },
];

const CONTACTS: { icon: ReactNode; label: string }[] = [
    {
        label: '(021) 1234-5678',
        icon: (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 shrink-0 text-white"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
        ),
    },
    {
        label: 'info@rsmerdeka.co.id',
        icon: (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 shrink-0 text-white"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="m22 7-10 5L2 7" />
            </svg>
        ),
    },
    {
        label: 'Jl. Merdeka No. 1, Jakarta',
        icon: (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 shrink-0 text-white"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                <circle cx="12" cy="10" r="3" />
            </svg>
        ),
    },
    {
        label: 'www.rsmerdeka.co.id',
        icon: (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 shrink-0 text-white"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <circle cx="12" cy="12" r="10" />
                <path d="M2 12h20" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
        ),
    },
];

export default function KioskTicketDisplay() {
    const [nowServing, setNowServing] = useState<NowServingItem[]>([]);
    const [clock, setClock] = useState(() => new Date());
    const announcedIds = useRef<Set<number>>(new Set());

    const loadNowServing = async () => {
        try {
            const response = await getNowServing();
            const items = response.data?.items ?? [];

            items.forEach((item) => {
                if (
                    item.status === 'called' &&
                    !announcedIds.current.has(item.id)
                ) {
                    announcedIds.current.add(item.id);
                    announceCall(item);
                }
            });

            setNowServing(items);
        } catch (error) {
            console.error('Gagal memuat antrean dipanggil', error);
        }
    };

    useEffect(() => {
        void loadNowServing();

        const interval = window.setInterval(() => {
            void loadNowServing();
        }, 2_500);

        const clockInterval = window.setInterval(() => {
            setClock(new Date());
        }, 1_000);

        return () => {
            window.clearInterval(interval);
            window.clearInterval(clockInterval);
        };
    }, []);

    const activeServing = nowServing
        .filter((item) => item.status === 'serving' || item.status === 'called')
        .slice()
        .sort((a, b) => {
            if (a.status === 'serving' && b.status !== 'serving') {
                return -1;
            }

            if (b.status === 'serving' && a.status !== 'serving') {
                return 1;
            }

            const aTime = a.called_at ? new Date(a.called_at).getTime() : 0;
            const bTime = b.called_at ? new Date(b.called_at).getTime() : 0;

            return bTime - aTime;
        });

    const mainServing = activeServing[0] ?? null;

    const byLoket = new Map<number, NowServingItem>();
    activeServing.forEach((item) => {
        if (item.loket && !byLoket.has(item.loket)) {
            byLoket.set(item.loket, item);
        }
    });

    const lokets = [1, 2, 3].map((number) => ({
        number,
        ticket: byLoket.get(number) ?? null,
    }));

    return (
        <>
            <Head title="Pemanggilan Antrean" />

            <div className="flex h-screen flex-col bg-slate-100 text-slate-900">
                {/* TOP BAR: LOGO + CLOCK (blended, not a navbar bar) */}
                <div className="flex shrink-0 items-center justify-between px-6 pt-5">
                    <div className="flex items-center gap-2.5">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#07577f] text-white shadow-sm">
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
                                <path d="M3 21h18" />
                                <path d="M5 21V7l7-4 7 4v14" />
                                <path d="M9 21v-6h6v6" />
                                <path d="M9 11h.01M15 11h.01" />
                            </svg>
                        </div>

                        <div>
                            <h1 className="text-xl font-black tracking-tight text-[#07577f]">
                                Rs Merdeka
                            </h1>

                            <p className="mt-0.5 text-[11px] tracking-wide text-slate-500">
                                Sistem Informasi Antrean
                            </p>
                        </div>
                    </div>

                    <div className="text-right">
                        <p className="text-2xl font-black tracking-tight text-slate-900 tabular-nums">
                            {clock.toLocaleTimeString('id-ID', {
                                hour: '2-digit',
                                minute: '2-digit',
                                second: '2-digit',
                            })}
                        </p>

                        <p className="mt-0.5 text-[11px] font-medium tracking-wide text-slate-500 uppercase">
                            {clock.toLocaleDateString('id-ID', {
                                weekday: 'long',
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric',
                            })}
                        </p>
                    </div>
                </div>

                {/* BODY */}
                <div className="flex flex-1 gap-5 overflow-hidden p-5">
                    {/* LEFT COLUMN: VIDEO + FOOTER */}
                    <div className="flex min-w-0 flex-1 flex-col gap-5">
                        {/* VIDEO PUBLIC */}
                        <div className="relative w-full overflow-hidden bg-black shadow-md ring-1 ring-slate-200">
                            <video
                                className="relative block max-h-[78vh] w-full object-contain"
                                src="/video/intro.mp4"
                                autoPlay
                                muted
                                loop
                                playsInline
                                preload="auto"
                            />

                            <div className="absolute right-0 bottom-0 left-0 h-40 bg-gradient-to-t from-black/70 to-transparent" />
                        </div>

                        {/* FOOTER STEPS */}
                        <div className="flex shrink-0 items-center justify-between gap-4 rounded-2xl bg-white px-5 py-5 shadow-sm ring-1 ring-slate-200">
                            {STEPS.map((step) => (
                                <div
                                    key={step.label}

                                    className="flex flex-1 items-center gap-3"
                                >
                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#07577f] text-white">
                                        {step.icon}
                                    </div>

                                    <div className="min-w-0">
                                        <p className="text-[13px] font-bold text-slate-900">
                                            {step.label}
                                        </p>

                                        <p className="mt-0.5 truncate text-[11px] text-slate-500">
                                            {step.description}
                                        </p>
                                    </div>

                                    {step !== STEPS[STEPS.length - 1] && (
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"

                                            className="ml-2 h-5 w-5 shrink-0 text-slate-300"

                                            viewBox="0 0 24 24"

                                            fill="none"

                                            stroke="currentColor"

                                            strokeWidth="2"
                                        >
                                            <path d="M9 18l6-6-6-6" />
                                        </svg>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                    {/* END LEFT COLUMN */}

                    {/* RIGHT PANEL */}
                    <div className="flex w-[430px] shrink-0 flex-col gap-5 overflow-hidden">
                        {/* SEDANG DIPANGGIL */}
                        <div className="flex shrink-0 flex-col rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
                            <div className="flex items-center gap-2">
                                <span className="relative flex h-2.5 w-2.5">
                                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
                                </span>

                                <p className="text-[12px] font-bold tracking-[0.18em] text-slate-500 uppercase">
                                    NOMER ANTRIAN
                                </p>
                            </div>

                            {mainServing ? (
                                <div className="mt-4 overflow-hidden rounded-2xl bg-gradient-to-br from-[#07577f] to-[#0a4d78] p-5 text-center text-white shadow-2xl">
                                    <p className="text-[11px] font-semibold tracking-widest text-white/70 uppercase">
                                        {mainServing.poli?.name ?? 'Poli'}
                                    </p>

                                    <p className="mt-3 text-6xl font-black tracking-tight drop-shadow">
                                        {mainServing.queue_number}
                                    </p>

                                    <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-sm font-bold">
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
                                            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                                            <circle cx="12" cy="10" r="3" />
                                        </svg>
                                        Di Loket {mainServing.loket ?? 1}
                                    </p>

                                    {mainServing.pasien && (
                                        <p className="mt-3 text-sm text-white/80">
                                            {mainServing.pasien.name}
                                        </p>
                                    )}
                                </div>
                            ) : (
                                <div className="mt-4 flex h-40 flex-col items-center justify-center gap-2 rounded-2xl bg-slate-50">
                                    <p className="text-center text-2xl font-black tracking-widest text-slate-400 uppercase">
                                        Belum ada panggilan
                                    </p>

                                    <p className="text-center text-base tracking-[0.5em] text-slate-300">
                                        - - -
                                    </p>

                                    <p className="text-center text-sm text-slate-400">
                                        Menunggu Panggilan
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* LOKET CARDS */}
                        <div className="grid shrink-0 grid-cols-3 gap-3">
                            {lokets.map(({ number, ticket }) => (
                                <div
                                    key={number}
                                    className={`flex flex-col items-center rounded-2xl p-4 text-center shadow-sm ring-1 ${
                                        ticket
                                            ? 'bg-gradient-to-b from-[#07577f] to-[#0a4d78] text-white ring-slate-200'
                                            : 'bg-white ring-slate-200'
                                    }`}
                                >
                                    <p
                                        className={`text-[10px] font-bold tracking-[0.14em] uppercase ${ticket ? 'text-white/60' : 'text-slate-400'}`}
                                    >
                                        Loket
                                    </p>

                                    <p
                                        className={`mt-1 text-3xl font-black ${ticket ? 'text-white' : 'text-slate-900'}`}
                                    >
                                        {number}
                                    </p>

                                    <div
                                        className={`mt-3 h-px w-full ${ticket ? 'bg-white/15' : 'bg-slate-100'}`}
                                    />

                                    {ticket ? (
                                        <>
                                            <p className="mt-3 text-2xl font-black tracking-tight">
                                                {ticket.queue_number}
                                            </p>

                                            <span
                                                className={`mt-2 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${
                                                    ticket.status === 'serving'
                                                        ? 'bg-emerald-500/25 text-emerald-100'
                                                        : 'bg-white/15 text-white/80'
                                                }`}
                                            >
                                                {ticket.status === 'serving'
                                                    ? 'Dilayani'
                                                    : 'Dipanggil'}
                                            </span>
                                        </>
                                    ) : (
                                        <p className="mt-3 text-[11px] text-slate-300">
                                            -
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* RIWAYAT ANTRIAN TERAKHIR */}
                        <div className="min-h-0 flex-1 overflow-hidden rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
                            <p className="text-[12px] font-bold tracking-[0.18em] text-slate-500 uppercase">
                                Riwayat Antrian Terakhir
                            </p>

                            {activeServing.length > 0 ? (
                                <div className="mt-4 max-h-full space-y-3 overflow-y-auto pr-1">
                                    {[...activeServing]
                                        .slice(0, 5)
                                        .map((item, index) => (
                                            <div
                                                key={`${item.queue_number}-${index}`}
                                                className={`flex items-center justify-between rounded-xl px-4 py-3 ${
                                                    item.status === 'serving'
                                                        ? 'bg-emerald-50'
                                                        : 'bg-slate-50'
                                                }`}
                                            >
                                                <div>
                                                    <p className="text-lg font-black tracking-tight text-slate-900">
                                                        {item.queue_number}
                                                    </p>

                                                    <p className="text-[11px] text-slate-500">
                                                        {item.poli?.name ??
                                                            'Poli'}
                                                    </p>
                                                </div>

                                                {item.loket && (
                                                    <span className="rounded-full bg-[#07577f]/10 px-3 py-1 text-[11px] font-bold text-[#07577f]">
                                                        Loket {item.loket}
                                                    </span>
                                                )}
                                            </div>
                                        ))}
                                </div>
                            ) : (
                                <div className="mt-4 flex h-full flex-col items-center justify-center gap-1 rounded-xl bg-slate-50">
                                    <p className="text-base font-extrabold tracking-widest text-slate-400 uppercase">
                                        Belum ada panggilan
                                    </p>

                                    <p className="text-sm tracking-[0.5em] text-slate-300">
                                        - - -
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <footer className="flex w-full shrink-0 items-center gap-4 bg-[#07577f] px-6 py-4">
                    <button
                        type="button"
                        className="flex shrink-0 items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-bold text-[#07577f] shadow-sm"
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
                            <circle cx="12" cy="12" r="10" />
                            <path d="M12 6v6l4 2" />
                        </svg>
                        Layanan 24 Jam
                    </button>

                    <div className="relative flex-1 overflow-hidden">
                        <div className="animate-marquee flex w-max items-center">
                            {[...CONTACTS, ...CONTACTS].map(
                                (contact, index) => (
                                    <span
                                        key={index}
                                        className="flex shrink-0 items-center gap-2 px-6"
                                    >
                                        {contact.icon}

                                        <span className="text-sm font-medium whitespace-nowrap text-white">
                                            {contact.label}
                                        </span>
                                    </span>
                                ),
                            )}
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
