import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { getKioskPolis, storeKioskTicket, type KioskPoli } from '@/api/kiosk';

type View = 'home' | 'polis' | 'ticket';

const TICKET_DISMISS_MS = 5_000;

const POLI_ICON_MAP: { keywords: string[]; src: string }[] = [
    { keywords: ['gigi', 'mulut'], src: '/icons/Gigi.svg' },
    { keywords: ['mata'], src: '/icons/iconDok2.svg' },
    { keywords: ['jantung'], src: '/icons/iconDok3.svg' },
    { keywords: ['umum'], src: '/icons/iconDok1.svg' },
    { keywords: ['anak'], src: '/icons/iconDok1.svg' },
];

const PoliIcon = ({
    name,
    imageUrl,
}: {
    name: string;
    imageUrl?: string | null;
}) => {
    const n = name.toLowerCase();
    const match = POLI_ICON_MAP.find((entry) =>
        entry.keywords.some((keyword) => n.includes(keyword)),
    );

    if (imageUrl) {
        return (
            <img
                src={imageUrl}
                alt={name}
                className="h-12 w-12 object-contain"
            />
        );
    }

    return (
        <img
            src={match?.src ?? '/icons/iconDok1.svg'}
            alt={name}
            className="h-12 w-12 object-contain"
        />
    );
};

const TickerTab = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-7 w-7"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
    >
        <circle cx="12" cy="12" r="8.5" />
        <path d="M12 7v5l3 2" />
    </svg>
);

const CheckTab = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-7 w-7"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
    >
        <path d="M20 6L9 17l-5-5" />
    </svg>
);

