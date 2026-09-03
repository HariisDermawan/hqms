import { Head, Link, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { getPerawat, type Perawat } from '@/api/perawat';
import AppLayout from '@/Layouts/AppLayout';

const getInitials = (name: string): string =>
    name
        .replace(/^ns[a-z]*\.?\s*/i, '')
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

export default function PerawatShow() {
    const { id } = usePage<{ id: number }>().props;

    const [perawat, setPerawat] = useState<Perawat | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        getPerawat(id)
            .then((response) => {
                setPerawat(response.data?.perawat ?? null);
            })
            .catch((error: any) => {
                console.error('Gagal memuat perawat', error);

                if (error.response?.status === 401) {
                    window.location.href = '/login';
                    return;
                }

                setError('Gagal mengambil data perawat.');
            })
            .finally(() => {
                setLoading(false);
            });
    }, [id]);

    return (
        <>
            <Head
                title={perawat ? `Detail ${perawat.name}` : 'Detail Perawat'}
            />

            <AppLayout wide>
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h2 className="text-lg font-bold text-gray-800 sm:text-xl">
                            Detail Perawat
                        </h2>

                        <p className="mt-1 text-xs text-gray-400 sm:text-sm">
                            Informasi lengkap perawat
                        </p>
                    </div>

                    <Link
                        href={
                            perawat
                                ? `/perawats/${perawat.id}/edit`
                                : '/perawats'
                        }
                        className="flex h-[43px] items-center gap-2 rounded-[12px] bg-[#084e7a] px-4 text-[13px] font-bold text-white transition hover:bg-[#063f62] hover:shadow-md active:scale-[0.99]"
                    >
                        Edit Perawat
                    </Link>
                </div>

                {loading ? (
                    <div className="mt-4 rounded-xl bg-white p-10 text-center text-sm text-gray-400 shadow-sm">
                        Memuat data perawat...
                    </div>
                ) : error ? (
                    <div className="mt-4 rounded-[10px] bg-red-50 px-3 py-2 text-[12px] text-red-500">
                        {error}
                    </div>
                ) : (
                    perawat && (
                        <>
                            <div className="mt-4 rounded-xl bg-white p-5 shadow-sm sm:p-6">
                                <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                                    <div className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-[#07577f]/10">
                                        {perawat.image_url ? (
                                            <img
                                                src={perawat.image_url}
                                                alt={perawat.name}
                                                className="h-full w-full object-cover"
                                                style={{
                                                    objectPosition:
                                                        'center 20%',
                                                }}
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center">
                                                <span className="text-xl font-bold text-[#07577f]">
                                                    {getInitials(
                                                        perawat.name,
                                                    ) || '?'}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <div className="flex flex-wrap items-center gap-2">
                                            <h3 className="text-base font-bold text-gray-800">
                                                {perawat.name}
                                            </h3>

                                            <span className="rounded-md bg-[#07577f]/10 px-2 py-0.5 text-[11px] font-bold text-[#07577f]">
                                                {perawat.code}
                                            </span>
                                        </div>

                                        <p className="mt-1 text-[13px] text-gray-500">
                                            Perawat
                                        </p>
                                    </div>

                                    <span
                                        className={`ml-auto inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-semibold ${
                                            perawat.is_active
                                                ? 'bg-green-50 text-green-600'
                                                : 'bg-gray-100 text-gray-500'
                                        }`}
                                    >
                                        <span
                                            className={`h-1.5 w-1.5 rounded-full ${
                                                perawat.is_active
                                                    ? 'bg-green-500'
                                                    : 'bg-gray-400'
                                            }`}
                                        />

                                        {perawat.is_active
                                            ? 'Aktif'
                                            : 'Nonaktif'}
                                    </span>
                                </div>

                                <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                                    {detailItem('ID', String(perawat.id), true)}
                                    {detailItem('Kode', perawat.code, true)}
                                    {detailItem(
                                        'Jenis Kelamin',
                                        perawat.gender_label ||
                                            (perawat.gender === 'P'
                                                ? 'Perempuan'
                                                : 'Laki-laki'),
                                    )}
                                    {detailItem('Nama Perawat', perawat.name)}
                                    {detailItem(
                                        'No. STR',
                                        perawat.str_number,
                                        true,
                                    )}
                                    {detailItem('No. HP', perawat.phone || '-')}
                                    {detailItem(
                                        'Status',
                                        perawat.is_active
                                            ? 'Aktif'
                                            : 'Nonaktif',
                                    )}
                                </div>
                            </div>

                            <div className="mt-6 text-right">
                                <Link
                                    href="/perawats"
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
