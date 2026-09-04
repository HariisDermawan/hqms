import { Head, Link, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { getPemeriksaan, type Pemeriksaan } from '@/api/pemeriksaan';
import AppLayout from '@/Layouts/AppLayout';

const formatDate = (value: string | null): string => {
    if (!value) {
        return '—';
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return '—';
    }

    return date.toLocaleString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
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

export default function PemeriksaanShow() {
    const { id } = usePage<{ id: number }>().props;

    const [pemeriksaan, setPemeriksaan] = useState<Pemeriksaan | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        getPemeriksaan(id)
            .then((response) => {
                setPemeriksaan(response.data?.pemeriksaan ?? null);
            })
            .catch((error: any) => {
                console.error('Gagal memuat pemeriksaan', error);

                if (error.response?.status === 401) {
                    window.location.href = '/login';
                    return;
                }

                setError('Gagal mengambil data pemeriksaan.');
            })
            .finally(() => {
                setLoading(false);
            });
    }, [id]);

    const pasien = pemeriksaan?.pasien;
    const poli = pemeriksaan?.poli;
    const dokter = pemeriksaan?.dokter;

    return (
        <>
            <Head title="Detail Pemeriksaan" />

            <AppLayout wide>
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h2 className="text-lg font-bold text-gray-800 sm:text-xl">
                            Detail Pemeriksaan
                        </h2>

                        <p className="mt-1 text-xs text-gray-400 sm:text-sm">
                            Informasi lengkap hasil pemeriksaan pasien
                        </p>
                    </div>

                    <Link
                        href={
                            pemeriksaan
                                ? `/pemeriksaans/${pemeriksaan.id}/edit`
                                : '/pemeriksaans'
                        }
                        className="flex h-[43px] items-center gap-2 rounded-[12px] bg-[#084e7a] px-4 text-[13px] font-bold text-white transition hover:bg-[#063f62] hover:shadow-md active:scale-[0.99]"
                    >
                        Edit Pemeriksaan
                    </Link>
                </div>

                {loading ? (
                    <div className="mt-4 rounded-xl bg-white p-10 text-center text-sm text-gray-400 shadow-sm">
                        Memuat data pemeriksaan...
                    </div>
                ) : error ? (
                    <div className="mt-4 rounded-[10px] bg-red-50 px-3 py-2 text-[12px] text-red-500">
                        {error}
                    </div>
                ) : (
                    pemeriksaan && (
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

                                            <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-600">
                                                {pemeriksaan.category ?? '-'}
                                            </span>
                                        </div>

                                        <p className="mt-1 text-[13px] text-gray-500">
                                            No. RM{' '}
                                            {pasien?.medical_record_number ??
                                                '-'}
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                                    {detailItem(
                                        'Waktu',
                                        formatDate(pemeriksaan.examined_at),
                                        true,
                                    )}
                                    {detailItem(
                                        'Poli',
                                        poli?.name ?? '-',
                                        true,
                                    )}
                                    {detailItem('Dokter', dokter?.name ?? '-')}
                                    {detailItem(
                                        'Kategori',
                                        pemeriksaan.category ?? '-',
                                        true,
                                    )}
                                    {detailItem('Pasien', pasien?.name ?? '-')}
                                    {detailItem(
                                        'No. Rekam Medis',
                                        pasien?.medical_record_number ?? '-',
                                    )}
                                </div>

                                {[
                                    {
                                        label: 'Keluhan',
                                        value: pemeriksaan.complaint,
                                    },
                                    {
                                        label: 'Diagnosis',
                                        value: pemeriksaan.diagnosis,
                                    },
                                    {
                                        label: 'Tindakan / Terapi',
                                        value: pemeriksaan.treatment,
                                    },
                                    {
                                        label: 'Catatan',
                                        value: pemeriksaan.notes,
                                    },
                                ].map(
                                    (item) =>
                                        item.value && (
                                            <div
                                                key={item.label}
                                                className="mt-4 rounded-[10px] bg-[#f7f9fb] p-3"
                                            >
                                                <p className="text-[11px] tracking-wider text-gray-400 uppercase">
                                                    {item.label}
                                                </p>

                                                <p className="mt-1 text-[13px] whitespace-pre-wrap text-gray-700">
                                                    {item.value}
                                                </p>
                                            </div>
                                        ),
                                )}

                                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                                    <Link
                                        href="/pemeriksaans"
                                        className="inline-flex h-[43px] items-center rounded-[12px] bg-[#d9d9d9] px-5 text-[13px] font-bold text-gray-600 transition hover:bg-[#c9c9c9]"
                                    >
                                        Kembali
                                    </Link>

                                    <div className="flex flex-wrap items-center gap-2">
                                        <Link
                                            href={`/obats/create?pemeriksaan_id=${pemeriksaan.id}`}
                                            className="flex h-[43px] items-center gap-2 rounded-[12px] bg-[#07577f]/10 px-4 text-[13px] font-bold text-[#07577f] transition hover:bg-[#07577f]/20"
                                        >
                                            Tambah Obat / Resep
                                        </Link>

                                        <Link
                                            href={`/pembayarans/create?pemeriksaan_id=${pemeriksaan.id}`}
                                            className="flex h-[43px] items-center gap-2 rounded-[12px] bg-emerald-600 px-4 text-[13px] font-bold text-white transition hover:bg-emerald-700 hover:shadow-md active:scale-[0.99]"
                                        >
                                            Buat Pembayaran
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            {pemeriksaan.obats &&
                            pemeriksaan.obats.length > 0 ? (
                                <div className="mt-4 rounded-xl bg-white p-5 shadow-sm sm:p-6">
                                    <h3 className="text-[14px] font-bold text-gray-800">
                                        Daftar Obat / Resep
                                    </h3>

                                    <p className="mt-0.5 text-[11px] text-gray-400">
                                        {pemeriksaan.obats.length} obat tercatat
                                        untuk pemeriksaan ini
                                    </p>

                                    <div className="mt-4 overflow-x-auto">
                                        <table className="w-full min-w-[600px] text-left">
                                            <thead>
                                                <tr className="border-b border-gray-100 text-[11px] tracking-wide text-gray-400 uppercase">
                                                    <th className="pr-4 pb-2 font-semibold">
                                                        Nama Obat
                                                    </th>
                                                    <th className="pr-4 pb-2 font-semibold">
                                                        Dosis
                                                    </th>
                                                    <th className="pr-4 pb-2 font-semibold">
                                                        Jumlah
                                                    </th>
                                                    <th className="pr-4 pb-2 font-semibold">
                                                        Harga
                                                    </th>
                                                    <th className="pb-2 font-semibold">
                                                        Keterangan
                                                    </th>
                                                </tr>
                                            </thead>

                                            <tbody>
                                                {pemeriksaan.obats.map(
                                                    (obat) => (
                                                        <tr
                                                            key={obat.id}
                                                            className="border-b border-gray-50 last:border-0"
                                                        >
                                                            <td className="py-2.5 pr-4 text-[13px] font-semibold text-gray-800">
                                                                {obat.nama_obat}
                                                            </td>

                                                            <td className="py-2.5 pr-4 text-[12px] text-gray-600">
                                                                {obat.dosis ||
                                                                    '—'}
                                                            </td>

                                                            <td className="py-2.5 pr-4 text-[12px] text-gray-600">
                                                                {obat.jumlah}{' '}
                                                                {obat.satuan ||
                                                                    ''}
                                                            </td>

                                                            <td className="py-2.5 pr-4 text-[12px] font-medium text-gray-700">
                                                                Rp{' '}
                                                                {Number(
                                                                    obat.harga,
                                                                ).toLocaleString(
                                                                    'id-ID',
                                                                )}
                                                            </td>

                                                            <td className="py-2.5 text-[12px] text-gray-500">
                                                                {obat.keterangan ||
                                                                    '—'}
                                                            </td>
                                                        </tr>
                                                    ),
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            ) : (
                                <div className="mt-4 rounded-xl border border-dashed border-orange-200 bg-orange-50/50 p-5 text-center sm:p-6">
                                    <p className="text-[13px] font-semibold text-orange-600">
                                        Belum ada resep obat
                                    </p>

                                    <p className="mt-1 text-[11px] text-orange-400">
                                        Klik &quot;Tambah Obat / Resep&quot;
                                        untuk mengisi resep
                                    </p>
                                </div>
                            )}
                        </>
                    )
                )}
            </AppLayout>
        </>
    );
}
