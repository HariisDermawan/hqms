import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { storeTestimonial, type TestimonialPayload } from '@/api/testimonial';
import AppLayout from '@/Layouts/AppLayout';
import TestimonialForm from './Form';

export default function TestimonialCreate() {
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleSubmit = async (payload: TestimonialPayload) => {
        setProcessing(true);
        setErrors({});

        try {
            await storeTestimonial(payload);

            router.visit('/testimonials');
        } catch (error: any) {
            console.error('Gagal menyimpan testimoni', error);

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
                    'Gagal menyimpan data testimoni.',
            });
        } finally {
            setProcessing(false);
        }
    };

    return (
        <>
            <Head title="Tambah Testimoni" />

            <AppLayout wide>
                <div>
                    <h2 className="text-lg font-bold text-gray-800 sm:text-xl">
                        Tambah Testimoni
                    </h2>

                    <p className="mt-1 text-xs text-gray-400 sm:text-sm">
                        Lengkapi data testimoni baru di bawah ini
                    </p>
                </div>

                <TestimonialForm
                    processing={processing}
                    errors={errors}
                    onSubmit={handleSubmit}
                />
            </AppLayout>
        </>
    );
}