export default function KioskTicker() {
    const [view, setView] = useState<View>('home');
    const [polis, setPolis] = useState<KioskPoli[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [busy, setBusy] = useState(false);
    const [ticket, setTicket] = useState<string | null>(null);

    const loadPolis = async () => {
        try {
            setLoading(true);

            const response = await getKioskPolis();

            setPolis(response.data?.items ?? []);
            setError('');
        } catch (err: any) {
            console.error('Gagal memuat poli', err);

            setError(
                err.response?.data?.message || 'Gagal mengambil daftar poli.',
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (view === 'polis') {
            void loadPolis();
        }
    }, [view]);

    const goPolis = () => {
        setError('');
        setView('polis');
    };

    const backHome = () => {
        setView('home');
        setError('');
    };

    const handlePick = async (poli: KioskPoli) => {
        try {
            setBusy(true);

            const response = await storeKioskTicket(poli.id);

            setTicket(response.data?.antrian?.queue_number ?? null);
            setError('');
            setView('ticket');
        } catch (err: any) {
            console.error('Gagal membuat tiket', err);

            setError(
                err.response?.data?.message || 'Gagal membuat nomor antrean.',
            );
        } finally {
            setBusy(false);
        }
    };

    useEffect(() => {
        if (view !== 'ticket') {
            return;
        }

        const timer = window.setTimeout(() => {
            setView('home');
            setTicket(null);
        }, TICKET_DISMISS_MS);

        return () => window.clearTimeout(timer);
    }, [view, ticket]);

    return (
        <>
            <Head title="Ambil Antrian" />

            <div className="relative flex min-h-screen flex-col overflow-hidden bg-slate-100 text-slate-900">
                <div className="relative z-10 flex items-center px-8 py-6 sm:px-12">
                    <img
                        src="/assets/LG2.png"
                        alt="Logo RS Merdeka"
                        className="h-16 w-auto object-contain"
                    />
                </div>

                <main className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col px-6 py-6 sm:px-8">
                    {view === 'ticket' ? (
                        <div className="animate-fade-in-up -mt-20 flex flex-1 flex-col items-center justify-center text-center">
                            <img
                                src="/assets/LG2.png"
                                alt="Logo RS Merdeka"
                                className="-mt-8 h-36 w-auto object-contain sm:h-44"
                            />

                            <p className="mt-6 text-sm font-bold tracking-[0.22em] text-[#07577f] uppercase">
                                Nomor Antrean Anda
                            </p>

                            <div className="relative mt-6 w-full max-w-md overflow-hidden rounded-3xl bg-gradient-to-br from-[#07577f] to-[#0a8fd4] px-10 py-12 text-center text-white shadow-2xl sm:px-16">
                                <p className="relative text-[13px] font-semibold tracking-[0.3em] text-white/70 uppercase">
                                    Antrian Anda
                                </p>

                                <p className="relative mt-3 text-8xl leading-none font-black tracking-tight drop-shadow sm:text-[104px]">
                                    {ticket?.split('-')[1] ?? ticket}
                                </p>

                                <p className="relative mt-4 text-sm font-semibold text-white/85">
                                    {ticket}
                                </p>
                            </div>

                            <div className="mt-7 inline-flex items-center gap-2.5 rounded-full bg-emerald-50 px-5 py-2.5 text-sm font-semibold text-emerald-700 ring-1 ring-emerald-200">
                                <CheckTab />

                                <span>
                                    Silakan menunggu dipanggil di layar
                                    pemanggilan
                                </span>
                            </div>
                        </div>
                    ) : view === 'polis' ? (
                        <div className="animate-fade-in-up flex flex-1 flex-col">
                            <div className="flex items-center justify-between gap-3 overflow-hidden rounded-3xl bg-gradient-to-br from-[#07577f] to-[#0a8fd4] p-6 text-white shadow-2xl sm:p-7">
                                <div className="flex min-w-0 items-center gap-4">
                                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/30 backdrop-blur">
                                        <PoliIcon name="Poliklinik" />
                                    </div>

                                    <div className="min-w-0">
                                        <p className="text-[12px] font-semibold tracking-[0.2em] text-white/70 uppercase">
                                            Poliklinik
                                        </p>

                                        <h2 className="mt-1 truncate text-2xl font-black sm:text-3xl">
                                            Pilih Poliklinik
                                        </h2>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={backHome}
                                    className="inline-flex h-11 shrink-0 items-center gap-1.5 rounded-full bg-white/15 px-5 text-[13px] font-semibold text-white ring-1 ring-white/30 transition hover:bg-white/25"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-4 w-4"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                    >
                                        <path d="M19 12H5M12 19l-7-7 7-7" />
                                    </svg>
                                    Kembali
                                </button>
                            </div>

                            {error && (
                                <div className="mt-4 rounded-[12px] bg-red-50 px-4 py-3 text-[13px] text-red-600">
                                    {error}
                                </div>
                            )}

                            <div className="mt-6">
                                {loading ? (
                                    <div className="rounded-3xl bg-white/90 p-14 text-center text-sm text-gray-500 shadow-xl">
                                        Memuat poliklinik...
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                        {polis.map((poli) => {
                                            return (
                                                <button
                                                    key={poli.id}
                                                    type="button"
                                                    disabled={busy}
                                                    onClick={() =>
                                                        handlePick(poli)
                                                    }
                                                    className="group flex flex-col items-center rounded-3xl border border-white/70 bg-white/90 p-6 text-center shadow-lg backdrop-blur transition hover:-translate-y-1 hover:border-sky-200 hover:shadow-2xl active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                                                >
                                                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-50 to-blue-100 shadow-sm ring-1 ring-sky-100 transition group-hover:scale-105">
                                                        <PoliIcon
                                                            name={poli.name}
                                                        />
                                                    </div>

                                                    <p className="mt-4 text-lg font-bold text-gray-800">
                                                        {poli.name}
                                                    </p>
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-1 flex-col items-center justify-center px-6 py-10 text-center">
                            <div className="animate-fade-in-up flex flex-col items-center">
                                <img
                                    src="/assets/LG2.png"
                                    alt="Logo RS Merdeka"
                                    className="-mt-24 h-56 w-auto object-contain sm:-mt-28 sm:h-72"
                                />

                                <p className="mt-6 text-lg font-semibold tracking-[0.18em] text-slate-500 uppercase">
                                    Ambil Nomor Antrian
                                </p>

                                <button
                                    type="button"
                                    onClick={goPolis}
                                    className="mt-10 inline-flex h-16 items-center gap-3 rounded-full bg-gradient-to-r from-[#0a8fd4] to-[#07577f] px-12 text-lg font-bold text-white shadow-xl shadow-black/40 transition hover:-translate-y-0.5 hover:shadow-2xl active:scale-[0.98]"
                                >
                                    <TickerTab />

                                    <span>Ambil Antrian</span>
                                </button>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </>
    );
}
