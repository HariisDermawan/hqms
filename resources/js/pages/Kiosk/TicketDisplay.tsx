import { Head } from '@inertiajs/react';
import { useEffect, useState, type ReactNode } from 'react';

import { getNowServing, type NowServingItem } from '@/api/kiosk';

const STEPS: {
    label: string;
    description: string;
    icon: ReactNode;
}[] = [
    // ...
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
                                        className={`rounded-xl p-4 text-center ${
                                            item.status === 'serving'
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

                {/* FOOTER */}
                <footer className="bg-[#07577f] px-8 py-5">
                    {/* bagian footer kamu tetap */}
                </footer>
            </div>
        </>
    );
}
