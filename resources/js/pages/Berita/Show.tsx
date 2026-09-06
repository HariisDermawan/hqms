import { Head, Link, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { getBerita, type Berita } from '@/api/berita';
import AppLayout from '@/Layouts/AppLayout';

export default function BeritaShow() {
    const { id } = usePage<{ id: number }>().props;

    const [berita, setBerita] = useState<Berita | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        getBerita(id)
            .then((response) => {
                setBerita(response.data?.berita ?? null);
            })
            .catch((error: any) => {
                console.error('Gagal memuat berita', error);

                if (error.response?.status === 401) {
                    window.location.href = '/login';
                    return;
                }

                setError('Gagal mengambil data berita.');
            })
            .finally(() => {
                setLoading(false);
            });
    }, [id]);

    const description = berita?.description
        ? berita.description[0].toUpperCase() + berita.description.slice(1)
        : '-';

    return (
        <>
            <Head title={berita ? berita.title : 'Detail Berita'} />

            <AppLayout wide>
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h2 className="text-lg font-bold text-gray-800 sm:text-xl">
                            Detail Berita
                        </h2>

                        <p className="mt-1 text-xs text-gray-400 sm:text-sm">
                            Informasi lengkap berita
                        </p>
                    </div>

                    <Link
                        href={
                            berita ? `/beritas/${berita.id}/edit` : '/beritas'
                        }
                        className="flex h-[43px] items-center gap-2 rounded-[12px] bg-[#084e7a] px-4 text-[13px] font-bold text-white transition hover:bg-[#063f62] hover:shadow-md active:scale-[0.99]"
                    >
                        Edit Berita
                    </Link>
                </div>

                {loading ? (
                    <div className="mt-4 rounded-xl bg-white p-10 text-center text-sm text-gray-400 shadow-sm">
                        Memuat data berita...
                    </div>
                ) : error ? (
                    <div className="mt-4 rounded-[10px] bg-red-50 px-3 py-2 text-[12px] text-red-500">
                        {error}
                    </div>
                ) : (
                    berita && (
                        <>
                            <div className="mt-4 rounded-xl bg-white p-5 shadow-sm sm:p-6">
                                <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                                    <div className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-[#07577f]/10">
                                        {berita.image_url ? (
                                            <img
                                                src={berita.image_url}
                                                alt={berita.title}
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-8 w-8 text-[#07577f]/40"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="1.4"
                                                >
                                                    <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-4 0V7" />
                                                    <path d="m4 15 3-3 3 3 3-4 4 4" />
                                                </svg>
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <h3 className="text-base font-bold text-gray-800">
                                            {berita.title}
                                        </h3>

                                        <p className="mt-1 text-[13px] text-gray-500">
                                            {description}
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                                    <div className="rounded-[10px] bg-[#f7f9fb] p-3">
                                        <p className="text-[11px] tracking-wider text-gray-400 uppercase">
                                            ID
                                        </p>

                                        <p className="mt-1 text-[13px] font-semibold text-[#07577f]">
                                            {berita.id}
                                        </p>
                                    </div>

                                    <div className="col-span-2 lg:col-span-3">
                                        <div className="rounded-[10px] bg-[#f7f9fb] p-3">
                                            <p className="text-[11px] tracking-wider text-gray-400 uppercase">
                                                Slug
                                            </p>

                                            <p className="mt-1 text-[13px] font-semibold text-[#07577f]">
                                                {berita.slug}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="col-span-2 lg:col-span-4">
                                        <div className="rounded-[10px] bg-[#f7f9fb] p-3">
                                            <p className="text-[11px] tracking-wider text-gray-400 uppercase">
                                                Deskirpsi
                                            </p>

                                            <p className="mt-1 text-[13px] leading-relaxed font-normal whitespace-pre-line text-gray-700">
                                                {description}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 text-right">
                                <Link
                                    href="/beritas"
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
