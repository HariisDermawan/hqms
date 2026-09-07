import { Head, Link, router, usePage } from '@inertiajs/react';
import { useCallback, useEffect, useState } from 'react';
import { deleteFasilitas, getFasilitas, type Fasilitas } from '@/api/fasilitas';
import type { Ruangan } from '@/api/ruangan';
import AppLayout from '@/Layouts/AppLayout';

interface PageProps {
    id: number | string;
    [key: string]: any;
}

export default function Show() {
    const { id } = usePage<PageProps>().props;

    const [fasilitas, setFasilitas] = useState<Fasilitas | null>(null);
    const [ruangans, setRuangans] = useState<Ruangan[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const loadFasilitas = useCallback(async () => {
        try {
            setLoading(true);
            setError('');

            const response = await getFasilitas(id);
            setFasilitas(response.data?.fasilitas ?? null);
            setRuangans(response.data?.ruangans ?? []);
        } catch (err: any) {
            console.error('Gagal memuat fasilitas', err);

            if (err.response?.status === 401) {
                window.location.href = '/login';
                return;
            }

            setError(
                err.response?.data?.message || 'Gagal mengambil data fasilitas.',
            );
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        void loadFasilitas();
    }, [loadFasilitas]);

    const handleDelete = async () => {
        if (!fasilitas) {
            return;
        }

        const confirmed = window.confirm(
            `Hapus fasilitas "${fasilitas.name}"? Ruangan yang terhubung akan kehilangan referensi fasilitas.`,
        );

        if (!confirmed) {
            return;
        }

        try {
            await deleteFasilitas(fasilitas.id);
            window.location.href = '/fasilitas';
        } catch (err: any) {
            window.alert(
                err.response?.data?.message || 'Gagal menghapus fasilitas.',
            );
        }
    };

    if (loading) {
        return (
            <AppLayout wide>
                <div className="rounded-xl bg-white p-10 text-center text-sm text-gray-400 shadow-sm">
                    Memuat data fasilitas...
                </div>
            </AppLayout>
        );
    }

    if (error || !fasilitas) {
        return (
            <AppLayout wide>
                <div className="rounded-xl bg-white p-10 text-center text-sm text-red-400 shadow-sm">
                    {error || 'Fasilitas tidak ditemukan.'}
                </div>
            </AppLayout>
        );
    }

    return (
        <>
            <Head title={`Fasilitas — ${fasilitas.name}`} />

            <AppLayout wide>
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h2 className="text-lg font-bold text-gray-800 sm:text-xl">
                            {fasilitas.name}
                        </h2>

                        <p className="mt-1 text-xs text-gray-400 sm:text-sm">
                            Slug:{' '}
                            <span className="font-medium text-gray-500">
                                {fasilitas.slug}
                            </span>
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <Link
                            href={`/fasilitas/${fasilitas.id}/edit`}
                            className="flex h-9 items-center gap-1.5 rounded-lg bg-blue-50 px-3 text-[11px] font-semibold text-blue-600 transition hover:bg-blue-100"
                        >
                            Edit
                        </Link>

                        <button
                            type="button"
                            onClick={handleDelete}
                            className="flex h-9 items-center gap-1.5 rounded-lg bg-red-50 px-3 text-[11px] font-semibold text-red-500 transition hover:bg-red-100"
                        >
                            Hapus
                        </button>

                        <Link
                            href="/fasilitas"
                            className="flex h-9 items-center gap-1.5 rounded-lg bg-gray-100 px-3 text-[11px] font-semibold text-gray-600 transition hover:bg-gray-200"
                        >
                            ← Kembali
                        </Link>
                    </div>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="rounded-xl bg-white p-5 shadow-sm">
                        <p className="text-[11px] font-bold text-gray-400 uppercase">
                            Status
                        </p>

                        <p className="mt-1.5">
                            <span
                                className={`inline-block rounded-md px-2 py-0.5 text-[11px] font-bold ${
                                    fasilitas.is_active
                                        ? 'bg-green-50 text-green-600'
                                        : 'bg-gray-100 text-gray-500'
                                }`}
                            >
                                {fasilitas.is_active ? 'Aktif' : 'Nonaktif'}
                            </span>
                        </p>
                    </div>

                    <div className="rounded-xl bg-white p-5 shadow-sm">
                        <p className="text-[11px] font-bold text-gray-400 uppercase">
                            Jumlah Ruangan
                        </p>

                        <p className="mt-1.5 text-[20px] font-bold text-gray-800">
                            {ruangans.length}
                        </p>
                    </div>

                    <div className="rounded-xl bg-white p-5 shadow-sm">
                        <p className="text-[11px] font-bold text-gray-400 uppercase">
                            Deskripsi
                        </p>

                        <p className="mt-1.5 text-[13px] text-gray-600">
                            {fasilitas.description || '-'}
                        </p>
                    </div>
                </div>

                <div className="mt-6">
                    <h3 className="mb-3 text-[14px] font-bold text-gray-800">
                        Ruangan dalam Fasilitas Ini
                    </h3>

                    {ruangans.length === 0 ? (
                        <div className="rounded-xl bg-white p-8 text-center text-sm text-gray-400 shadow-sm">
                            Belum ada ruangan dalam fasilitas ini.
                        </div>
                    ) : (
                        <div className="overflow-hidden rounded-xl bg-white shadow-sm">
                            <table className="w-full text-left text-[13px]">
                                <thead>
                                    <tr className="border-b border-gray-50 bg-gray-50/50 text-[11px] font-bold tracking-wide text-gray-400 uppercase">
                                        <th className="px-5 py-3">Kode</th>
                                        <th className="px-5 py-3">Nama</th>
                                        <th className="px-5 py-3">Poli</th>
                                        <th className="px-5 py-3">Status</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {ruangans.map((ruangan) => (
                                        <tr
                                            key={ruangan.id}
                                            className="border-b border-gray-50 last:border-0 hover:bg-gray-50/30"
                                        >
                                            <td className="px-5 py-3 font-mono text-[12px] font-medium text-gray-600">
                                                {ruangan.code}
                                            </td>

                                            <td className="px-5 py-3 font-medium text-gray-700">
                                                {ruangan.name}
                                            </td>

                                            <td className="px-5 py-3 text-gray-500">
                                                {ruangan.poli?.name || '-'}
                                            </td>

                                            <td className="px-5 py-3">
                                                <span
                                                    className={`inline-block rounded-md px-2 py-0.5 text-[10px] font-bold ${
                                                        ruangan.is_active
                                                            ? 'bg-green-50 text-green-600'
                                                            : 'bg-gray-100 text-gray-500'
                                                    }`}
                                                >
                                                    {ruangan.is_active
                                                        ? 'Aktif'
                                                        : 'Nonaktif'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </AppLayout>
        </>
    );
}
