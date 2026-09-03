import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { storePerawat, type PerawatPayload } from '@/api/perawat';
import AppLayout from '@/Layouts/AppLayout';
import PerawatForm from './Form';

export default function PerawatCreate() {
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleSubmit = async (payload: PerawatPayload, image?: File) => {
        setProcessing(true);
        setErrors({});

        try {
            await storePerawat(payload, image);

            router.visit('/perawats');
        } catch (error: any) {
            console.error('Gagal menyimpan perawat', error);

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
                    'Gagal menyimpan data perawat.',
            });
        } finally {
            setProcessing(false);
        }
    };

    return (
        <>
            <Head title="Tambah Perawat" />

            <AppLayout wide>
                <div>
                    <h2 className="text-lg font-bold text-gray-800 sm:text-xl">
                        Tambah Perawat
                    </h2>

                    <p className="mt-1 text-xs text-gray-400 sm:text-sm">
                        Lengkapi data perawat baru di bawah ini
                    </p>
                </div>

                <PerawatForm
                    processing={processing}
                    errors={errors}
                    onSubmit={handleSubmit}
                />
            </AppLayout>
        </>
    );
}
