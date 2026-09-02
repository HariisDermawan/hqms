import { Link } from '@inertiajs/react';
import { useEffect, useState, type FormEvent } from 'react';
import { getAntrian, type Antrian } from '@/api/antrian';
import type { Gender } from '@/api/pasien';
import { type Pendaftaran, type PendaftaranStatus } from '@/api/pendaftaran';
import { getPolis, type Poli } from '@/api/poli';

export const STATUS_OPTIONS: {
    value: PendaftaranStatus;
    label: string;
}[] = [
    { value: 'waiting', label: 'Menunggu' },
    { value: 'called', label: 'Dipanggil' },
    { value: 'serving', label: 'Dilayani' },
    { value: 'completed', label: 'Selesai' },
    { value: 'cancelled', label: 'Dibatalkan' },
];

const STATUS_LABELS: Record<PendaftaranStatus, string> = Object.fromEntries(
    STATUS_OPTIONS.map((item) => [item.value, item.label]),
) as Record<PendaftaranStatus, string>;

export const statusLabel = (status: PendaftaranStatus): string =>
    STATUS_LABELS[status] ?? status;

export const statusBadgeClass = (status: PendaftaranStatus): string => {
    switch (status) {
        case 'waiting':
            return 'bg-amber-50 text-amber-600';
        case 'called':
            return 'bg-blue-50 text-blue-600';
        case 'serving':
            return 'bg-indigo-50 text-indigo-600';
        case 'completed':
            return 'bg-green-50 text-green-600';
        case 'cancelled':
            return 'bg-red-50 text-red-500';
        default:
            return 'bg-gray-100 text-gray-500';
    }
};

const todayLocal = (): string => {
    const now = new Date();

    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
};

const calcAge = (birthDate: string): number => {
    if (!birthDate) {
        return 0;
    }

    const birth = new Date(birthDate);
    const today = new Date();

    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
        age -= 1;
    }

    return age;
};

export interface PendaftaranPasienValues {
    name: string;
    nik: string;
    gender: Gender;
    birth_date: string;
    phone?: string;
    address?: string;
}

export interface PendaftaranFormValues {
    antrian_id?: number | null;
    pasien_id?: number;
    poli_id?: number | null;
    registration_date: string;
    notes?: string;
    status?: PendaftaranStatus;
    pasien?: PendaftaranPasienValues;
}

interface PendaftaranFormProps {
    antrianId?: number;
    initial?: Pendaftaran | null;
    processing: boolean;
    errors?: Record<string, string | undefined> & {
        general?: string;
    };
    onSubmit: (payload: PendaftaranFormValues) => void;
}

const inputClass =
    'w-full h-[42px] px-[12px] rounded-[12px] bg-[#d9d9d9] text-[13px] text-gray-700 placeholder:text-[#999] outline-none focus:bg-[#d5d5d5] focus:ring-2 focus:ring-[#084e7a]/30 transition';

const labelClass = 'block text-[13px] text-[#333] mb-[4px]';

