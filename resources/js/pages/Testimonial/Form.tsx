import { Link } from '@inertiajs/react';
import { useEffect, useState, type FormEvent } from 'react';
import { getPasiens, type Pasien } from '@/api/pasien';
import type { Testimonial, TestimonialPayload } from '@/api/testimonial';

interface TestimonialFormProps {
    initial?: Testimonial | null;
    processing: boolean;
    errors?: Record<string, string | undefined> & {
        general?: string;
    };
    onSubmit: (payload: TestimonialPayload) => void;
}

const inputClass =
    'w-full h-[42px] px-[12px] rounded-[12px] bg-[#d9d9d9] text-[13px] text-gray-700 placeholder:text-[#999] outline-none focus:bg-[#d5d5d5] focus:ring-2 focus:ring-[#084e7a]/30 transition';

const textareaClass =
    'w-full rounded-[12px] bg-[#d9d9d9] px-[12px] py-[10px] text-[13px] text-gray-700 transition outline-none placeholder:text-[#999] focus:bg-[#d5d5d5] focus:ring-2 focus:ring-[#084e7a]/30';

const labelClass = 'block text-[13px] text-[#333] mb-[4px]';

export default function TestimonialForm({
    initial,
    processing,
    errors = {},
    onSubmit,
}: TestimonialFormProps) {
    const [pasiens, setPasiens] = useState<Pasien[]>([]);
    const [pasiensLoaded, setPasiensLoaded] = useState(false);

    const [pasienId, setPasienId] = useState(
        initial?.pasien?.id ? String(initial.pasien.id) : '',
    );
    const [name, setName] = useState(initial?.name ?? '');
    const [role, setRole] = useState(initial?.role ?? 'Pasien');
    const [message, setMessage] = useState(initial?.message ?? '');
    const [rating, setRating] = useState(initial?.rating ?? 5);
    const [sortOrder, setSortOrder] = useState(
        initial?.sort_order?.toString() ?? '0',
    );
    const [isActive, setIsActive] = useState(initial?.is_active ?? true);

    useEffect(() => {
        getPasiens(1, 100)
            .then((response) => {
                setPasiens(response.data?.items ?? []);
            })
            .catch((error: any) => {
                console.error('Gagal memuat daftar pasien', error);

                if (error.response?.status === 401) {
                    window.location.href = '/login';
                }
            })
            .finally(() => {
                setPasiensLoaded(true);
            });
    }, []);

    useEffect(() => {
        if (!pasiensLoaded) {
            return;
        }

        setPasienId(initial?.pasien?.id ? String(initial.pasien.id) : '');
    }, [initial, pasiensLoaded]);

    const handlePasienChange = (value: string) => {
        setPasienId(value);

        if (!value) {
            return;
        }

        const pasien = pasiens.find((item) => item.id === Number(value));

        if (pasien) {
            setName(pasien.name);
            setRole('Pasien');
        }
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        onSubmit({
            pasien_id: pasienId ? Number(pasienId) : null,
            name: name.trim(),
            role: role.trim() || undefined,
            message: message.trim(),
            rating,
            sort_order: Number(sortOrder),
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
                {/* PASIEN */}
                <div className="sm:col-span-2">
                    <label htmlFor="pasien_id" className={labelClass}>
                        Pasien
                    </label>

                    <select
                        id="pasien_id"
                        value={pasienId}
                        onChange={(event) =>
                            handlePasienChange(event.target.value)
                        }
                        className={inputClass}
                    >
                        <option value="">Pilih pasien...</option>

                        {pasiens.map((pasien) => (
                            <option key={pasien.id} value={pasien.id}>
                                {pasien.name}
                                {pasien.medical_record_number
                                    ? ` — ${pasien.medical_record_number}`
                                    : ''}
                            </option>
                        ))}
                    </select>

                    <p className="mt-1 text-[11px] text-gray-400">
                        Nama dan peran otomatis terisi dari pasien yang dipilih.
                    </p>

                    {errors.pasien_id && (
                        <p className="mt-1 text-[11px] text-red-500">
                            {errors.pasien_id}
                        </p>
                    )}
                </div>

                {/* NAMA */}
                <div>
                    <label htmlFor="name" className={labelClass}>
                        Nama
                    </label>

                    <input
                        id="name"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        placeholder="Nama pemberi testimoni..."
                        className={inputClass}
                    />

                    {errors.name && (
                        <p className="mt-1 text-[11px] text-red-500">
                            {errors.name}
                        </p>
                    )}
                </div>

                {/* PERAN */}
                <div>
                    <label htmlFor="role" className={labelClass}>
                        Peran{' '}
                        <span className="font-normal text-gray-400">
                            (opsional)
                        </span>
                    </label>

                    <input
                        id="role"
                        value={role}
                        onChange={(event) => setRole(event.target.value)}
                        placeholder="Contoh: Pasien"
                        className={inputClass}
                    />

                    {errors.role && (
                        <p className="mt-1 text-[11px] text-red-500">
                            {errors.role}
                        </p>
                    )}
                </div>

                {/* RATING */}
                <div>
                    <span className={labelClass}>Rating</span>

                    <div className="flex h-[42px] items-center gap-1">
                        {[1, 2, 3, 4, 5].map((value) => (
                            <button
                                key={value}
                                type="button"
                                onClick={() => setRating(value)}
                                className="p-0.5"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className={`h-7 w-7 transition ${
                                        value <= rating
                                            ? 'text-amber-400'
                                            : 'text-gray-300'
                                    }`}
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                >
                                    <path d="M12 2.6l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 17.6l-5.8 3-1.1-6.5L.4 9.4l6.5-.9L12 2.6z" />
                                </svg>
                            </button>
                        ))}

                        <span className="ml-1 text-[13px] font-bold text-gray-700">
                            {rating}/5
                        </span>
                    </div>

                    {errors.rating && (
                        <p className="mt-1 text-[11px] text-red-500">
                            {errors.rating}
                        </p>
                    )}
                </div>

                {/* URUTAN */}
                <div>
                    <label htmlFor="sort_order" className={labelClass}>
                        Urutan
                    </label>

                    <input
                        id="sort_order"
                        type="number"
                        min={0}
                        value={sortOrder}
                        onChange={(event) => setSortOrder(event.target.value)}
                        className={inputClass}
                    />

                    {errors.sort_order && (
                        <p className="mt-1 text-[11px] text-red-500">
                            {errors.sort_order}
                        </p>
                    )}
                </div>

                {/* PESAN */}
                <div className="sm:col-span-2">
                    <label htmlFor="message" className={labelClass}>
                        Pesan Testimoni
                    </label>

                    <textarea
                        id="message"
                        value={message}
                        onChange={(event) => setMessage(event.target.value)}
                        rows={4}
                        placeholder="Isi testimoni dari pemberi..."
                        className={textareaClass}
                    />

                    {errors.message && (
                        <p className="mt-1 text-[11px] text-red-500">
                            {errors.message}
                        </p>
                    )}
                </div>

                {/* STATUS */}
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
                    href={
                        initial
                            ? `/testimonials/${initial.id}`
                            : '/testimonials'
                    }
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
