import { Head, Link, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { getObat, type Obat } from '@/api/obat';
import AppLayout from '@/Layouts/AppLayout';

const formatRupiah = (value: string | number): string => {
    const number = Number(value ?? 0);

    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(number);
};

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

const detailItem = (
    label: string,
    value: React.ReactNode,
    highlight = false,
) => (
    <div className="rounded-[10px] bg-[#f7f9fb] p-3">
        <p className="text-[11px] tracking-wider text-gray-400 uppercase">
            {label}
        </p>

        <div
            className={`mt-1 text-[13px] font-semibold ${highlight ? 'text-[#07577f]' : 'text-gray-700'}`}
        >
            {value}
        </div>
    </div>
);

export default function ObatShow() {
    const { id } = usePage<{ id: number }>().props;

    const [obat, setObat] = useState<Obat | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        getObat(id)
            .then((response) => {
                setObat(response.data?.obat ?? null);
            })
            .catch((error: any) => {
                console.error('Gagal memuat obat', error);

                if (error.response?.status === 401) {
                    window.location.href = '/login';
                    return;
                }

                setError('Gagal mengambil data obat.');
            })
            .finally(() => {
                setLoading(false);
            });
    }, [id]);

    return (
        <>
            <Head title={obat ? `Detail ${obat.nama_obat}` : 'Detail Obat'} />

            <AppLayout wide>
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h2 className="text-lg font-bold text-gray-800 sm:text-xl">
                            Detail Obat
                        </h2>

                        <p className="mt-1 text-xs text-gray-400 sm:text-sm">
                            Informasi resep obat dari hasil pemeriksaan
                        </p>
                    </div>
                </div>

                {loading ? (
                    <div className="mt-4 rounded-xl bg-white p-10 text-center text-sm text-gray-400 shadow-sm">
                        Memuat data obat...
                    </div>
                ) : error ? (
                    <div className="mt-4 rounded-[10px] bg-red-50 px-3 py-2 text-[12px] text-red-500">
                        {error}
                    </div>
                ) : (
                    obat && (
                        <>
                            {/* INFO OBAT */}
                            <div className="mt-4 rounded-xl bg-white p-5 shadow-sm sm:p-6">
                                <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#07577f]/10">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-8 w-8 text-[#07577f]/60"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.4"
                                        >
                                            <rect
                                                x="4"
                                                y="6"
                                                width="16"
                                                height="12"
                                                rx="6"
                                                transform="rotate(-45 12 12)"
                                            />
                                            <path d="m8.5 8.5 7 7" />
                                        </svg>
                                    </div>

                                    <div>
                                        <h3 className="text-base font-bold text-gray-800">
                                            {obat.nama_obat}
                                        </h3>

                                        <p className="mt-1 text-[12px]">
                                            <span className="font-semibold text-gray-700">
                                                {obat.jumlah}{' '}
                                                {obat.satuan ?? ''}
                                            </span>
                                            <span className="mx-1 text-gray-300">
                                                •
                                            </span>
                                            <span className="text-gray-500">
                                                {formatRupiah(obat.harga)}
                                            </span>
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                                    {detailItem(
                                        'Nama Obat',
                                        obat.nama_obat,
                                        true,
                                    )}
                                    {detailItem('Dosis', obat.dosis || '-')}
                                    {detailItem(
                                        'Jumlah',
                                        `${obat.jumlah} ${obat.satuan ?? ''}`,
                                    )}
                                    {detailItem(
                                        'Harga',
                                        formatRupiah(obat.harga),
                                        true,
                                    )}
                                    <div className="col-span-2 lg:col-span-4">
                                        {detailItem(
                                            'Keterangan',
                                            obat.keterangan || '-',
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* INFO PEMERIKSAAN */}
                            <section className="mt-8">
                                <div>
                                    <h2 className="text-lg font-bold text-gray-800 sm:text-xl">
                                        Dari Pemeriksaan
                                    </h2>

                                    <p className="mt-1 text-xs text-gray-400 sm:text-sm">
                                        Pemeriksaan yang menghasilkan resep ini
                                    </p>
                                </div>

                                <div className="mt-4 rounded-xl bg-white p-5 shadow-sm sm:p-6">
                                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                                        {detailItem(
                                            'Nomor Antrian',
                                            obat.pemeriksaan?.queue_number ??
                                                '-',
                                            true,
                                        )}
                                        {detailItem(
                                            'Pasien',
                                            obat.pemeriksaan?.pasien?.name ??
                                                '-',
                                        )}
                                        {detailItem(
                                            'No. RM',
                                            obat.pemeriksaan?.pasien
                                                ?.medical_record_number ?? '-',
                                        )}
                                        {detailItem(
                                            'Poli',
                                            obat.pemeriksaan?.poli?.name ?? '-',
                                        )}
                                        {detailItem(
                                            'Waktu Pemeriksaan',
                                            formatDate(
                                                obat.pemeriksaan?.examined_at ??
                                                    null,
                                            ),
                                        )}
                                        <div className="col-span-2 lg:col-span-3">
                                            {detailItem(
                                                'Diagnosis',
                                                obat.pemeriksaan?.diagnosis ??
                                                    '-',
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <div className="mt-6 flex gap-2">
                                <Link
                                    href="/obats"
                                    className="inline-flex h-[43px] items-center rounded-[12px] bg-[#d9d9d9] px-5 text-[13px] font-bold text-gray-600 transition hover:bg-[#c9c9c9]"
                                >
                                    Kembali
                                </Link>

                                <Link
                                    href={
                                        obat.pemeriksaan
                                            ? `/pemeriksaans/${obat.pemeriksaan.id}`
                                            : '/pemeriksaans'
                                    }
                                    className="inline-flex h-[43px] items-center rounded-[12px] bg-[#07577f] px-5 text-[13px] font-bold text-white transition hover:bg-[#063f62]"
                                >
                                    Lihat Pemeriksaan
                                </Link>
                            </div>
                        </>
                    )
                )}
            </AppLayout>
        </>
    );
}
