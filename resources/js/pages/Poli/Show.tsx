import { Head, Link, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { getJadwalDokters, type JadwalDokter } from '@/api/jadwalDokter';
import { getPoli, type Poli } from '@/api/poli';
import AppLayout from '@/Layouts/AppLayout';

const DAYS: Record<string, string> = {
    sunday: 'Minggu',
    monday: 'Senin',
    tuesday: 'Selasa',
    wednesday: 'Rabu',
    thursday: 'Kamis',
    friday: 'Jumat',
    saturday: 'Sabtu',
};

const formatDay = (day: string): string => DAYS[day] ?? day;
const formatTime = (time: string): string => time.slice(0, 5);

const getInitials = (name: string): string =>
    name
        .replace(/^dr[a-z]*\.\s*/i, '')
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part.charAt(0).toUpperCase())
        .join('');

const detailItem = (label: string, value: string, highlight = false) => (
    <div className="rounded-[10px] bg-[#f7f9fb] p-3">
        <p className="text-[11px] tracking-wider text-gray-400 uppercase">
            {label}
        </p>

        <p
            className={`mt-1 text-[13px] font-semibold ${highlight ? 'text-[#07577f]' : 'text-gray-700'}`}
        >
            {value}
        </p>
    </div>
);

interface DoctorGroup {
    dokter: NonNullable<JadwalDokter['dokter']>;
    schedules: JadwalDokter[];
}

