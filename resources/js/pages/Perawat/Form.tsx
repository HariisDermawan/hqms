import { Link } from '@inertiajs/react';
import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import type { Perawat, PerawatPayload } from '@/api/perawat';

interface PerawatFormProps {
    initial?: Perawat | null;
    processing: boolean;
    errors?: Record<string, string | undefined> & {
        general?: string;
    };
    onSubmit: (payload: PerawatPayload, image?: File) => void;
}

const inputClass =
    'w-full h-[42px] px-[12px] rounded-[12px] bg-[#d9d9d9] text-[13px] text-gray-700 placeholder:text-[#999] outline-none focus:bg-[#d5d5d5] focus:ring-2 focus:ring-[#084e7a]/30 transition';

const labelClass = 'block text-[13px] text-[#333] mb-[4px]';

export default function PerawatForm({
    initial,
    processing,
    errors = {},
    onSubmit,
}: PerawatFormProps) {
    const [code, setCode] = useState(initial?.code ?? '');
    const [name, setName] = useState(initial?.name ?? '');
    const [gender, setGender] = useState<'L' | 'P'>(initial?.gender ?? 'L');
    const [strNumber, setStrNumber] = useState(initial?.str_number ?? '');
    const [rfidId, setRfidId] = useState(initial?.rfid_id ?? '');
    const [phone, setPhone] = useState(initial?.phone ?? '');
    const [isActive, setIsActive] = useState(initial?.is_active ?? true);

    const [image, setImage] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);

    useEffect(() => {
        setPreview(initial?.image_url ?? null);
    }, [initial?.image_url]);

    const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];

        if (!file) {
            return;
        }

        setImage(file);
        setPreview(URL.createObjectURL(file));
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        onSubmit(
            {
                code,
                name,
                gender,
                str_number: strNumber,
                rfid_id: rfidId || undefined,
                phone: phone || undefined,
                is_active: isActive,
            },
            image ?? undefined,
        );
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
                {/* FOTO / IMAGE */}
                <div className="sm:col-span-2">
                    <span className={labelClass}>Foto</span>

                    <div className="flex items-center gap-4">
                        <div className="flex h-[88px] w-[88px] shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#f7f9fb]">
                            {preview ? (
                                <img
                                    src={preview}
                                    alt="Preview"
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-8 w-8 text-gray-300"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                >
                                    <circle cx="12" cy="8" r="3.5" />
                                    <path d="M5 20c.8-3.3 3.2-5 7-5s6.2 1.7 7 5" />
                                    <path d="M18 4v4M16 6h4" />
                                </svg>
                            )}
                        </div>

                        <div className="flex-1">
                            <label className="inline-flex h-[43px] cursor-pointer items-center gap-2 rounded-[12px] bg-[#d9d9d9] px-5 text-[13px] font-bold text-gray-600 transition hover:bg-[#c9c9c9]">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                >
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                    <path d="m17 8-5-5-5 5M12 3v12" />
                                </svg>

                                {initial
                                    ? image
                                        ? 'Ganti Foto'
                                        : 'Ubah Foto'
                                    : 'Pilih Foto'}

                                <input
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp"
                                    onChange={handleImageChange}
                                    className="hidden"
                                />
                            </label>

                            <p className="mt-2 text-[11px] text-gray-400">
                                {initial
                                    ? 'Kosongkan jika tidak ingin mengubah foto'
                                    : 'Format JPG, PNG, WebP. Maks 2MB'}{' '}
                                {image && (
                                    <span className="text-[#07577f]">
                                        — {image.name}
                                    </span>
                                )}
                            </p>
                        </div>
                    </div>

                    {errors.image && (
                        <p className="mt-1 text-[11px] text-red-500">
                            {errors.image}
                        </p>
                    )}
                </div>

                {/* KODE */}
                <div>
                    <label htmlFor="code" className={labelClass}>
                        Kode
                    </label>

                    <input
                        id="code"
                        type="text"
                        value={code}
                        onChange={(event) =>
                            setCode(event.target.value.toUpperCase())
                        }
                        placeholder="Contoh: PRW001"
                        maxLength={20}
                        className={inputClass}
                    />

                    {errors.code && (
                        <p className="mt-1 text-[11px] text-red-500">
                            {errors.code}
                        </p>
                    )}
                </div>

                {/* NAMA */}
                <div>
                    <label htmlFor="name" className={labelClass}>
                        Nama Perawat
                    </label>

                    <input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        placeholder="Contoh: Ns. Rina Marlina, S.Kep"
                        className={inputClass}
                    />

                    {errors.name && (
                        <p className="mt-1 text-[11px] text-red-500">
                            {errors.name}
                        </p>
                    )}
                </div>

                {/* JENIS KELAMIN */}
                <div>
                    <label htmlFor="gender" className={labelClass}>
                        Jenis Kelamin
                    </label>

                    <select
                        id="gender"
                        value={gender}
                        onChange={(event) =>
                            setGender(event.target.value as 'L' | 'P')
                        }
                        className={inputClass}
                    >
                        <option value="L">Laki-laki</option>
                        <option value="P">Perempuan</option>
                    </select>

                    {errors.gender && (
                        <p className="mt-1 text-[11px] text-red-500">
                            {errors.gender}
                        </p>
                    )}
                </div>

                {/* NO STR */}
                <div>
                    <label htmlFor="str_number" className={labelClass}>
                        No. STR
                    </label>

                    <input
                        id="str_number"
                        type="text"
                        value={strNumber}
                        onChange={(event) => setStrNumber(event.target.value)}
                        placeholder="Nomor Surat Tanda Registrasi"
                        maxLength={50}
                        className={inputClass}
                    />

                    {errors.str_number && (
                        <p className="mt-1 text-[11px] text-red-500">
                            {errors.str_number}
                        </p>
                    )}
                </div>

                {/* RFID ID / KARTU */}
                <div>
                    <label htmlFor="rfid_id" className={labelClass}>
                        No. Kartu RFID
                    </label>

                    <input
                        id="rfid_id"
                        type="text"
                        value={rfidId}
                        onChange={(event) => setRfidId(event.target.value)}
                        placeholder="Nomor/iD kartu untuk absen"
                        maxLength={64}
                        className={inputClass}
                    />

                    {errors.rfid_id && (
                        <p className="mt-1 text-[11px] text-red-500">
                            {errors.rfid_id}
                        </p>
                    )}
                </div>

                {/* NO HP */}
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
                        maxLength={20}
                        className={inputClass}
                    />

                    {errors.phone && (
                        <p className="mt-1 text-[11px] text-red-500">
                            {errors.phone}
                        </p>
                    )}
                </div>

                {/* STATUS AKTIF */}
                <div className="sm:col-span-2">
                    <span className={labelClass}>Status</span>

                    <button
                        type="button"
                        onClick={() => setIsActive((active) => !active)}
                        className={`flex h-[42px] w-full items-center gap-3 rounded-[12px] border-2 px-3 text-[13px] font-semibold transition sm:w-[260px] ${
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
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
                <Link
                    href="/perawats"
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
