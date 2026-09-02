import { Head, Link, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { getDokter, type Dokter } from '@/api/dokter';
import { getJadwalDokters, type JadwalDokter } from '@/api/jadwalDokter';
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

interface PoliGroup {
    poli: NonNullable<JadwalDokter['poli']>;
    schedules: JadwalDokter[];
}

export default function DokterShow() {
    const { id } = usePage<{ id: number }>().props;

    const [dokter, setDokter] = useState<Dokter | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [jadwals, setJadwals] = useState<JadwalDokter[]>([]);
    const [jadwalsLoading, setJadwalsLoading] = useState(true);

    useEffect(() => {
        getDokter(id)
            .then((response) => {
                setDokter(response.data?.dokter ?? null);
            })
            .catch((error: any) => {
                console.error('Gagal memuat dokter', error);

                if (error.response?.status === 401) {
                    window.location.href = '/login';
                    return;
                }

                setError('Gagal mengambil data dokter.');
            })
            .finally(() => {
                setLoading(false);
            });

        getJadwalDokters({ dokterId: id, perPage: 100 })
            .then((response) => {
                setJadwals(response.data?.items ?? []);
            })
            .catch((error: any) => {
                console.error('Gagal memuat jadwal dokter', error);
            })
            .finally(() => {
                setJadwalsLoading(false);
            });
    }, [id]);

    const polis: PoliGroup[] = jadwals
        .filter((jadwal) => jadwal.poli)
        .reduce<Map<number, PoliGroup>>((map, jadwal) => {
            const poli = jadwal.poli as NonNullable<JadwalDokter['poli']>;
            const existing = map.get(poli.id);

            if (existing) {
                existing.schedules.push(jadwal);
            } else {
                map.set(poli.id, { poli, schedules: [jadwal] });
            }

            return map;
        }, new Map<number, PoliGroup>())
        .values()
        .reduce<PoliGroup[]>((list, group) => {
            list.push(group);

            return list;
        }, []);

    const specialization = dokter?.specialization
        ? dokter.specialization[0].toUpperCase() +
          dokter.specialization.slice(1)
        : '-';

    return (
        <>
            <Head title={dokter ? `Detail ${dokter.name}` : 'Detail Dokter'} />

            <AppLayout wide>
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h2 className="text-lg font-bold text-gray-800 sm:text-xl">
                            Detail Dokter
                        </h2>

                        <p className="mt-1 text-xs text-gray-400 sm:text-sm">
                            Informasi lengkap dokter
                        </p>
                    </div>

                    <Link
                        href={
                            dokter ? `/dokters/${dokter.id}/edit` : '/dokters'
                        }
                        className="flex h-[43px] items-center gap-2 rounded-[12px] bg-[#084e7a] px-4 text-[13px] font-bold text-white transition hover:bg-[#063f62] hover:shadow-md active:scale-[0.99]"
                    >
                        Edit Dokter
                    </Link>
                </div>

                {loading ? (
                    <div className="mt-4 rounded-xl bg-white p-10 text-center text-sm text-gray-400 shadow-sm">
                        Memuat data dokter...
                    </div>
                ) : error ? (
                    <div className="mt-4 rounded-[10px] bg-red-50 px-3 py-2 text-[12px] text-red-500">
                        {error}
                    </div>
                ) : (
                    dokter && (
                        <>
                            <div className="mt-4 rounded-xl bg-white p-5 shadow-sm sm:p-6">
                                <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                                    <div className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-[#07577f]/10">
                                        {dokter.image_url ? (
                                            <img
                                                src={dokter.image_url}
                                                alt={dokter.name}
                                                className="h-full w-full object-cover"
                                                style={{
                                                    objectPosition:
                                                        'center 20%',
                                                }}
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center">
                                                <span className="text-xl font-bold text-[#07577f]">
                                                    {getInitials(dokter.name) ||
                                                        '?'}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <div className="flex flex-wrap items-center gap-2">
                                            <h3 className="text-base font-bold text-gray-800">
                                                {dokter.name}
                                            </h3>

                                            <span className="rounded-md bg-[#07577f]/10 px-2 py-0.5 text-[11px] font-bold text-[#07577f]">
                                                {dokter.code}
                                            </span>
                                        </div>

                                        <p className="mt-1 max-w-[520px] text-[13px] text-gray-500">
                                            {specialization}
                                        </p>
                                    </div>

                                    <span
                                        className={`ml-auto inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-semibold ${
                                            dokter.is_active
                                                ? 'bg-green-50 text-green-600'
                                                : 'bg-gray-100 text-gray-500'
                                        }`}
                                    >
                                        <span
                                            className={`h-1.5 w-1.5 rounded-full ${
                                                dokter.is_active
                                                    ? 'bg-green-500'
                                                    : 'bg-gray-400'
                                            }`}
                                        />

                                        {dokter.is_active
                                            ? 'Aktif'
                                            : 'Nonaktif'}
                                    </span>
                                </div>

                                <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                                    {detailItem('ID', String(dokter.id), true)}
                                    {detailItem('Kode', dokter.code, true)}
                                    {detailItem('Nama Dokter', dokter.name)}
                                    {detailItem('Spesialisasi', specialization)}
                                    {detailItem(
                                        'No. SIP',
                                        dokter.sip_number,
                                        true,
                                    )}
                                    {detailItem('No. HP', dokter.phone || '-')}
                                    {detailItem(
                                        'Status',
                                        dokter.is_active ? 'Aktif' : 'Nonaktif',
                                    )}
                                    <div className="col-span-2 lg:col-span-1">
                                        {detailItem(
                                            'Tempat Praktik',
                                            `${polis.length} poli`,
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* POLI TEMPAT PRAKTIK */}
                            <section className="mt-8">
                                <div>
                                    <h2 className="text-lg font-bold text-gray-800 sm:text-xl">
                                        Poli Tempat Praktik
                                    </h2>

                                    <p className="mt-1 text-xs text-gray-400 sm:text-sm">
                                        Poli yang menampung praktik dokter ini
                                    </p>
                                </div>

                                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                                    {jadwalsLoading ? (
                                        <div className="rounded-xl bg-white px-4 py-8 text-center text-sm text-gray-400 shadow-sm">
                                            Memuat jadwal...
                                        </div>
                                    ) : polis.length === 0 ? (
                                        <div className="rounded-xl bg-white px-4 py-8 text-center text-sm text-gray-400 shadow-sm">
                                            Dokter ini belum terdaftar di poli
                                            mana pun.
                                        </div>
                                    ) : (
                                        polis.map(({ poli, schedules }) => (
                                            <div
                                                key={poli.id}
                                                className="rounded-xl bg-white p-5 shadow-sm"
                                            >
                                                <div className="flex items-center justify-between gap-2">
                                                    <p className="text-[13px] font-bold text-gray-800">
                                                        {poli.name}
                                                    </p>

                                                    <span className="rounded-md bg-[#07577f]/10 px-2 py-0.5 text-[11px] font-bold text-[#07577f]">
                                                        {poli.code}
                                                    </span>
                                                </div>

                                                <div className="mt-3 space-y-1.5">
                                                    {schedules.map((jadwal) => (
                                                        <div
                                                            key={jadwal.id}
                                                            className="flex items-center justify-between rounded-lg bg-[#f7f9fb] px-3 py-2"
                                                        >
                                                            <span className="text-[12px] font-semibold text-gray-700">
                                                                {formatDay(
                                                                    jadwal.day,
                                                                )}
                                                            </span>

                                                            <span className="text-[12px] text-[#07577f]">
                                                                {formatTime(
                                                                    jadwal.start_time,
                                                                )}{' '}
                                                                -{' '}
                                                                {formatTime(
                                                                    jadwal.end_time,
                                                                )}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </section>

                            <div className="mt-6 text-right">
                                <Link
                                    href="/dokters"
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
