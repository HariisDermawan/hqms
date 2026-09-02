import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { storeFaq, type FaqPayload } from '@/api/faq';
import AppLayout from '@/Layouts/AppLayout';
import FaqForm from './Form';

export default function FaqCreate() {
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleSubmit = async (payload: FaqPayload) => {
        setProcessing(true);
        setErrors({});

        try {
            await storeFaq(payload);

            router.visit('/faqs');
        } catch (error: any) {
            console.error('Gagal menyimpan FAQ', error);

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
                    'Gagal menyimpan data FAQ.',
            });
        } finally {
            setProcessing(false);
        }
    };

    return (
        <>
            <Head title="Buat FAQ" />

            <AppLayout wide>
                <div>
                    <h2 className="text-lg font-bold text-gray-800 sm:text-xl">
                        Buat FAQ
                    </h2>

                    <p className="mt-1 text-xs text-gray-400 sm:text-sm">
                        Tambahkan pertanyaan yang sering diajukan
                    </p>
                </div>

                <FaqForm
                    processing={processing}
                    errors={errors}
                    onSubmit={handleSubmit}
                />
            </AppLayout>
        </>
    );
}
