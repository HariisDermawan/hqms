import { Head, Link, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import {
    deleteJadwalDokter,
    getJadwalDokter,
    type JadwalDokter,
} from '@/api/jadwalDokter';
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

export default function JadwalDokterShow() {
    const { id } = usePage<{ id: number }>().props;

    const [jadwal, setJadwal] = useState<JadwalDokter | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        getJadwalDokter(id)
            .then((response) => {
                setJadwal(response.data?.jadwal_dokter ?? null);
            })
            .catch((error: any) => {
                console.error('Gagal memuat jadwal', error);

                if (error.response?.status === 401) {
                    window.location.href = '/login';
                    return;
                }

                setError('Gagal mengambil data jadwal.');
            })
            .finally(() => {
                setLoading(false);
            });
    }, [id]);

    const handleDelete = async () => {
        if (!jadwal) {
            return;
        }

        const confirmed = window.confirm(
            `Hapus jadwal ini? Tindakan ini tidak bisa dibatalkan.`,
        );

        if (confirmed) {
            try {
                await deleteJadwalDokter(jadwal.id);

                window.location.href = '/jadwal-dokters';
            } catch (error: any) {
                window.alert(
                    error.response?.data?.message || 'Gagal menghapus jadwal.',
                );
            }
        }
    };

    const dokter = jadwal?.dokter;
    const poli = jadwal?.poli;

    return (
        <>
            <Head title="Detail Jadwal Dokter" />

            <AppLayout wide>
                <div className="flex items-end justify-between">
                    <div>
                        <h2 className="text-lg font-bold text-gray-800 sm:text-xl">
                            Detail Jadwal Dokter
                        </h2>

                        <p className="mt-1 text-xs text-gray-400 sm:text-sm">
                            Informasi lengkap jadwal praktik
                        </p>
                    </div>

                    <Link
                        href={
                            jadwal
                                ? `/jadwal-dokters/${jadwal.id}/edit`
                                : '/jadwal-dokters'
                        }
                        className="flex h-[43px] items-center gap-2 rounded-[12px] bg-[#084e7a] px-4 text-[13px] font-bold text-white transition hover:bg-[#063f62] hover:shadow-md active:scale-[0.99]"
                    >
                        Edit Jadwal
                    </Link>
                </div>

                {loading ? (
                    <div className="mt-4 rounded-xl bg-white p-10 text-center text-sm text-gray-400 shadow-sm">
                        Memuat data jadwal...
                    </div>
                ) : error ? (
                    <div className="mt-4 rounded-[10px] bg-red-50 px-3 py-2 text-[12px] text-red-500">
                        {error}
                    </div>
                ) : (
                    jadwal && (
                        <>
                            <div className="mt-4 rounded-xl bg-white p-5 shadow-sm sm:p-6">
                                <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                                    <div className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-[#07577f]/10">
                                        {dokter?.image_url ? (
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
                                                    {dokter
                                                        ? getInitials(
                                                              dokter.name,
                                                          ) || '?'
                                                        : '?'}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <div className="flex flex-wrap items-center gap-2">
                                            <h3 className="text-base font-bold text-gray-800">
                                                {dokter?.name ?? '-'}
                                            </h3>

                                            <span className="rounded-md bg-[#07577f]/10 px-2 py-0.5 text-[11px] font-bold text-[#07577f]">
                                                {poli?.name ?? '-'}
                                            </span>
                                        </div>

                                        <p className="mt-1 max-w-[520px] text-[13px] text-gray-500">
                                            {dokter?.specialization || 'Dokter'}{' '}
                                            · {formatDay(jadwal.day)}{' '}
                                            {formatTime(jadwal.start_time)} -{' '}
                                            {formatTime(jadwal.end_time)}
                                        </p>
                                    </div>

                                    <span
                                        className={`ml-auto inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-semibold ${
                                            jadwal.is_active
                                                ? 'bg-green-50 text-green-600'
                                                : 'bg-gray-100 text-gray-500'
                                        }`}
                                    >
                                        <span
                                            className={`h-1.5 w-1.5 rounded-full ${
                                                jadwal.is_active
                                                    ? 'bg-green-500'
                                                    : 'bg-gray-400'
                                            }`}
                                        />

                                        {jadwal.is_active
                                            ? 'Aktif'
                                            : 'Nonaktif'}
                                    </span>
                                </div>

                                <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
                                    {detailItem('ID', String(jadwal.id), true)}
                                    {detailItem('Dokter', dokter?.name ?? '-')}
                                    {detailItem(
                                        'Spesialisasi',
                                        dokter?.specialization || '-',
                                    )}
                                    {detailItem('Poli', poli?.name ?? '-')}
                                    {detailItem('Kode Poli', poli?.code ?? '-')}
                                    {detailItem(
                                        'Hari',
                                        formatDay(jadwal.day),
                                        true,
                                    )}
                                    {detailItem(
                                        'Jam',
                                        `${formatTime(jadwal.start_time)} - ${formatTime(jadwal.end_time)}`,
                                        true,
                                    )}
                                    {detailItem(
                                        'Status',
                                        jadwal.is_active ? 'Aktif' : 'Nonaktif',
                                    )}
                                </div>

                                <div className="mt-4 flex items-center justify-between">
                                    <Link
                                        href="/jadwal-dokters"
                                        className="inline-flex h-[43px] items-center rounded-[12px] bg-[#d9d9d9] px-5 text-[13px] font-bold text-gray-600 transition hover:bg-[#c9c9c9]"
                                    >
                                        Kembali
                                    </Link>

                                    <button
                                        type="button"
                                        onClick={handleDelete}
                                        className="inline-flex h-[43px] items-center gap-2 rounded-[12px] bg-red-50 px-5 text-[13px] font-bold text-red-500 transition hover:bg-red-100"
                                    >
                                        Hapus Jadwal
                                    </button>
                                </div>
                            </div>
                        </>
                    )
                )}
            </AppLayout>
        </>
    );
}
