import { Head, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import {
    getTestimonial,
    updateTestimonial,
    type Testimonial,
    type TestimonialPayload,
} from '@/api/testimonial';
import AppLayout from '@/Layouts/AppLayout';
import TestimonialForm from './Form';

export default function TestimonialEdit() {
    const { id } = usePage<{ id: number }>().props;

    const [testimonial, setTestimonial] = useState<Testimonial | null>(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        getTestimonial(id)
            .then((response) => {
                setTestimonial(response.data?.testimonial ?? null);
            })
            .catch((error: any) => {
                console.error('Gagal memuat testimoni', error);

                if (
                    error.response?.status === 401 ||
                    error.response?.status === 404
                ) {
                    window.location.href = '/testimonials';
                    return;
                }

                window.alert('Gagal memuat data testimoni.');
            })
            .finally(() => {
                setLoading(false);
            });
    }, [id]);

    const handleSubmit = async (payload: TestimonialPayload) => {
        setProcessing(true);
        setErrors({});

        try {
            await updateTestimonial(id, payload);

            router.visit(`/testimonials/${id}`);
        } catch (error: any) {
            console.error('Gagal memperbarui testimoni', error);

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
                    'Gagal memperbarui data testimoni.',
            });
        } finally {
            setProcessing(false);
        }
    };

    return (
        <>
            <Head title="Edit Testimoni" />

            <AppLayout wide>
                <div>
                    <h2 className="text-lg font-bold text-gray-800 sm:text-xl">
                        Edit Testimoni
                    </h2>

                    <p className="mt-1 text-xs text-gray-400 sm:text-sm">
                        Perbarui ulasan dari pasien
                    </p>
                </div>

                {loading ? (
                    <div className="mt-4 rounded-xl bg-white p-10 text-center text-sm text-gray-400 shadow-sm">
                        Memuat data testimoni...
                    </div>
                ) : (
                    <TestimonialForm
                        initial={testimonial}
                        processing={processing}
                        errors={errors}
                        onSubmit={handleSubmit}
                    />
                )}
            </AppLayout>
        </>
    );
}
