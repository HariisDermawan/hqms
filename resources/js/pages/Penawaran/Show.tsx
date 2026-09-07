import { Head, Link, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { getPenawaran, type Penawaran } from '@/api/penawaran';
import AppLayout from '@/Layouts/AppLayout';

export default function PenawaranShow() {
    const { id } = usePage<{ id: number }>().props;

    const [penawaran, setPenawaran] = useState<Penawaran | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        getPenawaran(id)
            .then((response) => {
                setPenawaran(response.data?.penawaran ?? null);
            })
            .catch((error: any) => {
                console.error('Gagal memuat penawaran', error);

                if (error.response?.status === 401) {
                    window.location.href = '/login';
                    return;
                }

                setError('Gagal mengambil data penawaran.');
            })
            .finally(() => {
                setLoading(false);
            });
    }, [id]);

    const description = penawaran?.description
        ? penawaran.description[0].toUpperCase() +
          penawaran.description.slice(1)
        : '-';

    return (
        <>
            <Head title={penawaran ? penawaran.title : 'Detail Penawaran'} />

            <AppLayout wide>
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h2 className="text-lg font-bold text-gray-800 sm:text-xl">
                            Detail Penawaran
                        </h2>

                        <p className="mt-1 text-xs text-gray-400 sm:text-sm">
                            Informasi lengkap penawaran
                        </p>
                    </div>

                    <Link
                        href={
                            penawaran
                                ? `/penawarans/${penawaran.id}/edit`
                                : '/penawarans'
                        }
                        className="flex h-[43px] items-center gap-2 rounded-[12px] bg-[#084e7a] px-4 text-[13px] font-bold text-white transition hover:bg-[#063f62] hover:shadow-md active:scale-[0.99]"
                    >
                        Edit Penawaran
                    </Link>
                </div>

                {loading ? (
                    <div className="mt-4 rounded-xl bg-white p-10 text-center text-sm text-gray-400 shadow-sm">
                        Memuat data penawaran...
                    </div>
                ) : error ? (
                    <div className="mt-4 rounded-[10px] bg-red-50 px-3 py-2 text-[12px] text-red-500">
                        {error}
                    </div>
                ) : (
                    penawaran && (
                        <>
                            <div className="mt-4 rounded-xl bg-white p-5 shadow-sm sm:p-6">
                                <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                                    <div className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-[#07577f]/10">
                                        {penawaran.image_url ? (
                                            <img
                                                src={penawaran.image_url}
                                                alt={penawaran.title}
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
                                                    <path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 7.65l.78.77L12 20.68l7.64-7.65.78-.77a5.4 5.4 0 0 0 0-7.68Z" />
                                                </svg>
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <h3 className="text-base font-bold text-gray-800">
                                            {penawaran.title}
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
                                            {penawaran.id}
                                        </p>
                                    </div>

                                    <div className="col-span-2 lg:col-span-3">
                                        <div className="rounded-[10px] bg-[#f7f9fb] p-3">
                                            <p className="text-[11px] tracking-wider text-gray-400 uppercase">
                                                Slug
                                            </p>

                                            <p className="mt-1 text-[13px] font-semibold text-[#07577f]">
                                                {penawaran.slug}
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
                                    href="/penawarans"
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
