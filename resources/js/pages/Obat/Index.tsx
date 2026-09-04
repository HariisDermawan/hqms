import { Head, Link } from '@inertiajs/react';
import { useCallback, useEffect, useState } from 'react';
import { deleteObat, getObats, type Obat } from '@/api/obat';
import { getPemeriksaans } from '@/api/pemeriksaan';
import AppLayout from '@/Layouts/AppLayout';

const formatRupiah = (value: string | number): string => {
    const number = Number(value ?? 0);

    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(number);
};

export default function ObatIndex() {
    const [items, setItems] = useState<Obat[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [pendingResep, setPendingResep] = useState(0);

    const load = useCallback(async () => {
        try {
            setLoading(true);

            const [response, pemeriksaanResponse] = await Promise.all([
                getObats(1, 100),
                getPemeriksaans(1, 100),
            ]);

            setItems(response.data?.items ?? []);
            setError('');

            const pemeriksaans = pemeriksaanResponse.data?.items ?? [];

            setPendingResep(
                pemeriksaans.filter((p) => !p.obats || p.obats.length === 0)
                    .length,
            );
        } catch (error: any) {
            console.error('Gagal memuat obat', error);

            if (error.response?.status === 401) {
                window.location.href = '/login';
                return;
            }

            setError(
                error.response?.data?.message || 'Gagal mengambil data obat.',
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void load();
    }, [load]);

    const handleDelete = async (obat: Obat) => {
        const confirmed = window.confirm(
            `Hapus obat "${obat.nama_obat}"? Tindakan ini tidak bisa dibatalkan.`,
        );

        if (!confirmed) {
            return;
        }

        try {
            setDeletingId(obat.id);

            await deleteObat(obat.id);

            await load();
        } catch (error: any) {
            console.error('Gagal menghapus obat', error);

            window.alert(
                error.response?.data?.message || 'Gagal menghapus obat.',
            );
        } finally {
            setDeletingId(null);
        }
    };

    const filtered = items.filter((obat) => {
        const keyword = search.toLowerCase().trim();

        if (!keyword) {
            return true;
        }

        const medicineName = obat.nama_obat.toLowerCase();
        const dokterName = obat.pemeriksaan?.dokter?.name.toLowerCase() ?? '';
        const queueNumber = obat.pemeriksaan?.queue_number?.toLowerCase() ?? '';

        return (
            medicineName.includes(keyword) ||
            dokterName.includes(keyword) ||
            queueNumber.includes(keyword)
        );
    });

    return (
        <>
            <Head title="Obat" />

            <AppLayout wide>
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h2 className="text-lg font-bold text-gray-800 sm:text-xl">
                            Obat
                        </h2>

                        <p className="mt-1 text-xs text-gray-400 sm:text-sm">
                            Resep obat dari hasil pemeriksaan pasien
                        </p>
                    </div>
                </div>

                {pendingResep > 0 && (
                    <div className="mt-4 flex items-center gap-3 rounded-xl border border-orange-200 bg-orange-50 px-4 py-3">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-500 text-[13px] font-bold text-white">
                            {pendingResep}
                        </span>

                        <div>
                            <p className="text-[13px] font-semibold text-orange-800">
                                Pemeriksaan belum ada resep
                            </p>

                            <p className="text-[11px] text-orange-500">
                                Ada {pendingResep} pemeriksaan yang belum diisi
                                obat/resepnya
                            </p>
                        </div>

                        <Link
                            href="/pemeriksaans"
                            className="ml-auto rounded-lg bg-orange-500 px-3 py-1.5 text-[11px] font-bold text-white transition hover:bg-orange-600"
                        >
                            Lihat
                        </Link>
                    </div>
                )}

                <div className="mt-4">
                    <div className="flex h-12 items-center rounded-full border border-gray-200 bg-white px-4 shadow-sm">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="mr-3 h-5 w-5 shrink-0 text-gray-400"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                        >
                            <circle cx="11" cy="11" r="7" />
                            <path d="m20 20-4-4" />
                        </svg>

                        <input
                            type="text"
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder="Cari nama obat, dokter, atau no. antrian..."
                            className="w-full bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400"
                        />
                    </div>

                    {error && (
                        <div className="mt-4 rounded-[10px] bg-red-50 px-3 py-2 text-[12px] text-red-500">
                            {error}
                        </div>
                    )}

                    {loading ? (
                        <div className="mt-4 rounded-xl bg-white p-10 text-center text-sm text-gray-400 shadow-sm">
                            Memuat data...
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="mt-4 rounded-xl bg-white p-10 text-center text-sm text-gray-400 shadow-sm">
                            Tidak ada obat yang cocok.
                        </div>
                    ) : (
                        <div className="mt-4 overflow-hidden rounded-xl bg-white shadow-sm">
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[880px] text-left">
                                    <thead>
                                        <tr className="border-b border-gray-100 text-[11px] tracking-wide text-gray-400 uppercase">
                                            <th className="px-5 py-3.5 font-semibold">
                                                Obat
                                            </th>
                                            <th className="px-5 py-3.5 font-semibold">
                                                Dokter
                                            </th>
                                            <th className="px-5 py-3.5 font-semibold">
                                                No. Antrian
                                            </th>
                                            <th className="px-5 py-3.5 font-semibold">
                                                Poli
                                            </th>
                                            <th className="px-5 py-3.5 font-semibold">
                                                Dosis
                                            </th>
                                            <th className="px-5 py-3.5 font-semibold">
                                                Harga
                                            </th>
                                            <th className="px-5 py-3.5 text-right font-semibold">
                                                Aksi
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {filtered.map((obat) => (
                                            <tr
                                                key={obat.id}
                                                className="border-b border-gray-50 last:border-0 hover:bg-[#f7f9fb]/60"
                                            >
                                                <td className="px-5 py-3.5">
                                                    <p className="flex items-center gap-2 text-[13px] font-semibold text-gray-800">
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            className="h-4 w-4 text-[#07577f]"
                                                            viewBox="0 0 24 24"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            strokeWidth="1.8"
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
                                                        {obat.nama_obat}
                                                    </p>

                                                    <p className="mt-0.5 pl-6 text-[11px] text-gray-400">
                                                        {obat.jumlah}{' '}
                                                        {obat.satuan ?? ''}
                                                    </p>
                                                </td>

                                                <td className="px-5 py-3.5">
                                                    <p className="text-[13px] font-semibold text-gray-800">
                                                        {obat.pemeriksaan
                                                            ?.dokter?.name ??
                                                            '-'}
                                                    </p>

                                                    <p className="text-[11px] text-gray-400">
                                                        {obat.pemeriksaan
                                                            ?.dokter
                                                            ?.specialization ??
                                                            ''}
                                                    </p>
                                                </td>

                                                <td className="px-5 py-3.5">
                                                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#07577f]/10 text-[13px] font-bold text-[#07577f]">
                                                        {obat.pemeriksaan
                                                            ?.queue_number ??
                                                            '-'}
                                                    </span>
                                                </td>

                                                <td className="px-5 py-3.5">
                                                    <span className="rounded-md bg-[#07577f]/10 px-2 py-1 text-[11px] font-semibold text-[#07577f]">
                                                        {obat.pemeriksaan?.poli
                                                            ?.name || '-'}
                                                    </span>
                                                </td>

                                                <td className="px-5 py-3.5 text-[13px] text-gray-600">
                                                    {obat.dosis || '-'}
                                                </td>

                                                <td className="px-5 py-3.5 text-[13px] font-semibold text-gray-700">
                                                    {formatRupiah(obat.harga)}
                                                </td>

                                                <td className="px-5 py-3.5">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Link
                                                            href={`/obats/${obat.id}`}
                                                            className="flex h-10 items-center gap-1.5 rounded-lg bg-[#07577f]/10 px-3 text-[11px] font-semibold text-[#07577f] transition hover:bg-[#07577f]/20 sm:h-8"
                                                        >
                                                            Detail
                                                        </Link>

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleDelete(
                                                                    obat,
                                                                )
                                                            }
                                                            disabled={
                                                                deletingId ===
                                                                obat.id
                                                            }
                                                            className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50 text-red-500 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60 sm:h-8 sm:w-8"
                                                        >
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                className="h-[15px] w-[15px]"
                                                                viewBox="0 0 24 24"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                strokeWidth="1.8"
                                                            >
                                                                <path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                                                                <path d="M10 11v6M14 11v6" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </AppLayout>
        </>
    );
}