export default function PoliShow() {
    const { id } = usePage<{ id: number }>().props;

    const [poli, setPoli] = useState<Poli | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [jadwals, setJadwals] = useState<JadwalDokter[]>([]);
    const [jadwalsLoading, setJadwalsLoading] = useState(true);

    useEffect(() => {
        getPoli(id)
            .then((response) => {
                setPoli(response.data?.poli ?? null);
            })
            .catch((error: any) => {
                console.error('Gagal memuat poli', error);

                if (error.response?.status === 401) {
                    window.location.href = '/login';
                    return;
                }

                setError('Gagal mengambil data poli.');
            })
            .finally(() => {
                setLoading(false);
            });

        getJadwalDokters({ poliId: id, perPage: 100 })
            .then((response) => {
                setJadwals(response.data?.items ?? []);
            })
            .catch((error: any) => {
                console.error('Gagal memuat dokter poli', error);
            })
            .finally(() => {
                setJadwalsLoading(false);
            });
    }, [id]);

    const doctors: DoctorGroup[] = jadwals
        .filter((jadwal) => jadwal.dokter)
        .reduce<Map<number, DoctorGroup>>((map, jadwal) => {
            const dokter = jadwal.dokter as NonNullable<JadwalDokter['dokter']>;
            const existing = map.get(dokter.id);

            if (existing) {
                existing.schedules.push(jadwal);
            } else {
                map.set(dokter.id, { dokter, schedules: [jadwal] });
            }

            return map;
        }, new Map<number, DoctorGroup>())
        .values()
        .reduce<DoctorGroup[]>((list, group) => {
            list.push(group);

            return list;
        }, []);

    const description = poli?.description
        ? poli.description[0].toUpperCase() + poli.description.slice(1)
        : '-';

    return (
        <>
            <Head title={poli ? `Detail ${poli.name}` : 'Detail Poli'} />

            <AppLayout wide>
                <div className="flex items-end justify-between">
                    <div>
                        <h2 className="text-lg font-bold text-gray-800 sm:text-xl">
                            Detail Poli
                        </h2>

                        <p className="mt-1 text-xs text-gray-400 sm:text-sm">
                            Informasi lengkap poli
                        </p>
                    </div>

                    <Link
                        href={poli ? `/polis/${poli.id}/edit` : '/polis'}
                        className="flex h-[43px] items-center gap-2 rounded-[12px] bg-[#084e7a] px-4 text-[13px] font-bold text-white transition hover:bg-[#063f62] hover:shadow-md active:scale-[0.99]"
                    >
                        Edit Poli
                    </Link>
                </div>

                {loading ? (
                    <div className="mt-4 rounded-xl bg-white p-10 text-center text-sm text-gray-400 shadow-sm">
                        Memuat data poli...
                    </div>
                ) : error ? (
                    <div className="mt-4 rounded-[10px] bg-red-50 px-3 py-2 text-[12px] text-red-500">
                        {error}
                    </div>
                ) : (
                    poli && (
                        <>
                            <div className="mt-4 rounded-xl bg-white p-5 shadow-sm sm:p-6">
                                <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                                    <div className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-[#07577f]/10">
                                        {poli.image_url ? (
                                            <img
                                                src={poli.image_url}
                                                alt={poli.name}
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-8 w-8 text-[#07577f]/40"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="1.4"
                                                >
                                                    <rect
                                                        x="5"
                                                        y="3"
                                                        width="14"
                                                        height="18"
                                                        rx="2"
                                                    />
                                                    <path d="M9 7h6M9 11h6M9 15h4" />
                                                </svg>
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <div className="flex flex-wrap items-center gap-2">
                                            <h3 className="text-base font-bold text-gray-800">
                                                {poli.name}
                                            </h3>

                                            <span className="rounded-md bg-[#07577f]/10 px-2 py-0.5 text-[11px] font-bold text-[#07577f]">
                                                {poli.code}
                                            </span>
                                        </div>

                                        <p className="mt-1 max-w-[520px] text-[13px] text-gray-500">
                                            {description}
                                        </p>
                                    </div>

                                    <span
                                        className={`ml-auto inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-semibold ${
                                            poli.is_active
                                                ? 'bg-green-50 text-green-600'
                                                : 'bg-gray-100 text-gray-500'
                                        }`}
                                    >
                                        <span
                                            className={`h-1.5 w-1.5 rounded-full ${
                                                poli.is_active
                                                    ? 'bg-green-500'
                                                    : 'bg-gray-400'
                                            }`}
                                        />

                                        {poli.is_active ? 'Aktif' : 'Nonaktif'}
                                    </span>
                                </div>

                                <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
                                    {detailItem('ID', String(poli.id), true)}
                                    {detailItem('Kode', poli.code, true)}
                                    {detailItem(
                                        'Kode Antrean',
                                        poli.queue_prefix
                                            ? `${poli.queue_prefix} (contoh: ${poli.queue_prefix}-001)`
                                            : '-',
                                        true,
                                    )}
                                    {detailItem('Nama Poli', poli.name)}
                                    {detailItem(
                                        'Status',
                                        poli.is_active ? 'Aktif' : 'Nonaktif',
                                    )}
                                    <div className="col-span-2 lg:col-span-4">
                                        {detailItem('Deskripsi', description)}
                                    </div>
                                </div>
                            </div>

                            {/* DOKTER DI POLI */}
                            <section className="mt-8">
                                <div>
                                    <h2 className="text-lg font-bold text-gray-800 sm:text-xl">
                                        Dokter {poli.name}
                                    </h2>

                                    <p className="mt-1 text-xs text-gray-400 sm:text-sm">
                                        Dokter yang praktik di poli ini
                                    </p>
                                </div>

                                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 xl:grid-cols-4">
                                    {jadwalsLoading ? (
                                        <div className="col-span-2 rounded-xl bg-white px-4 py-8 text-center text-sm text-gray-400 shadow-sm sm:col-span-3 xl:col-span-4">
                                            Memuat dokter...
                                        </div>
                                    ) : doctors.length === 0 ? (
                                        <div className="col-span-2 rounded-xl bg-white px-4 py-8 text-center text-sm text-gray-400 shadow-sm sm:col-span-3 xl:col-span-4">
                                            Belum ada dokter yang praktik di
                                            poli ini.
                                        </div>
                                    ) : (
                                        doctors.map(({ dokter, schedules }) => (
                                            <div
                                                key={dokter.id}
                                                className="overflow-hidden rounded-xl bg-white shadow-sm"
                                            >
                                                <div className="flex h-[140px] items-center justify-center bg-[#07577f]/10">
                                                    {dokter.image_url ? (
                                                        <img
                                                            src={
                                                                dokter.image_url
                                                            }
                                                            alt={dokter.name}
                                                            className="h-full w-full object-cover"
                                                        />
                                                    ) : (
                                                        <span className="text-4xl font-bold text-[#07577f]">
                                                            {getInitials(
                                                                dokter.name,
                                                            )}
                                                        </span>
                                                    )}
                                                </div>

                                                <div className="bg-[#07577f] px-4 py-4 text-white">
                                                    <p className="text-[13px] font-semibold">
                                                        {dokter.name}
                                                    </p>

                                                    <p className="mt-0.5 text-[11px] text-white/60">
                                                        {dokter.specialization ||
                                                            'Dokter'}
                                                    </p>

                                                    <div className="mt-2 space-y-1">
                                                        {schedules.map(
                                                            (jadwal) => (
                                                                <div
                                                                    key={
                                                                        jadwal.id
                                                                    }
                                                                    className="flex items-center justify-between rounded-lg bg-white/10 px-2.5 py-1.5"
                                                                >
                                                                    <span className="text-[11px] font-medium">
                                                                        {formatDay(
                                                                            jadwal.day,
                                                                        )}
                                                                    </span>

                                                                    <span className="text-[11px] text-white/70">
                                                                        {formatTime(
                                                                            jadwal.start_time,
                                                                        )}{' '}
                                                                        -{' '}
                                                                        {formatTime(
                                                                            jadwal.end_time,
                                                                        )}
                                                                    </span>
                                                                </div>
                                                            ),
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </section>

                            <div className="mt-6 text-right">
                                <Link
                                    href="/polis"
                                    className="inline-flex h-[43px] items-center rounded-[12px] bg-[#d9d9d9] px-5 text-[13px] font-bold text-gray-600 transition hover:bg-[#c9c9c9]"
                                >
                                    Kembali
                                </Link>
                            </div>
                        </>
                    )
                )}
            </AppLayout>
        </>
    );
}
