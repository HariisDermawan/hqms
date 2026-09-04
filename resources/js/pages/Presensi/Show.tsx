import { Head, Link, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import {
    getPresensi,
    type Presensi,
    type PresensiStatus,
} from '@/api/presensi';
import AppLayout from '@/Layouts/AppLayout';
import { usePermissions } from '@/lib/permissions';

const statusLabel: Record<PresensiStatus, string> = {
    hadir: 'Hadir',
    ijin: 'Izin',
    sakit: 'Sakit',
    cuti: 'Cuti',
    alpa: 'Alpa',
};

const statusColor: Record<PresensiStatus, string> = {
    hadir: 'bg-green-50 text-green-600',
    ijin: 'bg-blue-50 text-blue-600',
    sakit: 'bg-orange-50 text-orange-600',
    cuti: 'bg-purple-50 text-purple-600',
    alpa: 'bg-red-50 text-red-600',
};

const formatDate = (date?: string): string => {
    if (!date) return '-';

    const parsed = new Date(`${date}T00:00:00`);
    return parsed.toLocaleDateString('id-ID', {
        weekday: 'long',
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    });
};

const time = (value?: string | null): string =>
    value ? value.slice(0, 5) : '-';

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

export default function PresensiShow() {
    const { id } = usePage<{ id: number }>().props;
    const { viewOnly } = usePermissions();

    const [presensi, setPresensi] = useState<Presensi | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        getPresensi(id)
            .then((response) => {
                setPresensi(response.data?.presensi ?? null);
            })
            .catch((error: any) => {
                console.error('Gagal memuat presensi', error);

                if (error.response?.status === 401) {
                    window.location.href = '/login';
                    return;
                }

                setError('Gagal mengambil data presensi.');
            })
            .finally(() => {
                setLoading(false);
            });
    }, [id]);

    return (
        <>
            <Head title="Detail Presensi" />

            <AppLayout wide>
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h2 className="text-lg font-bold text-gray-800 sm:text-xl">
                            Detail Presensi
                        </h2>

                        <p className="mt-1 text-xs text-gray-400 sm:text-sm">
                            Informasi lengkap presensi
                        </p>
                    </div>

                    {!viewOnly && (
                        <Link
                            href={
                                presensi
                                    ? `/presensis/${presensi.id}/edit`
                                    : '/presensis'
                            }
                            className="flex h-[43px] items-center gap-2 rounded-[12px] bg-[#084e7a] px-4 text-[13px] font-bold text-white transition hover:bg-[#063f62] hover:shadow-md active:scale-[0.99]"
                        >
                            Edit Presensi
                        </Link>
                    )}
                </div>

                {loading ? (
                    <div className="mt-4 rounded-xl bg-white p-10 text-center text-sm text-gray-400 shadow-sm">
                        Memuat data presensi...
                    </div>
                ) : error ? (
                    <div className="mt-4 rounded-[10px] bg-red-50 px-3 py-2 text-[12px] text-red-500">
                        {error}
                    </div>
                ) : (
                    presensi && (
                        <>
                            <div className="mt-4 rounded-xl bg-white p-5 shadow-sm sm:p-6">
                                <div className="flex flex-wrap items-center justify-between gap-3">
                                    <div>
                                        <div className="flex flex-wrap items-center gap-2">
                                            <h3 className="text-base font-bold text-gray-800">
                                                {presensi.perawat?.name ||
                                                    `Perawat #${presensi.perawat_id}`}
                                            </h3>

                                            {presensi.perawat?.code && (
                                                <span className="rounded-md bg-[#07577f]/10 px-2 py-0.5 text-[11px] font-bold text-[#07577f]">
                                                    {presensi.perawat.code}
                                                </span>
                                            )}
                                        </div>

                                        <p className="mt-1 text-[13px] text-gray-500">
                                            {formatDate(presensi.date)}
                                        </p>
                                    </div>

                                    <span
                                        className={`inline-flex items-center rounded-full px-3 py-1.5 text-[11px] font-semibold ${statusColor[presensi.status]}`}
                                    >
                                        {statusLabel[presensi.status]}
                                    </span>
                                </div>

                                <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                                    {detailItem(
                                        'ID',
                                        String(presensi.id),
                                        true,
                                    )}
                                    {detailItem(
                                        'Tanggal',
                                        formatDate(presensi.date),
                                    )}
                                    {detailItem(
                                        'Jam Masuk',
                                        time(presensi.time_in),
                                        true,
                                    )}
                                    {detailItem(
                                        'Jam Keluar',
                                        time(presensi.time_out),
                                        true,
                                    )}
                                    {detailItem(
                                        'Status',
                                        statusLabel[presensi.status],
                                    )}
                                </div>

                                {presensi.note && (
                                    <div className="mt-4 rounded-[10px] bg-[#f7f9fb] p-3">
                                        <p className="text-[11px] tracking-wider text-gray-400 uppercase">
                                            Catatan
                                        </p>

                                        <p className="mt-1 text-[13px] whitespace-pre-wrap text-gray-700">
                                            {presensi.note}
                                        </p>
                                    </div>
                                )}
                            </div>

                            <div className="mt-6 text-right">
                                <Link
                                    href="/presensis"
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
