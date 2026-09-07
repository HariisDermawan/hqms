import { Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import type { Fasilitas } from '@/api/fasilitas';
import AppLayout from '@/Layouts/AppLayout';

const slugify = (value: string): string =>
    value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/[\s_]+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');

interface FasilitasFormData {
    name: string;
    slug: string;
    description: string;
    is_active: boolean;
}

interface FormProps {
    fasilitas?: Fasilitas;
    mode: 'create' | 'edit';
}

export default function Form({ fasilitas, mode }: FormProps) {
    const isEdit = mode === 'edit';

    const { data, setData, post, put, processing, errors } =
        useForm<FasilitasFormData>({
            name: fasilitas?.name ?? '',
            slug: fasilitas?.slug ?? '',
            description: fasilitas?.description ?? '',
            is_active: fasilitas?.is_active ?? true,
        });

    const [autoSlug, setAutoSlug] = useState(isEdit);

    const handleChangeName = (name: string) => {
        setData('name', name);

        if (autoSlug) {
            setData('slug', slugify(name));
        }
    };

    const handleChangeSlug = (slug: string) => {
        setAutoSlug(false);
        setData('slug', slug);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isEdit && fasilitas?.id) {
            put(`/api/v1/fasilitas/${fasilitas.id}`, {
                preserveScroll: true,
                onSuccess: () => {
                    window.location.href = '/fasilitas';
                },
            });
        } else {
            post('/api/v1/fasilitas', {
                preserveScroll: true,
                onSuccess: () => {
                    window.location.href = '/fasilitas';
                },
            });
        }
    };

    return (
        <AppLayout wide>
            <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                    <h2 className="text-lg font-bold text-gray-800 sm:text-xl">
                        {isEdit ? 'Ubah Fasilitas' : 'Tambah Fasilitas'}
                    </h2>

                    <p className="mt-1 text-xs text-gray-400 sm:text-sm">
                        {isEdit
                            ? `Edit data fasilitas "${fasilitas?.name}".`
                            : 'Isi data berikut untuk menambahkan fasilitas baru.'}
                    </p>
                </div>

                <Link
                    href="/fasilitas"
                    className="flex h-9 items-center gap-1.5 rounded-lg bg-gray-100 px-3 text-[11px] font-semibold text-gray-600 transition hover:bg-gray-200"
                >
                    ← Kembali
                </Link>
            </div>

            <form
                onSubmit={handleSubmit}
                className="mt-4 max-w-[480px] space-y-5 rounded-xl bg-white p-6 shadow-sm"
            >
                {/* Name */}
                <div>
                    <label
                        htmlFor="name"
                        className="mb-1.5 block text-[12px] font-bold text-gray-500 uppercase"
                    >
                        Nama Fasilitas
                    </label>

                    <input
                        id="name"
                        type="text"
                        value={data.name}
                        onChange={(e) => handleChangeName(e.target.value)}
                        placeholder="contoh: Unit Gawat Darurat"
                        className={`h-11 w-full rounded-lg border bg-white px-3 text-[13px] text-gray-700 outline-none transition placeholder:text-gray-300 focus:border-[#07577f]/40 focus:ring-[3px] focus:ring-[#07577f]/10 ${
                            errors.name
                                ? 'border-red-300 focus:border-red-400 focus:ring-red-50'
                                : 'border-gray-200'
                        }`}
                    />

                    {errors.name && (
                        <p className="mt-1.5 text-[11px] text-red-500">
                            {errors.name}
                        </p>
                    )}
                </div>

                {/* Slug */}
                <div>
                    <label
                        htmlFor="slug"
                        className="mb-1.5 block text-[12px] font-bold text-gray-500 uppercase"
                    >
                        Slug
                    </label>

                    <input
                        id="slug"
                        type="text"
                        value={data.slug}
                        onChange={(e) => handleChangeSlug(e.target.value)}
                        placeholder="contoh: ugd-igd"
                        className={`h-11 w-full rounded-lg border bg-white px-3 text-[13px] text-gray-700 outline-none transition placeholder:text-gray-300 focus:border-[#07577f]/40 focus:ring-[3px] focus:ring-[#07577f]/10 ${
                            errors.slug
                                ? 'border-red-300 focus:border-red-400 focus:ring-red-50'
                                : 'border-gray-200'
                        }`}
                    />

                    {errors.slug && (
                        <p className="mt-1.5 text-[11px] text-red-500">
                            {errors.slug}
                        </p>
                    )}
                </div>

                {/* Description */}
                <div>
                    <label
                        htmlFor="description"
                        className="mb-1.5 block text-[12px] font-bold text-gray-500 uppercase"
                    >
                        Deskripsi
                    </label>

                    <textarea
                        id="description"
                        rows={3}
                        value={data.description}
                        onChange={(e) =>
                            setData('description', e.target.value)
                        }
                        placeholder="Deskripsi singkat tentang fasilitas ini..."
                        className={`w-full rounded-lg border bg-white px-3 py-2 text-[13px] text-gray-700 outline-none transition placeholder:text-gray-300 focus:border-[#07577f]/40 focus:ring-[3px] focus:ring-[#07577f]/10 ${
                            errors.description
                                ? 'border-red-300 focus:border-red-400 focus:ring-red-50'
                                : 'border-gray-200'
                        }`}
                    />
                </div>

                {/* Active status */}
                <div>
                    <label className="flex items-center gap-2.5">
                        <input
                            type="checkbox"
                            checked={data.is_active}
                            onChange={(e) =>
                                setData('is_active', e.target.checked)
                            }
                            className="h-4 w-4 rounded border-gray-300 text-[#07577f] focus:ring-[#07577f]/30"
                        />

                        <span className="text-[13px] font-medium text-gray-600">
                            Aktif
                        </span>
                    </label>
                </div>

                {/* Submit */}
                <div className="flex items-center gap-3 pt-2">
                    <button
                        type="submit"
                        disabled={processing}
                        className="flex h-11 items-center gap-2 rounded-lg bg-[#07577f] px-6 text-[13px] font-bold text-white transition hover:bg-[#063f62] disabled:opacity-60"
                    >
                        {processing ? 'Menyimpan...' : 'Simpan'}
                    </button>

                    <Link
                        href="/fasilitas"
                        className="flex h-11 items-center rounded-lg border border-gray-200 px-5 text-[13px] font-semibold text-gray-500 transition hover:bg-gray-50"
                    >
                        Batal
                    </Link>
                </div>
            </form>
        </AppLayout>
    );
}
