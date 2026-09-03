import { Head } from '@inertiajs/react';
import { useEffect, useState, type ReactNode } from 'react';

import { getNowServing, type NowServingItem } from '@/api/kiosk';

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

export default function KioskTicketDisplay() {
    const [nowServing, setNowServing] = useState<NowServingItem[]>([]);
    const [clock, setClock] = useState(() => new Date());

    const loadNowServing = async () => {
        try {
            const response = await getNowServing();
            setNowServing(response.data?.items ?? []);
        } catch (error) {
            console.error('Gagal memuat antrean dipanggil', error);
        }
    };

    useEffect(() => {
        void loadNowServing();

        const interval = window.setInterval(() => {
            void loadNowServing();
        }, 4_000);

        const clockInterval = window.setInterval(() => {
            setClock(new Date());
        }, 1_000);

        return () => {
            window.clearInterval(interval);
            window.clearInterval(clockInterval);
        };
    }, []);

    const activeServing = nowServing
        .filter(
            (item) =>
                item.status === 'serving' || item.status === 'called',
        )
        .sort((a, b) => {
            if (
                a.status === 'serving' &&
                b.status !== 'serving'
            ) {
                return -1;
            }

            if (
                b.status === 'serving' &&
                a.status !== 'serving'
            ) {
                return 1;
            }

            return 0;
        });

    return (
        <>
            <Head title="Pemanggilan Antrean" />

            <div className="flex h-screen flex-col bg-[#0f172a] text-white">

                {/* NAVBAR */}
                <header className="flex items-center justify-between bg-[#07577f] px-8 py-4">
                    <div>
                        <h1 className="text-2xl font-black tracking-tight">
                            Rs Merdeka
                        </h1>

                        <p className="mt-0.5 text-[11px] tracking-wide text-white/60">
                            Sistem Informasi Antrean
                        </p>
                    </div>

                    <div className="text-center">
                        <p className="text-2xl font-bold tabular-nums">
                            {clock.toLocaleTimeString('id-ID', {
                                hour: '2-digit',
                                minute: '2-digit',
                                second: '2-digit',
                            })}
                        </p>

                        <p className="mt-0.5 text-[11px] tracking-wide text-white/60 uppercase">
                            {clock.toLocaleDateString('id-ID', {
                                weekday: 'long',
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric',
                            })}
                        </p>
                    </div>
                </header>

                {/* BODY */}
                <div className="flex flex-1 gap-6 overflow-hidden p-6">

                    {/* VIDEO PUBLIC */}
                    <div className="relative flex-1 overflow-hidden rounded-2xl bg-black">
                        <video
                            className="absolute inset-0 h-full w-full object-cover"
                            src="/video/intro.mp4"
                            autoPlay
                            muted
                            loop
                            playsInline
                            preload="auto"
                        />
                    </div>

                    {/* NOW SERVING */}
                    <div className="flex w-[420px] shrink-0 flex-col rounded-2xl bg-[#1e293b] p-6">
                        <p className="text-[12px] font-semibold tracking-[0.18em] text-white/50 uppercase">
                            Sedang Dipanggil
                        </p>

                        <div className="mt-4 flex-1 space-y-3 overflow-y-auto">
                            {activeServing.length === 0 ? (
                                <p className="mt-20 text-center text-sm text-white/40">
                                    Belum ada pasien dipanggil
                                </p>
                            ) : (
                                activeServing.map((item, index) => (
                                    <div
                                        key={`${item.queue_number}-${index}`}
                                        className={`rounded-xl p-4 text-center ${item.status === 'serving'
                                            ? 'bg-emerald-700'
                                            : 'bg-[#07577f]'
                                            }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <p className="text-[11px] font-semibold tracking-widest text-white/70 uppercase">
                                                {item.poli?.name ?? 'Poli'}
                                            </p>

                                            <span className="rounded-md bg-white/15 px-2 py-0.5 text-[10px] font-bold uppercase">
                                                {item.status === 'serving'
                                                    ? 'Dilayani'
                                                    : 'Dipanggil'}
                                            </span>
                                        </div>

                                        <p className="mt-2 text-4xl font-black tracking-tight">
                                            {item.queue_number}
                                        </p>

                                        {item.pasien && (
                                            <p className="mt-2 text-sm text-white/80">
                                                {item.pasien.name}
                                            </p>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                <footer className="bg-[#07577f] px-8 py-5">

                    <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">

                        {STEPS.map((step) => (

                            <div

                                key={step.label}

                                className="flex flex-1 items-center gap-3"

                            >

                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/15 text-white">

                                    {step.icon}

                                </div>

                                <div className="min-w-0">

                                    <p className="text-[13px] font-bold text-white">

                                        {step.label}

                                    </p>

                                    <p className="mt-0.5 truncate text-[11px] text-white/60">

                                        {step.description}

                                    </p>

                                </div>

                                {step !== STEPS[STEPS.length - 1] && (

                                    <svg

                                        xmlns="http://www.w3.org/2000/svg"

                                        className="ml-2 h-5 w-5 shrink-0 text-white/40"

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

                </footer>
            </div>
        </>
    );
}
