import { getKioskFasilitases } from '@/api/fasilitas';
import type { Fasilitas } from '@/api/fasilitas';
import { useEffect, useState } from 'react';

export default function FasilitasSection() {
    const [fasilitas, setFasilitas] = useState<Fasilitas[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let active = true;

        const load = async () => {
            try {
                const response = await getKioskFasilitases();

                if (!active) {
                    return;
                }

                setFasilitas(response.data?.items ?? []);
            } catch {
                if (active) {
                    setFasilitas([]);
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
                <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:mb-10 sm:flex-row sm:items-end">
                    <div>
                        <span className="text-xs font-bold tracking-widest text-[#0284c7] uppercase">
                            Fasilitas
                        </span>

                        <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-[#075985] sm:text-3xl">
                            Fasilitas Rumah Sakit
                        </h2>

                        <p className="mt-1 text-sm text-slate-500 sm:text-base">
                            Beragam fasilitas pendukung pelayanan kesehatan Anda
                        </p>
                    </div>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {Array.from({ length: 6 }).map((_, index) => (
                            <div
                                key={index}
                                className="h-[240px] animate-pulse rounded-3xl bg-slate-200/70"
                            />
                        ))}
                    </div>
                ) : fasilitas.length === 0 ? (
                    <p className="py-12 text-center text-sm text-slate-500">
                        Belum ada fasilitas yang tersedia.
                    </p>
                ) : (
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {fasilitas.map((item) => (
                            <div
                                key={item.id}
                                className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-[#0284c7] hover:shadow-xl hover:shadow-sky-100"
                            >
                                <div className="relative h-[150px] overflow-hidden bg-slate-100">
                                    {item.image_url ? (
                                        <img
                                            src={item.image_url}
                                            alt={item.name}
                                            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="flex h-full items-center justify-center">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-12 w-12 text-slate-300"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="1.5"
                                            >
                                                <path d="M3 21h18" />
                                                <path d="M5 21V7l8-4v18" />
                                                <path d="M19 21V11l-6-4" />
                                                <path d="M9 9h.01M9 13h.01M9 17h.01" />
                                            </svg>
                                        </div>
                                    )}
                                </div>

                                <div className="p-6">
                                    <h3 className="text-base font-bold text-slate-800 group-hover:text-[#0284c7]">
                                        {item.name}
                                    </h3>

                                    <p className="mt-2 text-sm leading-relaxed text-slate-500">
                                        {item.description || '-'}
                                    </p>

                                    {item.ruangans_count !== undefined &&
                                        item.ruangans_count > 0 && (
                                            <p className="mt-3 text-xs font-semibold text-[#0284c7]">
                                                {item.ruangans_count} Ruangan
                                            </p>
                                        )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
