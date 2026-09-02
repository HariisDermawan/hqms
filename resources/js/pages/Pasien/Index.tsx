import { Head, Link } from '@inertiajs/react';
import { useCallback, useEffect, useState } from 'react';
import { deletePasien, getPasiens, type Pasien } from '@/api/pasien';
import AppLayout from '@/Layouts/AppLayout';

const genderLabel = (gender: 'L' | 'P'): string =>
    gender === 'L' ? 'Laki-laki' : 'Perempuan';

export default function PasienIndex() {
    const [pasiens, setPasiens] = useState<Pasien[]>([]);
    const [page, setPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');
    const [deletingId, setDeletingId] = useState<number | null>(null);

    const loadPasiens = useCallback(async (targetPage = 1) => {
        try {
            setLoading(true);
            setError('');
            setPage(targetPage);

            const response = await getPasiens(targetPage);

            setPasiens(response.data?.items ?? []);
            setLastPage(response.data?.pagination?.last_page ?? 1);
            setTotal(response.data?.pagination?.total ?? 0);
        } catch (error: any) {
            console.error('Gagal memuat pasien', error);

            if (error.response?.status === 401) {
                window.location.href = '/login';
                return;
            }

            setError(
                error.response?.data?.message || 'Gagal mengambil data pasien.',
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void loadPasiens();
    }, [loadPasiens]);

    const handleDelete = async (pasien: Pasien) => {
        const confirmed = window.confirm(
            `Hapus pasien "${pasien.name}"? Tindakan ini tidak bisa dibatalkan.`,
        );

        if (!confirmed) {
            return;
        }

        try {
            setDeletingId(pasien.id);

            await deletePasien(pasien.id);

            await loadPasiens(page);
        } catch (error: any) {
            console.error('Gagal menghapus pasien', error);

            window.alert(
                error.response?.data?.message || 'Gagal menghapus pasien.',
            );
        } finally {
            setDeletingId(null);
        }
    };

    const filtered = pasiens.filter((pasien) => {
        const keyword = search.toLowerCase().trim();

        if (!keyword) {
            return true;
        }

        return (
            pasien.name.toLowerCase().includes(keyword) ||
            pasien.nik.includes(keyword) ||
            pasien.medical_record_number.toLowerCase().includes(keyword) ||
            pasien.poli?.name.toLowerCase().includes(keyword)
        );
    });

    return (
        <>
            <Head title="Pasien" />

            <AppLayout wide>
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h2 className="text-lg font-bold text-gray-800 sm:text-xl">
                            Pasien
                        </h2>

                        <p className="mt-1 text-xs text-gray-400 sm:text-sm">
                            Kelola data pasien
                        </p>
                    </div>

                    <Link
                        href="/pasiens/create"
                        className="flex h-[43px] items-center gap-2 rounded-[12px] bg-[#084e7a] px-4 text-[13px] font-bold text-white transition hover:bg-[#063f62] hover:shadow-md active:scale-[0.99]"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <path d="M12 5v14M5 12h14" />
                        </svg>
                        Tambah Pasien
                    </Link>
                </div>

                <div className="mt-4 rounded-xl bg-white p-5 shadow-sm sm:p-6">
                    {/* SEARCH */}
                    <div className="flex h-12 items-center rounded-full border border-gray-200 bg-[#f7f9fb] px-4">
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
                            placeholder="Cari nama, NIK, no. RM, atau poli..."
                            className="w-full bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400"
                        />
                    </div>

                    {error && (
                        <div className="mt-4 rounded-[10px] bg-red-50 px-3 py-2 text-[12px] text-red-500">
                            {error}
                        </div>
                    )}

                    {/* TABLE */}
                    <div className="mt-4 overflow-x-auto">
                        <table className="w-full min-w-[820px] text-left">
                            <thead>
                                <tr className="border-b border-gray-100 text-[11px] tracking-wider text-gray-400 uppercase">
                                    <th className="px-3 py-3 font-semibold">
                                        No
                                    </th>
                                    <th className="px-3 py-3 font-semibold">
                                        No. RM
                                    </th>
                                    <th className="px-3 py-3 font-semibold">
                                        Nama
                                    </th>
                                    <th className="px-3 py-3 font-semibold">
                                        Poli
                                    </th>
                                    <th className="px-3 py-3 font-semibold">
                                        Jenis Kelamin
                                    </th>
                                    <th className="px-3 py-3 font-semibold">
                                        Umur
                                    </th>
                                    <th className="px-3 py-3 font-semibold">
                                        No. HP
                                    </th>
                                    <th className="px-3 py-3 font-semibold">
                                        Status
                                    </th>
                                    <th className="px-3 py-3 text-right font-semibold">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td
                                            colSpan={9}
                                            className="px-3 py-10 text-center text-sm text-gray-400"
                                        >
                                            Memuat data...
                                        </td>
                                    </tr>
                                ) : filtered.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={9}
                                            className="px-3 py-10 text-center text-sm text-gray-400"
                                        >
                                            Data pasien tidak ditemukan.
                                        </td>
                                    </tr>
                                ) : (
                                    filtered.map((pasien, index) => (
                                        <tr
                                            key={pasien.id}
                                            className="border-b border-gray-50 text-[13px] text-gray-700 transition hover:bg-[#f7f9fb]"
                                        >
                                            <td className="px-3 py-4 text-gray-500">
                                                {(page - 1) * 10 + index + 1}
                                            </td>

                                            <td className="px-3 py-4 font-medium text-[#07577f]">
                                                {pasien.medical_record_number}
                                            </td>

                                            <td className="px-3 py-4 font-medium">
                                                {pasien.name}
                                            </td>

                                            <td className="px-3 py-4">
                                                {pasien.poli?.name ?? '-'}
                                            </td>

                                            <td className="px-3 py-4">
                                                {genderLabel(pasien.gender)}
                                            </td>

                                            <td className="px-3 py-4">
                                                {pasien.age} th
                                            </td>

                                            <td className="px-3 py-4">
                                                {pasien.phone ?? '-'}
                                            </td>

                                            <td className="px-3 py-4">
                                                <span
                                                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
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

                                                    {pasien.is_active
                                                        ? 'Aktif'
                                                        : 'Nonaktif'}
                                                </span>
                                            </td>

                                            <td className="px-3 py-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link
                                                        href={`/pasiens/${pasien.id}`}
                                                        className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#07577f]/10 text-[#07577f] transition hover:bg-[#07577f]/20 sm:h-8 sm:w-8"
                                                    >
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            className="h-4 w-4"
                                                            viewBox="0 0 24 24"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            strokeWidth="1.8"
                                                        >
                                                            <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
                                                            <circle
                                                                cx="12"
                                                                cy="12"
                                                                r="3"
                                                            />
                                                        </svg>
                                                    </Link>

                                                    <Link
                                                        href={`/pasiens/${pasien.id}/edit`}
                                                        className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-500 transition hover:bg-blue-100 sm:h-8 sm:w-8"
                                                    >
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            className="h-4 w-4"
                                                            viewBox="0 0 24 24"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            strokeWidth="1.8"
                                                        >
                                                            <path d="M12 20h9" />
                                                            <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
                                                        </svg>
                                                    </Link>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleDelete(pasien)
                                                        }
                                                        disabled={
                                                            deletingId ===
                                                            pasien.id
                                                        }
                                                        className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50 text-red-500 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60 sm:h-8 sm:w-8"
                                                    >
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            className="h-4 w-4"
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
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* PAGINATION */}
                    {!loading && total > 0 && (
                        <div className="mt-4 flex items-center justify-between">
                            <p className="text-xs text-gray-400">
                                Menampilkan {pasiens.length} dari {total} data
                            </p>

                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    disabled={page <= 1}
                                    onClick={() => loadPasiens(page - 1)}
                                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:bg-[#f7f9fb] disabled:cursor-not-allowed disabled:opacity-50 sm:h-9 sm:w-9"
                                >
                                    ‹
                                </button>

                                <span className="min-w-[70px] text-center text-xs font-medium text-gray-500">
                                    Hal {page} / {lastPage}
                                </span>

                                <button
                                    type="button"
                                    disabled={page >= lastPage}
                                    onClick={() => loadPasiens(page + 1)}
                                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:bg-[#f7f9fb] disabled:cursor-not-allowed disabled:opacity-50 sm:h-9 sm:w-9"
                                >
                                    ›
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </AppLayout>
        </>
    );
}
