import { Link } from '@inertiajs/react';
import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import type { Fasilitas, FasilitasPayload } from '@/api/fasilitas';

const slugify = (value: string): string =>
    value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/[\s_]+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');

const inputClass =
    'w-full h-[42px] px-[12px] rounded-[12px] bg-[#d9d9d9] text-[13px] text-gray-700 placeholder:text-[#999] outline-none focus:bg-[#d5d5d5] focus:ring-2 focus:ring-[#084e7a]/30 transition';

const labelClass = 'block text-[13px] text-[#333] mb-[4px]';

interface FasilitasFormProps {
    initial?: Fasilitas | null;
    processing: boolean;
    errors?: Record<string, string | undefined> & {
        general?: string;
    };
    onSubmit: (payload: FasilitasPayload, image?: File) => void;
}

export default function FasilitasForm({
    initial,
    processing,
    errors = {},
    onSubmit,
}: FasilitasFormProps) {
    const isEdit = Boolean(initial);

    const [name, setName] = useState(initial?.name ?? '');
    const [slug, setSlug] = useState(initial?.slug ?? '');
    const [description, setDescription] = useState(initial?.description ?? '');
    const [isActive, setIsActive] = useState(initial?.is_active ?? true);

    const [image, setImage] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [autoSlug, setAutoSlug] = useState(!isEdit);

    useEffect(() => {
        setPreview(initial?.image_url ?? null);
    }, [initial?.image_url]);

    const handleNameChange = (value: string) => {
        setName(value);

        if (autoSlug) {
            setSlug(slugify(value));
        }
    };

    const handleSlugChange = (value: string) => {
        setAutoSlug(false);
        setSlug(value);
    };

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
                name,
                slug,
                description: description || undefined,
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
                {/* GAMBAR */}
                <div className="sm:col-span-2">
                    <span className={labelClass}>Gambar Fasilitas</span>

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
                                    <rect
                                        x="4"
                                        y="5"
                                        width="16"
                                        height="14"
                                        rx="2"
                                    />
                                    <path d="m4 15 4-4 3 3 3-4 6 6" />
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
                                        ? 'Ganti Gambar'
                                        : 'Ubah Gambar'
                                    : 'Pilih Gambar'}

                                <input
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp"
                                    onChange={handleImageChange}
                                    className="hidden"
                                />
                            </label>

                            <p className="mt-2 text-[11px] text-gray-400">
                                {initial
                                    ? 'Kosongkan jika tidak ingin mengubah gambar'
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

                {/* NAMA */}
                <div className="sm:col-span-2">
                    <label htmlFor="name" className={labelClass}>
                        Nama Fasilitas
                    </label>

                    <input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(event) =>
                            handleNameChange(event.target.value)
                        }
                        placeholder="Contoh: Unit Gawat Darurat"
                        className={inputClass}
                    />

                    {errors.name && (
                        <p className="mt-1 text-[11px] text-red-500">
                            {errors.name}
                        </p>
                    )}
                </div>

                {/* SLUG */}
                <div className="sm:col-span-2">
                    <label htmlFor="slug" className={labelClass}>
                        Slug
                    </label>

                    <input
                        id="slug"
                        type="text"
                        value={slug}
                        onChange={(event) =>
                            handleSlugChange(event.target.value)
                        }
                        placeholder="Contoh: unit-gawat-darurat"
                        className={inputClass}
                    />

                    {errors.slug && (
                        <p className="mt-1 text-[11px] text-red-500">
                            {errors.slug}
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
                        placeholder="Deskripsi singkat tentang fasilitas ini..."
                        rows={5}
                        className="w-full rounded-[12px] bg-[#d9d9d9] px-[12px] py-[10px] text-[13px] text-gray-700 transition outline-none placeholder:text-[#999] focus:bg-[#d5d5d5] focus:ring-2 focus:ring-[#084e7a]/30"
                    />

                    {errors.description && (
                        <p className="mt-1 text-[11px] text-red-500">
                            {errors.description}
                        </p>
                    )}
                </div>

                {/* STATUS */}
                <div className="sm:col-span-2">
                    <label className="flex items-center gap-2.5">
                        <input
                            type="checkbox"
                            checked={isActive}
                            onChange={(event) =>
                                setIsActive(event.target.checked)
                            }
                            className="h-4 w-4 rounded border-gray-300 text-[#07577f] focus:ring-[#07577f]/30"
                        />

                        <span className="text-[13px] font-medium text-gray-600">
                            Aktif
                        </span>
                    </label>
                </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
                <Link
                    href="/fasilitas"
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