export default function PendaftaranForm({
    antrianId = 0,
    initial,
    processing,
    errors = {},
    onSubmit,
}: PendaftaranFormProps) {
    const [polis, setPolis] = useState<Poli[]>([]);
    const [optionsLoaded, setOptionsLoaded] = useState(false);
    const [antrian, setAntrian] = useState<Antrian | null>(null);

    const [name, setName] = useState(initial?.pasien?.name ?? '');
    const [nik, setNik] = useState(initial?.pasien?.nik ?? '');
    const [gender, setGender] = useState<Gender>('L');
    const [birthDate, setBirthDate] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');

    const [poliId, setPoliId] = useState('');
    const [registrationDate, setRegistrationDate] = useState('');
    const [status, setStatus] = useState<PendaftaranStatus>('waiting');
    const [notes, setNotes] = useState('');

    useEffect(() => {
        getPolis(1, 100)
            .then((polisResponse) => {
                setPolis(polisResponse.data?.items ?? []);
            })
            .catch((error: any) => {
                console.error('Gagal memuat opsi poli', error);

                if (error.response?.status === 401) {
                    window.location.href = '/login';
                }
            })
            .finally(() => {
                setOptionsLoaded(true);
            });
    }, []);

    useEffect(() => {
        if (!antrianId) {
            setAntrian(null);
            return;
        }

        getAntrian(antrianId)
            .then((response) => {
                setAntrian(response.data?.antrian ?? null);
            })
            .catch((error: any) => {
                console.error('Gagal memuat tiket antrean', error);

                if (error.response?.status === 401) {
                    window.location.href = '/login';
                }
            });
    }, [antrianId]);

    useEffect(() => {
        if (!optionsLoaded) {
            return;
        }

        setPoliId(
            initial?.poli?.id
                ? String(initial.poli.id)
                : antrian?.poli?.id
                  ? String(antrian.poli.id)
                  : '',
        );
        setRegistrationDate(initial?.registration_date ?? todayLocal());
        setStatus(initial?.status ?? 'waiting');
        setNotes(initial?.notes ?? '');
    }, [optionsLoaded, initial, antrian]);

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (initial) {
            onSubmit({
                pasien_id: initial.pasien?.id ?? 0,
                poli_id: Number(poliId),
                registration_date: registrationDate,
                notes: notes.trim() || undefined,
                status,
            });

            return;
        }

        onSubmit({
            antrian_id: antrian ? antrian.id : null,
            poli_id: Number(poliId),
            registration_date: registrationDate,
            notes: notes.trim() || undefined,
            pasien: {
                name: name.trim(),
                nik: nik.trim(),
                gender,
                birth_date: birthDate,
                phone: phone.trim() || undefined,
                address: address.trim() || undefined,
            },
        });
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="mt-4 rounded-xl bg-white p-5 shadow-sm sm:p-6"
        >
            {errors.general && (
                <div className="mb-4 rounded-[10px] bg-red-50 px-3 py-2 text-[12px] text-red-500">
                    {errors.general}
                </div>
            )}

            {antrian && (
                <div className="mb-5 flex flex-wrap items-center justify-between gap-2 rounded-xl bg-[#07577f] px-4 py-3 text-white">
                    <div>
                        <p className="text-[10px] font-semibold tracking-[0.14em] text-white/50 uppercase">
                            Tiket antrean dipanggil
                        </p>
                        <p className="text-sm font-bold">
                            {antrian.queue_number}
                        </p>
                    </div>

                    <div className="text-right">
                        <p className="text-[10px] font-semibold tracking-[0.14em] text-white/50 uppercase">
                            Poli
                        </p>
                        <p className="text-sm font-bold">
                            {antrian.poli?.name ?? '-'}
                        </p>
                    </div>
                </div>
            )}

            <h3 className="text-[11px] font-bold tracking-wide text-gray-400 uppercase">
                Data Pasien
            </h3>

            {initial ? (
                <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                        <label className={labelClass}>Pasien</label>

                        <p className="mt-[6px] rounded-[12px] bg-[#f7f9fb] px-[12px] py-[10px] text-[13px] font-semibold text-gray-700">
                            {initial.pasien?.name ?? '-'}
                        </p>
                    </div>

                    <div>
                        <label className={labelClass}>No. Rekam Medis</label>

                        <p className="mt-[6px] rounded-[12px] bg-[#f7f9fb] px-[12px] py-[10px] text-[13px] font-semibold text-gray-700">
                            {initial.pasien?.medical_record_number ?? '-'}
                        </p>
                    </div>
                </div>
            ) : (
                <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {/* NAMA */}
                    <div className="sm:col-span-2">
                        <label htmlFor="name" className={labelClass}>
                            Nama Lengkap
                        </label>

                        <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                            placeholder="Nama pasien"
                            className={inputClass}
                        />

                        {errors.name && (
                            <p className="mt-1 text-[11px] text-red-500">
                                {errors.name}
                            </p>
                        )}
                    </div>

                    {/* NIK */}
                    <div>
                        <label htmlFor="nik" className={labelClass}>
                            NIK
                        </label>

                        <input
                            id="nik"
                            type="text"
                            value={nik}
                            onChange={(event) => setNik(event.target.value)}
                            placeholder="16 digit NIK"
                            maxLength={16}
                            className={inputClass}
                        />

                        {errors.nik && (
                            <p className="mt-1 text-[11px] text-red-500">
                                {errors.nik}
                            </p>
                        )}
                    </div>

                    {/* TANGGAL LAHIR + UMUR */}
                    <div>
                        <label htmlFor="birth_date" className={labelClass}>
                            Tanggal Lahir
                        </label>

                        <div className="flex gap-3">
                            <input
                                id="birth_date"
                                type="date"
                                value={birthDate}
                                onChange={(event) =>
                                    setBirthDate(event.target.value)
                                }
                                className={`${inputClass} min-w-0 flex-1`}
                            />

                            <div className="flex h-[42px] w-[70px] shrink-0 items-center justify-center rounded-[12px] bg-[#07577f]/10 text-[13px] font-bold text-[#07577f]">
                                {calcAge(birthDate)} th
                            </div>
                        </div>

                        {errors.birth_date && (
                            <p className="mt-1 text-[11px] text-red-500">
                                {errors.birth_date}
                            </p>
                        )}
                    </div>

                    {/* JENIS KELAMIN */}
                    <div className="sm:col-span-2">
                        <span className={labelClass}>Jenis Kelamin</span>

                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={() => setGender('L')}
                                className={`h-[42px] flex-1 rounded-[12px] border-2 text-[13px] font-semibold transition ${
                                    gender === 'L'
                                        ? 'border-[#084e7a] bg-[#084e7a]/10 text-[#084e7a]'
                                        : 'border-[#d9d9d9] bg-[#d9d9d9] text-gray-500'
                                }`}
                            >
                                Laki-laki
                            </button>

                            <button
                                type="button"
                                onClick={() => setGender('P')}
                                className={`h-[42px] flex-1 rounded-[12px] border-2 text-[13px] font-semibold transition ${
                                    gender === 'P'
                                        ? 'border-[#084e7a] bg-[#084e7a]/10 text-[#084e7a]'
                                        : 'border-[#d9d9d9] bg-[#d9d9d9] text-gray-500'
                                }`}
                            >
                                Perempuan
                            </button>
                        </div>

                        {errors.gender && (
                            <p className="mt-1 text-[11px] text-red-500">
                                {errors.gender}
                            </p>
                        )}
                    </div>

                    {/* NO. HP */}
                    <div>
                        <label htmlFor="phone" className={labelClass}>
                            No. HP{' '}
                            <span className="font-normal text-gray-400">
                                (opsional)
                            </span>
                        </label>

                        <input
                            id="phone"
                            type="text"
                            value={phone}
                            onChange={(event) => setPhone(event.target.value)}
                            placeholder="Contoh: 081234567890"
                            className={inputClass}
                        />

                        {errors.phone && (
                            <p className="mt-1 text-[11px] text-red-500">
                                {errors.phone}
                            </p>
                        )}
                    </div>

                    {/* ALAMAT */}
                    <div>
                        <label htmlFor="address" className={labelClass}>
                            Alamat{' '}
                            <span className="font-normal text-gray-400">
                                (opsional)
                            </span>
                        </label>

                        <textarea
                            id="address"
                            value={address}
                            onChange={(event) => setAddress(event.target.value)}
                            placeholder="Alamat lengkap pasien"
                            rows={2}
                            className="w-full rounded-[12px] bg-[#d9d9d9] px-[12px] py-[10px] text-[13px] text-gray-700 transition outline-none placeholder:text-[#999] focus:bg-[#d5d5d5] focus:ring-2 focus:ring-[#084e7a]/30"
                        />

                        {errors.address && (
                            <p className="mt-1 text-[11px] text-red-500">
                                {errors.address}
                            </p>
                        )}
                    </div>

                    <p className="text-[11px] text-gray-400 sm:col-span-2">
                        No. Rekam Medis dibuat otomatis oleh sistem setelah
                        pasien terdaftar.
                    </p>
                </div>
            )}

            <h3 className="mt-6 text-[11px] font-bold tracking-wide text-gray-400 uppercase">
                Pendaftaran
            </h3>

            <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* POLI */}
                <div>
                    <label htmlFor="poli_id" className={labelClass}>
                        Poli
                    </label>

                    <select
                        id="poli_id"
                        value={poliId}
                        onChange={(event) => setPoliId(event.target.value)}
                        disabled={
                            Boolean(antrian) ||
                            !optionsLoaded ||
                            Boolean(initial)
                        }
                        className={`${inputClass} disabled:cursor-not-allowed disabled:opacity-60`}
                    >
                        <option value="">
                            {optionsLoaded ? 'Pilih poli...' : 'Memuat poli...'}
                        </option>

                        {polis.map((poli) => (
                            <option key={poli.id} value={poli.id}>
                                {poli.name}
                            </option>
                        ))}
                    </select>

                    {errors.poli_id && (
                        <p className="mt-1 text-[11px] text-red-500">
                            {errors.poli_id}
                        </p>
                    )}
                </div>

                {/* TANGGAL */}
                <div>
                    <label htmlFor="registration_date" className={labelClass}>
                        Tanggal Periksa
                    </label>

                    <input
                        id="registration_date"
                        type="date"
                        value={registrationDate}
                        onChange={(event) =>
                            setRegistrationDate(event.target.value)
                        }
                        className={inputClass}
                    />

                    {errors.registration_date && (
                        <p className="mt-1 text-[11px] text-red-500">
                            {errors.registration_date}
                        </p>
                    )}
                </div>

                {/* STATUS (hanya edit) */}
                {initial && (
                    <div>
                        <label htmlFor="status" className={labelClass}>
                            Status
                        </label>

                        <select
                            id="status"
                            value={status}
                            onChange={(event) =>
                                setStatus(
                                    event.target.value as PendaftaranStatus,
                                )
                            }
                            className={inputClass}
                        >
                            {STATUS_OPTIONS.map((item) => (
                                <option key={item.value} value={item.value}>
                                    {item.label}
                                </option>
                            ))}
                        </select>

                        {errors.status && (
                            <p className="mt-1 text-[11px] text-red-500">
                                {errors.status}
                            </p>
                        )}
                    </div>
                )}

                {/* CATATAN */}
                <div className="sm:col-span-2">
                    <label htmlFor="notes" className={labelClass}>
                        Catatan{' '}
                        <span className="font-normal text-gray-400">
                            (opsional)
                        </span>
                    </label>

                    <textarea
                        id="notes"
                        value={notes}
                        onChange={(event) => setNotes(event.target.value)}
                        rows={3}
                        placeholder="Catatan keluhan, rujukan, atau keterangan tambahan..."
                        className="w-full rounded-[12px] bg-[#d9d9d9] px-[12px] py-[10px] text-[13px] text-gray-700 transition outline-none placeholder:text-[#999] focus:bg-[#d5d5d5] focus:ring-2 focus:ring-[#084e7a]/30"
                    />

                    {errors.notes && (
                        <p className="mt-1 text-[11px] text-red-500">
                            {errors.notes}
                        </p>
                    )}
                </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
                <Link
                    href="/pendaftarans"
                    className="h-[43px] rounded-[12px] bg-[#d9d9d9] px-5 text-[13px] font-bold text-gray-600 transition hover:bg-[#c9c9c9]"
                >
                    Batal
                </Link>

                <button
                    type="submit"
                    disabled={processing}
                    className="h-[43px] rounded-[12px] bg-[#084e7a] px-6 text-[13px] font-bold text-white transition hover:bg-[#063f62] hover:shadow-md active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {processing
                        ? 'Menyimpan...'
                        : initial
                          ? 'Simpan Perubahan'
                          : 'Daftarkan'}
                </button>
            </div>
        </form>
    );
}
