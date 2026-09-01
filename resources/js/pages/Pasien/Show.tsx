import { Head, Link, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { getPasien, type Pasien } from '@/api/pasien';
import AppLayout from '@/Layouts/AppLayout';

const genderLabel = (gender: 'L' | 'P'): string =>
    gender === 'L' ? 'Laki-laki' : 'Perempuan';

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

export default function PasienShow() {
    const { id } = usePage<{ id: number }>().props;

    const [pasien, setPasien] = useState<Pasien | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        getPasien(id)
            .then((response) => {
                setPasien(response.data?.pasien ?? null);
            })
            .catch((error: any) => {
                console.error('Gagal memuat pasien', error);

                if (error.response?.status === 401) {
                    window.location.href = '/login';
                    return;
                }

                setError('Gagal mengambil data pasien.');
            })
            .finally(() => {
                setLoading(false);
            });
    }, [id]);

    const fullAddress = pasien?.address
        ? pasien.address[0].toUpperCase() + pasien.address.slice(1)
        : '-';

    const initial = pasien?.name?.[0]?.toUpperCase() ?? '?';

    return (
        <>
            <Head title={pasien ? `Detail ${pasien.name}` : 'Detail Pasien'} />

            <AppLayout wide>
                <div className="flex items-end justify-between">
                    <div>
                        <h2 className="text-lg font-bold text-gray-800 sm:text-xl">
                            Detail Pasien
                        </h2>

                        <p className="mt-1 text-xs text-gray-400 sm:text-sm">
                            Informasi lengkap pasien
                        </p>
                    </div>

                    <Link
                        href={
                            pasien ? `/pasiens/${pasien.id}/edit` : '/pasiens'
                        }
                        className="flex h-[43px] items-center gap-2 rounded-[12px] bg-[#084e7a] px-4 text-[13px] font-bold text-white transition hover:bg-[#063f62] hover:shadow-md active:scale-[0.99]"
                    >
                        Edit Pasien
                    </Link>
                </div>

                {loading ? (
                    <div className="mt-4 rounded-xl bg-white p-10 text-center text-sm text-gray-400 shadow-sm">
                        Memuat data pasien...
                    </div>
                ) : error ? (
                    <div className="mt-4 rounded-[10px] bg-red-50 px-3 py-2 text-[12px] text-red-500">
                        {error}
                    </div>
                ) : (
                    pasien && (
                        <div className="mt-4 rounded-xl bg-white p-5 shadow-sm sm:p-6">
                            {/* HEADER CARD */}
                            <div className="flex items-center gap-4">
                                <div className="flex h-[60px] w-[60px] items-center justify-center rounded-2xl bg-[#084e7a] text-xl font-bold text-white">
                                    {initial}
                                </div>

                                <div>
                                    <h3 className="text-base font-bold text-gray-800">
                                        {pasien.name}
                                    </h3>

                                    <p className="mt-0.5 text-[13px] text-gray-400">
                                        {pasien.poli?.name ?? '-'}
                                    </p>
                                </div>

                                <span
                                    className={`ml-auto inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-semibold ${
                                        pasien.is_active
                                            ? 'bg-green-50 text-green-600'
                                            : 'bg-gray-100 text-gray-500'
                                    }`}
                                >
                                    <span
                                        className={`h-1.5 w-1.5 rounded-full ${
                                            pasien.is_active
                                                ? 'bg-green-500'
                                                : 'bg-gray-400'
                                        }`}
                                    />

                                    {pasien.is_active ? 'Aktif' : 'Nonaktif'}
                                </span>
                            </div>

                            {/* DETAIL GRID */}
                            <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-3">
                                {detailItem(
                                    'No. Rekam Medis',
                                    pasien.medical_record_number,
                                    true,
                                )}
                                {detailItem('NIK', pasien.nik)}
                                {detailItem(
                                    'Jenis Kelamin',
                                    genderLabel(pasien.gender),
                                )}
                                {detailItem('Tanggal Lahir', pasien.birth_date)}
                                {detailItem('Umur', `${pasien.age} tahun`)}
                                {detailItem('No. HP', pasien.phone ?? '-')}
                                {detailItem(
                                    'Status',
                                    pasien.is_active ? 'Aktif' : 'Nonaktif',
                                )}
                                <div className="col-span-2 lg:col-span-3">
                                    {detailItem('Alamat', fullAddress)}
                                </div>
                            </div>

                            <div className="mt-6 text-right">
                                <Link
                                    href="/pasiens"
                                    className="inline-flex h-[43px] items-center rounded-[12px] bg-[#d9d9d9] px-5 text-[13px] font-bold text-gray-600 transition hover:bg-[#c9c9c9]"
                                >
                                    Kembali
                                </Link>
                            </div>
                        </div>
                    )
                )}
            </AppLayout>
        </>
    );
}
