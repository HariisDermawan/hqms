import { Head, Link, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import {
    deletePendaftaran,
    getPendaftaran,
    type Pendaftaran,
} from '@/api/pendaftaran';
import AppLayout from '@/Layouts/AppLayout';
import { statusBadgeClass, statusLabel } from './Form';

const formatDate = (date: string): string => {
    if (!date) {
        return '-';
    }

    const [year, month, day] = date.split('-');

    return `${day}/${month}/${year}`;
};

const getInitials = (name: string): string =>
    name
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

export default function PendaftaranShow() {
    const { id } = usePage<{ id: number }>().props;

    const [pendaftaran, setPendaftaran] = useState<Pendaftaran | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        getPendaftaran(id)
            .then((response) => {
                setPendaftaran(response.data?.pendaftaran ?? null);
            })
            .catch((error: any) => {
                console.error('Gagal memuat pendaftaran', error);

                if (error.response?.status === 401) {
                    window.location.href = '/login';
                    return;
                }

                setError('Gagal mengambil data pendaftaran.');
            })
            .finally(() => {
                setLoading(false);
            });
    }, [id]);

    const handleDelete = async () => {
        if (!pendaftaran) {
            return;
        }

        const confirmed = window.confirm(
            `Hapus pendaftaran ini? Tindakan ini tidak bisa dibatalkan.`,
        );

        if (confirmed) {
            try {
                await deletePendaftaran(pendaftaran.id);

                window.location.href = '/pendaftarans';
            } catch (error: any) {
                window.alert(
                    error.response?.data?.message ||
                        'Gagal menghapus pendaftaran.',
                );
            }
        }
    };

    const pasien = pendaftaran?.pasien;
    const poli = pendaftaran?.poli;

    return (
        <>
            <Head title="Detail Pendaftaran" />

            <AppLayout wide>
                <div className="flex items-end justify-between">
                    <div>
                        <h2 className="text-lg font-bold text-gray-800 sm:text-xl">
                            Detail Pendaftaran
                        </h2>

                        <p className="mt-1 text-xs text-gray-400 sm:text-sm">
                            Informasi lengkap pendaftaran pasien
                        </p>
                    </div>

                    <Link
                        href={
                            pendaftaran
                                ? `/pendaftarans/${pendaftaran.id}/edit`
                                : '/pendaftarans'
                        }
                        className="flex h-[43px] items-center gap-2 rounded-[12px] bg-[#084e7a] px-4 text-[13px] font-bold text-white transition hover:bg-[#063f62] hover:shadow-md active:scale-[0.99]"
                    >
                        Edit Pendaftaran
                    </Link>
                </div>

                {loading ? (
                    <div className="mt-4 rounded-xl bg-white p-10 text-center text-sm text-gray-400 shadow-sm">
                        Memuat data pendaftaran...
                    </div>
                ) : error ? (
                    <div className="mt-4 rounded-[10px] bg-red-50 px-3 py-2 text-[12px] text-red-500">
                        {error}
                    </div>
                ) : (
                    pendaftaran && (
                        <>
                            <div className="mt-4 rounded-xl bg-white p-5 shadow-sm sm:p-6">
                                <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                                    <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-[#07577f]/10">
                                        <span className="text-xl font-bold text-[#07577f]">
                                            {pasien
                                                ? getInitials(pasien.name) ||
                                                  '?'
                                                : '?'}
                                        </span>
                                    </div>

                                    <div>
                                        <div className="flex flex-wrap items-center gap-2">
                                            <h3 className="text-base font-bold text-gray-800">
                                                {pasien?.name ?? '-'}
                                            </h3>

                                            <span className="rounded-md bg-[#07577f]/10 px-2 py-0.5 text-[11px] font-bold text-[#07577f]">
                                                {poli?.name ?? '-'}
                                            </span>

                                            <span
                                                className={`rounded-md px-2 py-0.5 text-[11px] font-bold ${statusBadgeClass(pendaftaran.status)}`}
                                            >
                                                {statusLabel(
                                                    pendaftaran.status,
                                                )}
                                            </span>
                                        </div>

                                        <p className="mt-1 text-[13px] text-gray-500">
                                            No. RM{' '}
                                            {pasien?.medical_record_number ??
                                                '-'}{' '}
                                            · Antrean{' '}
                                            <span className="font-bold text-[#07577f]">
                                                {pendaftaran.queue_number}
                                            </span>
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
                                    {detailItem(
                                        'No. Registrasi',
                                        pendaftaran.registration_number,
                                        true,
                                    )}
                                    {detailItem(
                                        'No. Antrean',
                                        pendaftaran.queue_number,
                                        true,
                                    )}
                                    {detailItem(
                                        'Tanggal',
                                        formatDate(
                                            pendaftaran.registration_date,
                                        ),
                                        true,
                                    )}
                                    {detailItem(
                                        'Status',
                                        statusLabel(pendaftaran.status),
                                    )}
                                    {detailItem('Pasien', pasien?.name ?? '-')}
                                    {detailItem(
                                        'No. Rekam Medis',
                                        pasien?.medical_record_number ?? '-',
                                    )}
                                    {detailItem('NIK', pasien?.nik ?? '-')}
                                    {detailItem('Poli', poli?.name ?? '-')}
                                    {detailItem('Kode Poli', poli?.code ?? '-')}
                                    {detailItem(
                                        'Didaftarkan pada',
                                        formatDate(
                                            pendaftaran.registration_date,
                                        ),
                                    )}
                                </div>

                                {pendaftaran.notes && (
                                    <div className="mt-4 rounded-[10px] bg-[#f7f9fb] p-3">
                                        <p className="text-[11px] tracking-wider text-gray-400 uppercase">
                                            Catatan
                                        </p>

                                        <p className="mt-1 text-[13px] text-gray-700">
                                            {pendaftaran.notes}
                                        </p>
                                    </div>
                                )}

                                <div className="mt-4 flex items-center justify-between">
                                    <Link
                                        href="/pendaftarans"
                                        className="inline-flex h-[43px] items-center rounded-[12px] bg-[#d9d9d9] px-5 text-[13px] font-bold text-gray-600 transition hover:bg-[#c9c9c9]"
                                    >
                                        Kembali
                                    </Link>

                                    <button
                                        type="button"
                                        onClick={handleDelete}
                                        className="inline-flex h-[43px] items-center gap-2 rounded-[12px] bg-red-50 px-5 text-[13px] font-bold text-red-500 transition hover:bg-red-100"
                                    >
                                        Hapus Pendaftaran
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
