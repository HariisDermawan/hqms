import { Head, Link, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { getFaq, type Faq } from '@/api/faq';
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

export default function FaqShow() {
    const { id } = usePage<{ id: number }>().props;

    const [faq, setFaq] = useState<Faq | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        getFaq(id)
            .then((response) => {
                setFaq(response.data?.faq ?? null);
            })
            .catch((error: any) => {
                console.error('Gagal memuat FAQ', error);

                if (error.response?.status === 401) {
                    window.location.href = '/login';
                    return;
                }

                setError('Gagal mengambil data FAQ.');
            })
            .finally(() => {
                setLoading(false);
            });
    }, [id]);

    return (
        <>
            <Head title="Detail FAQ" />

            <AppLayout wide>
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h2 className="text-lg font-bold text-gray-800 sm:text-xl">
                            Detail FAQ
                        </h2>

                        <p className="mt-1 text-xs text-gray-400 sm:text-sm">
                            Informasi lengkap pertanyaan yang sering diajukan
                        </p>
                    </div>

                    <Link
                        href={faq ? `/faqs/${faq.id}/edit` : '/faqs'}
                        className="flex h-[43px] items-center gap-2 rounded-[12px] bg-[#084e7a] px-4 text-[13px] font-bold text-white transition hover:bg-[#063f62] hover:shadow-md active:scale-[0.99]"
                    >
                        Edit FAQ
                    </Link>
                </div>

                {loading ? (
                    <div className="mt-4 rounded-xl bg-white p-10 text-center text-sm text-gray-400 shadow-sm">
                        Memuat data FAQ...
                    </div>
                ) : error ? (
                    <div className="mt-4 rounded-[10px] bg-red-50 px-3 py-2 text-[12px] text-red-500">
                        {error}
                    </div>
                ) : (
                    faq && (
                        <div className="mt-4 rounded-xl bg-white p-5 shadow-sm sm:p-6">
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                {detailItem('Pertanyaan', faq.question, true)}

                                {detailItem(
                                    'Urutan',
                                    String(faq.sort_order),
                                    true,
                                )}

                                <div className="rounded-[10px] bg-[#f7f9fb] p-3 sm:col-span-2">
                                    <p className="text-[11px] tracking-wider text-gray-400 uppercase">
                                        Jawaban
                                    </p>

                                    <p className="mt-1 text-[13px] whitespace-pre-wrap text-gray-700">
                                        {faq.answer}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-[11px] tracking-wider text-gray-400 uppercase">
                                        Status
                                    </p>

                                    <p className="mt-1 text-[13px] font-semibold text-gray-700">
                                        {faq.is_active ? 'Aktif' : 'Nonaktif'}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-4">
                                <Link
                                    href="/faqs"
                                    className="inline-flex h-[43px] items-center rounded-[12px] bg-[#d9d9d9] px-5 text-[13px] font-bold text-gray-600 transition hover:bg-[#c9c9c9]"
                                >
                                    Kembali
                                </Link>
                            </div>
                        </div>
                    )
                )}
            </AppLayout>
        </>
    );
}
