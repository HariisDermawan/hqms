import { Link } from '@inertiajs/react';
import { useState, type FormEvent } from 'react';
import type { Ruangan, RuanganPayload } from '@/api/ruangan';

interface RuanganFormProps {
    initial?: Ruangan | null;
    processing: boolean;
    errors?: Record<string, string | undefined> & {
        general?: string;
    };
    onSubmit: (payload: RuanganPayload) => void;
}

const inputClass =
    'w-full h-[42px] px-[12px] rounded-[12px] bg-[#d9d9d9] text-[13px] text-gray-700 placeholder:text-[#999] outline-none focus:bg-[#d5d5d5] focus:ring-2 focus:ring-[#084e7a]/30 transition';

const labelClass = 'block text-[13px] text-[#333] mb-[4px]';

const CATEGORIES = [
    'IGD',
    'Poli',
    'Ruang Pemeriksaan',
    'Ruang Rawat Inap',
    'Kamar VIP',
    'Kamar Kelas 1',
    'Kamar Kelas 2',
    'Kamar Kelas 3',
    'Isolasi',
    'ICU',
    'NICU',
    'PICU',
    'Ruang Operasi',
    'Ruang Khusus',
];

export default function RuanganForm({
    initial,
    processing,
    errors = {},
    onSubmit,
}: RuanganFormProps) {
    const [code, setCode] = useState(initial?.code ?? '');
    const [name, setName] = useState(initial?.name ?? '');
    const [category, setCategory] = useState(initial?.category ?? '');
    const [description, setDescription] = useState(initial?.description ?? '');
    const [isActive, setIsActive] = useState(initial?.is_active ?? true);

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        onSubmit({
            code,
            name,
            category,
            description: description || undefined,
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
                        placeholder="Contoh: A-01"
                        maxLength={50}
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
                        Nama Ruangan
                    </label>

                    <input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        placeholder="Contoh: Ruang Anggrek 01"
                        className={inputClass}
                    />

                    {errors.name && (
                        <p className="mt-1 text-[11px] text-red-500">
                            {errors.name}
                        </p>
                    )}
                </div>

                {/* KATEGORI */}
                <div>
                    <label htmlFor="category" className={labelClass}>
                        Kategori
                    </label>

                    <select
                        id="category"
                        value={category}
                        onChange={(event) => setCategory(event.target.value)}
                        className={inputClass}
                    >
                        <option value="">Pilih kategori ruangan...</option>

                        {CATEGORIES.map((item) => (
                            <option key={item} value={item}>
                                {item}
                            </option>
                        ))}
                    </select>

                    {errors.category && (
                        <p className="mt-1 text-[11px] text-red-500">
                            {errors.category}
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

                {/* DESKRIPSI */}
                <div className="sm:col-span-2">
                    <label htmlFor="description" className={labelClass}>
                        Deskripsi
                    </label>

                    <textarea
                        id="description"
                        value={description}
                        onChange={(event) => setDescription(event.target.value)}
                        placeholder="Deskripsi singkat ruangan"
                        rows={3}
                        className="w-full rounded-[12px] bg-[#d9d9d9] px-[12px] py-[10px] text-[13px] text-gray-700 transition outline-none placeholder:text-[#999] focus:bg-[#d5d5d5] focus:ring-2 focus:ring-[#084e7a]/30"
                    />

                    {errors.description && (
                        <p className="mt-1 text-[11px] text-red-500">
                            {errors.description}
                        </p>
                    )}
                </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
                <Link
                    href="/ruangans"
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
