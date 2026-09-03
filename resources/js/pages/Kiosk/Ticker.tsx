import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { getKioskPolis, storeKioskTicket, type KioskPoli } from '@/api/kiosk';

type View = 'home' | 'polis' | 'ticket';

const TICKET_DISMISS_MS = 5_000;

const ACCENTS = [
    'from-sky-500 to-blue-600',
    'from-emerald-500 to-green-600',
    'from-amber-500 to-orange-600',
    'from-rose-500 to-pink-600',
    'from-violet-500 to-purple-600',
    'from-cyan-500 to-teal-600',
];

const PoliIcon = ({ name }: { name: string }) => {
    const n = name.toLowerCase();

    if (n.includes('anak')) {
        return (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-7 w-7"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
            >
                <circle cx="12" cy="8" r="3.5" />
                <path d="M12 14c-4.2 0-7 2.5-7 5 0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2 0-2.5-2.8-5-7-5z" />
                <path d="M5 8a7 7 0 0 1 14 0" />
            </svg>
        );
    }

    if (n.includes('gigi')) {
        return (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-7 w-7"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
            >
                <path d="M7 4c-1.5 0-3 1.5-3 3.5 0 3 1 5 2 7l1.2 4.8c.2.7 1.2.7 1.4 0l.6-2.3h1.6l.7 2.3c.2.7 1.2.7 1.4 0l1.2-4.8c1-2 2-4 2-7C17 5.5 15.5 4 14 4c-1.2 0-1.8.6-2 1.2-.3-.6-.9-1.2-2-1.2s-2 .6-3 0z" />
            </svg>
        );
    }

    if (n.includes('jantung')) {
        return (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-7 w-7"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
            >
                <path d="M12 20s-7-4.3-9-8.3C1.8 9 3 6 6 6c2 0 3 1 4 2l2 2 2-2c1-1 2-2 4-2 3 0 4.2 3 3 5.7-2 4-9 8.3-9 8.3z" />
            </svg>
        );
    }

    if (n.includes('mata')) {
        return (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-7 w-7"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
            >
                <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6z" />
                <circle cx="12" cy="12" r="3" />
            </svg>
        );
    }

    if (n.includes('umum')) {
        return (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-7 w-7"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
            >
                <path d="M3 10h3l2 7 3-13 2 9 1-3h4" />
            </svg>
        );
    }

    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-7 w-7"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
        >
            <rect x="5" y="3" width="14" height="18" rx="2" />
            <path d="M9 7h6M9 11h6M9 15h4" />
        </svg>
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
                            <div className="flex items-center justify-between gap-3 rounded-3xl bg-white/95 p-5 shadow-2xl">
                                <div className="flex min-w-0 items-center gap-4">
                                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#07577f] to-[#0a8fd4] text-white shadow-lg">
                                        <PoliIcon name="Poliklinik" />
                                    </div>

                                    <div className="min-w-0">
                                        <p className="text-[12px] font-semibold tracking-[0.18em] text-[#07577f] uppercase">
                                            Poliklinik
                                        </p>

                                        <h2 className="mt-0.5 truncate text-xl font-black text-gray-800 sm:text-2xl">
                                            Pilih Poliklinik
                                        </h2>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={backHome}
                                    className="inline-flex h-11 shrink-0 items-center gap-1.5 rounded-full bg-gray-100 px-5 text-[13px] font-semibold text-gray-600 transition hover:bg-gray-200"
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
                                        {polis.map((poli, index) => {
                                            const accent =
                                                ACCENTS[index % ACCENTS.length];

                                            return (
                                                <button
                                                    key={poli.id}
                                                    type="button"
                                                    disabled={busy}
                                                    onClick={() =>
                                                        handlePick(poli)
                                                    }
                                                    className="group flex flex-col items-center overflow-hidden rounded-3xl border border-gray-100 bg-white p-6 text-center shadow-md transition hover:-translate-y-1 hover:shadow-xl active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                                                >
                                                    <div
                                                        className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${accent} text-white shadow-lg transition group-hover:scale-105`}
                                                    >
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
