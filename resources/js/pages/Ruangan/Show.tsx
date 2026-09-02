import { Head, Link, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { getPasiens, type Pasien } from '@/api/pasien';
import {
    assignRuanganPasien,
    getRuangan,
    removeRuanganPasien,
    type Ruangan,
    type RuanganPasienItem,
} from '@/api/ruangan';
import AppLayout from '@/Layouts/AppLayout';

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

const genderLabel = (gender: string | null): string => {
    if (gender === 'L') {
        return 'Laki-laki';
    }

    if (gender === 'P') {
        return 'Perempuan';
    }

    return '-';
};

export default function RuanganShow() {
    const { id } = usePage<{ id: number }>().props;

    const [ruangan, setRuangan] = useState<Ruangan | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [pasiens, setPasiens] = useState<RuanganPasienItem[]>([]);
    const [pasienOptions, setPasienOptions] = useState<Pasien[]>([]);
    const [selectedPasien, setSelectedPasien] = useState('');
    const [adding, setAdding] = useState(false);
    const [showForm, setShowForm] = useState(false);

    const loadPasienOptions = async () => {
        try {
            const response = await getPasiens(1, 100);

            setPasienOptions(response.data?.items ?? []);
        } catch (error: any) {
            console.error('Gagal memuat daftar pasien', error);
        }
    };

    const loadRuangan = () => {
        getRuangan(id)
            .then((response) => {
                setRuangan(response.data?.ruangan ?? null);
                setPasiens(response.data?.ruangan?.pasiens ?? []);
            })
            .catch((error: any) => {
                console.error('Gagal memuat ruangan', error);

                if (error.response?.status === 401) {
                    window.location.href = '/login';
                    return;
                }

                setError('Gagal mengambil data ruangan.');
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        loadRuangan();
        void loadPasienOptions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const handleAddPasien = async () => {
        const pasienId = Number(selectedPasien);

        if (!pasienId) {
            return;
        }

        setAdding(true);

        try {
            const response = await assignRuanganPasien(id, pasienId);

            setRuangan(response.data?.ruangan ?? ruangan);
            setPasiens(response.data?.ruangan?.pasiens ?? []);
            setSelectedPasien('');
            setShowForm(false);
        } catch (error: any) {
            console.error('Gagal menambahkan pasien', error);

            window.alert(
                error.response?.data?.message ||
                    'Gagal menambahkan pasien ke ruangan.',
            );
        } finally {
            setAdding(false);
        }
    };

    const handleRemovePasien = async (item: RuanganPasienItem) => {
        const confirmed = window.confirm(
            `Keluarkan ${item.name} dari ruangan?`,
        );

        if (!confirmed) {
            return;
        }

        try {
            const response = await removeRuanganPasien(id, item.id);

            setRuangan(response.data?.ruangan ?? ruangan);
            setPasiens(response.data?.ruangan?.pasiens ?? []);
        } catch (error: any) {
            console.error('Gagal mengeluarkan pasien', error);

            window.alert(
                error.response?.data?.message ||
                    'Gagal mengeluarkan pasien dari ruangan.',
            );
        }
    };

    const description = ruangan?.description
        ? ruangan.description[0].toUpperCase() + ruangan.description.slice(1)
        : '-';

    return (
        <>
            <Head
                title={ruangan ? `Detail ${ruangan.name}` : 'Detail Ruangan'}
            />

            <AppLayout wide>
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h2 className="text-lg font-bold text-gray-800 sm:text-xl">
                            Detail Ruangan
                        </h2>

                        <p className="mt-1 text-xs text-gray-400 sm:text-sm">
                            Informasi lengkap ruangan
                        </p>
                    </div>

                    <Link
                        href={
                            ruangan
                                ? `/ruangans/${ruangan.id}/edit`
                                : '/ruangans'
                        }
                        className="flex h-[43px] items-center gap-2 rounded-[12px] bg-[#084e7a] px-4 text-[13px] font-bold text-white transition hover:bg-[#063f62] hover:shadow-md active:scale-[0.99]"
                    >
                        Edit Ruangan
                    </Link>
                </div>

                {loading ? (
                    <div className="mt-4 rounded-xl bg-white p-10 text-center text-sm text-gray-400 shadow-sm">
                        Memuat data ruangan...
                    </div>
                ) : error ? (
                    <div className="mt-4 rounded-[10px] bg-red-50 px-3 py-2 text-[12px] text-red-500">
                        {error}
                    </div>
                ) : (
                    ruangan && (
                        <>
                            <div className="mt-4 rounded-xl bg-white p-5 shadow-sm sm:p-6">
                                <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                                    <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-[#07577f]/10">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-9 w-9 text-[#07577f]/60"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.4"
                                        >
                                            <path d="M4 21V4a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v17" />
                                            <path d="M8 7h2M14 7h2M8 11h2M14 11h2M8 15h2M14 15h2" />
                                            <path d="M10 21v-3h4v3" />
                                        </svg>
                                    </div>

                                    <div>
                                        <div className="flex flex-wrap items-center gap-2">
                                            <h3 className="text-base font-bold text-gray-800">
                                                {ruangan.name}
                                            </h3>

                                            <span className="rounded-md bg-[#07577f]/10 px-2 py-0.5 text-[11px] font-bold text-[#07577f]">
                                                {ruangan.code}
                                            </span>
                                        </div>

                                        <p className="mt-1 text-[12px]">
                                            <span className="font-semibold text-gray-700">
                                                {ruangan.category}
                                            </span>
                                        </p>
                                    </div>

                                    <span
                                        className={`ml-auto inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-semibold ${
                                            ruangan.is_active
                                                ? 'bg-green-50 text-green-600'
                                                : 'bg-gray-100 text-gray-500'
                                        }`}
                                    >
                                        <span
                                            className={`h-1.5 w-1.5 rounded-full ${
                                                ruangan.is_active
                                                    ? 'bg-green-500'
                                                    : 'bg-gray-400'
                                            }`}
                                        />

                                        {ruangan.is_active
                                            ? 'Aktif'
                                            : 'Nonaktif'}
                                    </span>
                                </div>

                                <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                                    {detailItem('ID', String(ruangan.id), true)}
                                    {detailItem('Kode', ruangan.code, true)}
                                    {detailItem(
                                        'Kategori',
                                        ruangan.category,
                                        true,
                                    )}
                                    {detailItem('Nama Ruangan', ruangan.name)}
                                    {detailItem(
                                        'Status',
                                        ruangan.is_active
                                            ? 'Aktif'
                                            : 'Nonaktif',
                                    )}
                                    <div className="col-span-2 lg:col-span-4">
                                        {detailItem('Deskripsi', description)}
                                    </div>
                                </div>
                            </div>

                            {/* PASIEN DI RUANGAN */}
                            <section className="mt-8">
                                <div className="flex flex-wrap items-center justify-between gap-4">
                                    <div>
                                        <h2 className="text-lg font-bold text-gray-800 sm:text-xl">
                                            Pasien {ruangan.name}
                                        </h2>

                                        <p className="mt-1 text-xs text-gray-400 sm:text-sm">
                                            Pasien yang menempati ruangan ini
                                        </p>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowForm((value) => !value)
                                        }
                                        className="flex h-[43px] shrink-0 items-center gap-2 rounded-[12px] bg-[#084e7a] px-4 text-[13px] font-bold text-white transition hover:bg-[#063f62] hover:shadow-md active:scale-[0.99]"
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
                                    </button>
                                </div>

                                {/* ADD FORM */}
                                {showForm && (
                                    <div className="mt-4 rounded-xl bg-white p-4 shadow-sm">
                                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                                            <select
                                                value={selectedPasien}
                                                onChange={(event) =>
                                                    setSelectedPasien(
                                                        event.target.value,
                                                    )
                                                }
                                                className="h-[42px] w-full rounded-[12px] bg-[#d9d9d9] px-[12px] text-[13px] text-gray-700 outline-none focus:bg-[#d5d5d5] focus:ring-2 focus:ring-[#084e7a]/30 sm:max-w-[380px]"
                                            >
                                                <option value="">
                                                    Pilih pasien...
                                                </option>

                                                {pasienOptions.map((pasien) => (
                                                    <option
                                                        key={pasien.id}
                                                        value={pasien.id}
                                                    >
                                                        {pasien.name} — RM{' '}
                                                        {
                                                            pasien.medical_record_number
                                                        }
                                                    </option>
                                                ))}
                                            </select>

                                            <button
                                                type="button"
                                                onClick={handleAddPasien}
                                                disabled={
                                                    adding || !selectedPasien
                                                }
                                                className="h-[42px] rounded-[12px] bg-[#07577f] px-5 text-[13px] font-bold text-white transition hover:bg-[#063f62] disabled:cursor-not-allowed disabled:opacity-60"
                                            >
                                                {adding
                                                    ? 'Menambahkan...'
                                                    : 'Masukkan'}
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setShowForm(false)
                                                }
                                                className="h-[42px] rounded-[12px] bg-[#d9d9d9] px-5 text-[13px] font-bold text-gray-600 transition hover:bg-[#c9c9c9]"
                                            >
                                                Batal
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* TABLE */}
                                <div className="mt-4 overflow-hidden rounded-xl bg-white shadow-sm">
                                    {pasiens.length === 0 ? (
                                        <div className="p-10 text-center text-sm text-gray-400">
                                            Belum ada pasien yang menempati
                                            ruangan ini.
                                        </div>
                                    ) : (
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-left text-[13px]">
                                                <thead>
                                                    <tr className="bg-[#f7f9fb] text-[11px] tracking-wider text-gray-400 uppercase">
                                                        <th className="px-4 py-3">
                                                            No
                                                        </th>
                                                        <th className="px-4 py-3">
                                                            Nama Pasien
                                                        </th>
                                                        <th className="px-4 py-3">
                                                            No. RM
                                                        </th>
                                                        <th className="px-4 py-3">
                                                            Jenis Kelamin
                                                        </th>
                                                        <th className="px-4 py-3">
                                                            Umur
                                                        </th>
                                                        <th className="px-4 py-3">
                                                            Tanggal Masuk
                                                        </th>
                                                        <th className="px-4 py-3 text-right">
                                                            Aksi
                                                        </th>
                                                    </tr>
                                                </thead>

                                                <tbody className="divide-y divide-gray-50">
                                                    {pasiens.map(
                                                        (item, index) => (
                                                            <tr
                                                                key={item.id}
                                                                className="transition hover:bg-[#f7f9fb]"
                                                            >
                                                                <td className="px-4 py-3 text-gray-500">
                                                                    {index + 1}
                                                                </td>

                                                                <td className="px-4 py-3 font-semibold text-gray-800">
                                                                    {item.name}
                                                                </td>

                                                                <td className="px-4 py-3 text-[#07577f]">
                                                                    {item.mrn ??
                                                                        '-'}
                                                                </td>

                                                                <td className="px-4 py-3 text-gray-600">
                                                                    {genderLabel(
                                                                        item.gender,
                                                                    )}
                                                                </td>

                                                                <td className="px-4 py-3 text-gray-600">
                                                                    {item.age ??
                                                                        '-'}{' '}
                                                                    thn
                                                                </td>

                                                                <td className="px-4 py-3 text-gray-600">
                                                                    {
                                                                        item.tanggal_masuk
                                                                    }
                                                                </td>

                                                                <td className="px-4 py-3 text-right">
                                                                    <button
                                                                        type="button"
                                                                        onClick={() =>
                                                                            handleRemovePasien(
                                                                                item,
                                                                            )
                                                                        }
                                                                        className="flex h-10 items-center gap-1.5 rounded-lg bg-red-50 px-3 text-[11px] font-semibold text-red-500 transition hover:bg-red-100 sm:h-8"
                                                                    >
                                                                        Keluar
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        ),
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>
                            </section>

                            <div className="mt-6 text-right">
                                <Link
                                    href="/ruangans"
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
