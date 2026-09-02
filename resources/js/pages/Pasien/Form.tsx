import { Link } from '@inertiajs/react';
import { useEffect, useState, type FormEvent } from 'react';
import type { Gender, Pasien, PasienPayload } from '@/api/pasien';
import { getPolis, type Poli } from '@/api/poli';

interface PasienFormProps {
    initial?: Pasien | null;
    processing: boolean;
    errors?: Record<string, string | undefined> & {
        general?: string;
    };
    onSubmit: (payload: PasienPayload) => void;
}

const inputClass =
    'w-full h-[42px] px-[12px] rounded-[12px] bg-[#d9d9d9] text-[13px] text-gray-700 placeholder:text-[#999] outline-none focus:bg-[#d5d5d5] focus:ring-2 focus:ring-[#084e7a]/30 transition';

const labelClass = 'block text-[13px] text-[#333] mb-[4px]';

const calcAge = (birthDate: string): number => {
    if (!birthDate) {
        return 0;
    }

    const birth = new Date(birthDate);
    const today = new Date();

    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();

    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
        age -= 1;
    }

    return age;
};

export default function PasienForm({
    initial,
    processing,
    errors = {},
    onSubmit,
}: PasienFormProps) {
    const [poliId, setPoliId] = useState(initial?.poli?.id ?? 0);
    const [medicalRecordNumber, setMedicalRecordNumber] = useState(
        initial?.medical_record_number ?? '',
    );
    const [name, setName] = useState(initial?.name ?? '');
    const [nik, setNik] = useState(initial?.nik ?? '');
    const [gender, setGender] = useState<Gender>(initial?.gender ?? 'L');
    const [birthDate, setBirthDate] = useState(initial?.birth_date ?? '');
    const [phone, setPhone] = useState(initial?.phone ?? '');
    const [address, setAddress] = useState(initial?.address ?? '');
    const [isActive, setIsActive] = useState(initial?.is_active ?? true);

    const [polis, setPolis] = useState<Poli[]>([]);
    const [polisLoading, setPolisLoading] = useState(true);

    useEffect(() => {
        getPolis()
            .then((response) => {
                setPolis(response.data?.items ?? []);
            })
            .catch(() => {
                setPolis([]);
            })
            .finally(() => {
                setPolisLoading(false);
            });
    }, []);

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        onSubmit({
            poli_id: Number(poliId),
            medical_record_number: medicalRecordNumber,
            name,
            nik,
            gender,
            birth_date: birthDate,
            phone: phone || undefined,
            address: address || undefined,
            is_active: isActive,
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

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* POLI */}
                <div>
                    <label htmlFor="poli_id" className={labelClass}>
                        Poli
                    </label>

                    <select
                        id="poli_id"
                        value={poliId}
                        onChange={(event) =>
                            setPoliId(Number(event.target.value))
                        }
                        disabled={polisLoading}
                        className={inputClass}
                    >
                        <option value={0}>
                            {polisLoading ? 'Memuat poli...' : 'Pilih Poli'}
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

                {/* NOMOR REKAM MEDIS */}
                <div>
                    <label
                        htmlFor="medical_record_number"
                        className={labelClass}
                    >
                        No. Rekam Medis
                    </label>

                    <input
                        id="medical_record_number"
                        type="text"
                        value={medicalRecordNumber}
                        onChange={(event) =>
                            setMedicalRecordNumber(event.target.value)
                        }
                        placeholder="Contoh: RM000001"
                        className={inputClass}
                    />

                    {errors.medical_record_number && (
                        <p className="mt-1 text-[11px] text-red-500">
                            {errors.medical_record_number}
                        </p>
                    )}
                </div>

                {/* NAMA */}
                <div>
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

                {/* JENIS KELAMIN */}
                <div>
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

                        <div className="flex h-[42px] w-[80px] shrink-0 items-center justify-center rounded-[12px] bg-[#07577f]/10 text-[13px] font-bold text-[#07577f]">
                            {calcAge(birthDate)} th
                        </div>
                    </div>

                    {errors.birth_date && (
                        <p className="mt-1 text-[11px] text-red-500">
                            {errors.birth_date}
                        </p>
                    )}
                </div>

                {/* NO. HP */}
                <div>
                    <label htmlFor="phone" className={labelClass}>
                        No. HP
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

                {/* STATUS AKTIF */}
                <div>
                    <span className={labelClass}>Status</span>

                    <button
                        type="button"
                        onClick={() => setIsActive((active) => !active)}
                        className={`flex h-[42px] w-full items-center gap-3 rounded-[12px] border-2 px-3 text-[13px] font-semibold transition ${
                            isActive
                                ? 'border-green-500/40 bg-green-50 text-green-600'
                                : 'border-[#d9d9d9] bg-[#d9d9d9] text-gray-500'
                        }`}
                    >
                        <span
                            className={`flex h-5 w-5 items-center justify-center rounded-full border-2 transition ${
                                isActive
                                    ? 'border-green-500 bg-green-500 text-white'
                                    : 'border-gray-300 bg-white'
                            }`}
                        >
                            {isActive && (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-3 w-3"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="3"
                                >
                                    <path d="M20 6 9 17l-5-5" />
                                </svg>
                            )}
                        </span>

                        {isActive ? 'Aktif' : 'Nonaktif'}
                    </button>

                    {errors.is_active && (
                        <p className="mt-1 text-[11px] text-red-500">
                            {errors.is_active}
                        </p>
                    )}
                </div>

                {/* ALAMAT */}
                <div className="sm:col-span-2">
                    <label htmlFor="address" className={labelClass}>
                        Alamat
                    </label>

                    <textarea
                        id="address"
                        value={address}
                        onChange={(event) => setAddress(event.target.value)}
                        placeholder="Alamat lengkap pasien"
                        rows={3}
                        className="w-full rounded-[12px] bg-[#d9d9d9] px-[12px] py-[10px] text-[13px] text-gray-700 transition outline-none placeholder:text-[#999] focus:bg-[#d5d5d5] focus:ring-2 focus:ring-[#084e7a]/30"
                    />

                    {errors.address && (
                        <p className="mt-1 text-[11px] text-red-500">
                            {errors.address}
                        </p>
                    )}
                </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
                <Link
                    href="/pasiens"
                    className="h-[43px] rounded-[12px] bg-[#d9d9d9] px-5 text-[13px] font-bold text-gray-600 transition hover:bg-[#c9c9c9]"
                >
                    Batal
                </Link>

                <button
                    type="submit"
                    disabled={processing}
                    className="h-[43px] rounded-[12px] bg-[#084e7a] px-6 text-[13px] font-bold text-white transition hover:bg-[#063f62] hover:shadow-md active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {processing ? 'Menyimpan...' : 'Simpan'}
                </button>
            </div>
        </form>
    );
}
