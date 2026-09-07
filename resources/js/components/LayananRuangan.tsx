import { getKioskRuangans } from '@/api/kiosk';
import type { Ruangan } from '@/api/ruangan';
import { useEffect, useState } from 'react';
import React from 'react';

interface FacilityGroup {
    facility: string;
    rooms: Ruangan[];
}

const ICON_PROPS = {
    xmlns: 'http://www.w3.org/2000/svg',
    className: 'h-6 w-6',
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
} as const;

function facilityIcon(facility: string): React.ReactNode {
    const key = facility.toLowerCase();

    if (key.includes('igd') || key.includes('ugd')) {
        return (
            <svg {...ICON_PROPS}>
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
        );
    }

    if (key.includes('poli')) {
        return (
            <svg {...ICON_PROPS}>
                <path d="M11 2v2" />
                <path d="M5 2v2" />
                <path d="M5 3H4a2 2 0 0 0-2 2v4a6 6 0 0 0 12 0V5a2 2 0 0 0-2-2h-1" />
                <path d="M8 15a6 6 0 0 0 12 0v-3" />
                <circle cx="20" cy="10" r="2" />
            </svg>
        );
    }

    if (key.includes('vip')) {
        return (
            <svg {...ICON_PROPS}>
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
        );
    }

    if (key.includes('isolasi')) {
        return (
            <svg {...ICON_PROPS}>
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
                <path d="m9 12 2 2 4-4" />
            </svg>
        );
    }

    if (key.includes('icu') || key.includes('nicu') || key.includes('picu')) {
        return (
            <svg {...ICON_PROPS}>
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                <path d="M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27" />
            </svg>
        );
    }

    if (key.includes('khusus')) {
        return (
            <svg {...ICON_PROPS}>
                <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
                <path d="M5 3v4" />
                <path d="M19 17v4" />
                <path d="M3 5h4" />
                <path d="M17 19h4" />
            </svg>
        );
    }

    return (
        <svg {...ICON_PROPS}>
            <path d="M2 20v-8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v8" />
            <path d="M4 10V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4" />
            <path d="M12 4v6" />
            <path d="M2 18h20" />
        </svg>
    );
}

export default function LayananRuangan() {
    const [ruangans, setRuangans] = useState<Ruangan[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let active = true;

        const load = async () => {
            try {
                const response = await getKioskRuangans();
                if (!active) {
                    return;
                }

                setRuangans(response.data?.items ?? []);
            } catch {
                if (active) {
                    setRuangans([]);
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

    const groups: FacilityGroup[] = ruangans.reduce<FacilityGroup[]>(
        (acc, ruangan) => {
            const facilityName = ruangan.facility?.name ?? 'Lainnya';
            const existing = acc.find(
                (group) => group.facility === facilityName,
            );

            if (existing) {
                existing.rooms.push(ruangan);
            } else {
                acc.push({ facility: facilityName, rooms: [ruangan] });
            }

            return acc;
        },
        [],
    );

    return (
        <section className="bg-slate-50 py-16 sm:py-20">
            <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 md:px-10 lg:px-14">
                <div className="mb-8 sm:mb-10">
                    <span className="text-xs font-bold tracking-widest text-[#0284c7] uppercase">
                        Fasilitas
                    </span>
                    <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-[#075985] sm:text-3xl">
                        Layanan Ruangan
                    </h2>
                    <p className="mt-1 text-sm text-slate-500 sm:text-base">
                        Ruang perawatan yang nyaman sesuai kebutuhan Anda
                    </p>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {Array.from({ length: 6 }).map((_, index) => (
                            <div
                                key={index}
                                className="h-[190px] animate-pulse rounded-3xl bg-slate-200/70"
                            />
                        ))}
                    </div>
                ) : groups.length === 0 ? (
                    <p className="py-12 text-center text-sm text-slate-500">
                        Belum ada ruangan yang tersedia.
                    </p>
                ) : (
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {groups.map((group) => (
                            <div
                                key={group.facility}
                                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-[#0284c7] hover:shadow-xl hover:shadow-sky-100"
                            >
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#075985]/10 text-[#075985]">
                                    {facilityIcon(group.facility)}
                                </div>

                                <h3 className="mt-4 text-base font-bold text-slate-800">
                                    {group.facility}
                                </h3>
                                <p className="mt-0.5 text-xs font-medium text-slate-400">
                                    {group.rooms.length} Ruangan
                                </p>

                                <div className="mt-3 flex flex-wrap gap-1.5">
                                    {group.rooms.slice(0, 4).map((room) => (
                                        <span
                                            key={room.id}
                                            className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600"
                                        >
                                            {room.name}
                                        </span>
                                    ))}
                                    {group.rooms.length > 4 && (
                                        <span className="text-xs text-slate-400">
                                            +{group.rooms.length - 4} lainnya
                                        </span>
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
