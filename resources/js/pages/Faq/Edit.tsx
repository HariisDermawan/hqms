import { Head, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { getFaq, updateFaq, type Faq, type FaqPayload } from '@/api/faq';
import AppLayout from '@/Layouts/AppLayout';
import FaqForm from './Form';

export default function FaqEdit() {
    const { id } = usePage<{ id: number }>().props;

    const [faq, setFaq] = useState<Faq | null>(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        getFaq(id)
            .then((response) => {
                setFaq(response.data?.faq ?? null);
            })
            .catch((error: any) => {
                console.error('Gagal memuat FAQ', error);

                if (
                    error.response?.status === 401 ||
                    error.response?.status === 404
                ) {
                    window.location.href = '/faqs';
                    return;
                }

                window.alert('Gagal memuat data FAQ.');
            })
            .finally(() => {
                setLoading(false);
            });
    }, [id]);

    const handleSubmit = async (payload: FaqPayload) => {
        setProcessing(true);
        setErrors({});

        try {
            await updateFaq(id, payload);

            router.visit(`/faqs/${id}`);
        } catch (error: any) {
            console.error('Gagal memperbarui FAQ', error);

            if (error.response?.status === 422) {
                setErrors({
                    general: error.response.data?.message,
                    ...error.response.data?.errors,
                });

                return;
            }

            if (error.response?.status === 401) {
                window.location.href = '/login';
                return;
            }

            setErrors({
                general:
                    error.response?.data?.message ||
                    'Gagal memperbarui data FAQ.',
            });
        } finally {
            setProcessing(false);
        }
    };

    return (
        <>
            <Head title="Edit FAQ" />

            <AppLayout wide>
                <div>
                    <h2 className="text-lg font-bold text-gray-800 sm:text-xl">
                        Edit FAQ
                    </h2>

                    <p className="mt-1 text-xs text-gray-400 sm:text-sm">
                        Perbarui pertanyaan yang sering diajukan
                    </p>
                </div>

                {loading ? (
                    <div className="mt-4 rounded-xl bg-white p-10 text-center text-sm text-gray-400 shadow-sm">
                        Memuat data FAQ...
                    </div>
                ) : (
                    <FaqForm
                        initial={faq}
                        processing={processing}
                        errors={errors}
                        onSubmit={handleSubmit}
                    />
                )}
            </AppLayout>
        </>
    );
}
