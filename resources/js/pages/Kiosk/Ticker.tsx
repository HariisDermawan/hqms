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

const POLITab = () => (
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

            <div className="flex min-h-screen flex-col bg-gradient-to-b from-[#eef4fb] to-[#f8fafc]">
                {/* NAVBAR */}
                <header className="flex items-center justify-between bg-[#07577f] px-8 py-5 text-white shadow-lg shadow-[#07577f]/20">
                    <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
                            <TickerTab />
                        </div>

                        <div>
                            <h1 className="text-2xl font-black tracking-tight">
                                Rs Merdeka
                            </h1>

                            <p className="mt-0.5 text-[12px] tracking-wide text-white/60">
                                Sistem Antrean Mandiri
                            </p>
                        </div>
                    </div>

                    {view === 'polis' && (
                        <div className="text-right text-[12px] text-white/70">
                            <p>
                                Silakan pilih poliklinik untuk mengambil nomor
                                antrean
                            </p>
                        </div>
                    )}
                </header>

                <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-6 py-10">
                    {view === 'ticket' ? (
                        <div className="animate-fade-in-up flex flex-1 flex-col items-center justify-center text-center">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                                <CheckTab />
                            </div>

                            <p className="mt-6 text-sm font-semibold tracking-[0.2em] text-gray-400 uppercase">
                                Nomor Antrean Anda
                            </p>

                            <div className="mt-6 rounded-3xl border-4 border-[#07577f]/10 bg-white px-10 py-6 shadow-xl sm:px-16">
                                <p className="text-[72px] leading-none font-black tracking-tight text-[#07577f] sm:text-[96px]">
                                    {ticket}
                                </p>
                            </div>

                            <p className="mt-6 text-sm text-gray-500">
                                Silakan menunggu untuk dipanggil di layar
                                pemanggilan.
                            </p>
                        </div>
                    ) : view === 'polis' ? (
                        <div className="animate-fade-in-up flex flex-1 flex-col">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-[12px] font-semibold tracking-[0.18em] text-[#07577f] uppercase">
                                        Poliklinik
                                    </p>

                                    <h2 className="mt-1 text-2xl font-black text-gray-800">
                                        Pilih Poliklinik
                                    </h2>
                                </div>

                                <button
                                    type="button"
                                    onClick={backHome}
                                    className="inline-flex h-11 items-center gap-1.5 rounded-full bg-white px-5 text-[13px] font-semibold text-gray-600 shadow-md transition hover:bg-gray-50"
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
                                    <div className="rounded-3xl bg-white p-14 text-center text-sm text-gray-400 shadow-md">
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
                                                    className="group flex flex-col overflow-hidden rounded-3xl border border-gray-100 bg-white text-left shadow-md transition hover:-translate-y-1 hover:shadow-xl active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                                                >
                                                    <div
                                                        className={`flex h-16 items-center justify-center bg-gradient-to-r ${accent} text-white`}
                                                    >
                                                        <POLITab />
                                                    </div>

                                                    <div className="flex flex-1 flex-col p-5">
                                                        <div className="flex items-start justify-between">
                                                            <span className="text-[12px] font-bold tracking-widest text-[#07577f]">
                                                                {poli.queue_prefix ??
                                                                    poli.code}
                                                            </span>

                                                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-[#07577f] transition group-hover:bg-[#07577f] group-hover:text-white">
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
                                                            </span>
                                                        </div>

                                                        <p className="mt-2 text-lg font-bold text-gray-800">
                                                            {poli.name}
                                                        </p>

                                                        {poli.description && (
                                                            <p className="mt-1 line-clamp-2 text-[12px] text-gray-400">
                                                                {
                                                                    poli.description
                                                                }
                                                            </p>
                                                        )}
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="relative flex flex-1 flex-col items-center justify-center overflow-hidden text-center">
                            <div className="pointer-events-none absolute -top-10 -left-16 h-64 w-64 rounded-full bg-[#07577f]/10 blur-2xl" />
                            <div className="pointer-events-none absolute -right-16 -bottom-10 h-64 w-64 rounded-full bg-emerald-500/10 blur-2xl" />

                            <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-[#07577f] text-white shadow-xl shadow-[#07577f]/30">
                                <TickerTab />
                            </div>

                            <p className="mt-6 text-[13px] font-semibold tracking-[0.22em] text-[#07577f] uppercase">
                                Selamat Datang di
                            </p>

                            <h1 className="mt-2 text-4xl font-black tracking-tight text-gray-800 sm:text-6xl">
                                Rs Merdeka
                            </h1>

                            <p className="mt-2 text-lg font-semibold tracking-[0.18em] text-gray-400 uppercase">
                                Ambil Nomor Antrian
                            </p>

                            <button
                                type="button"
                                onClick={goPolis}
                                className="mt-10 inline-flex h-16 items-center gap-3 rounded-full bg-gradient-to-r from-[#07577f] to-[#0a8fd4] px-12 text-lg font-bold text-white shadow-xl shadow-[#07577f]/30 transition hover:-translate-y-0.5 hover:shadow-2xl active:scale-[0.98]"
                            >
                                <TickerTab />

                                <span>Ambil Antrian</span>
                            </button>
                        </div>
                    )}
                </main>

                <footer className="bg-gradient-to-r from-[#07577f] to-[#0a8fd4] px-8 py-4 text-center text-[12px] text-white/80">
                    © {new Date().getFullYear()} Rs Merdeka — Management System
                    · Jl. Merdeka No. 1
                </footer>
            </div>
        </>
    );
}
