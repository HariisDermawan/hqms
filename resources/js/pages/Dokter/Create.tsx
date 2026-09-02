import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { storeDokter, type DokterPayload } from '@/api/dokter';
import AppLayout from '@/Layouts/AppLayout';
import DokterForm from './Form';

export default function DokterCreate() {
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleSubmit = async (payload: DokterPayload, image?: File) => {
        setProcessing(true);
        setErrors({});

        try {
            await storeDokter(payload, image);

            router.visit('/dokters');
        } catch (error: any) {
            console.error('Gagal menyimpan dokter', error);

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
                    'Gagal menyimpan data dokter.',
            });
        } finally {
            setProcessing(false);
        }
    };

    return (
        <>
            <Head title="Tambah Dokter" />

            <AppLayout wide>
                <div>
                    <h2 className="text-lg font-bold text-gray-800 sm:text-xl">
                        Tambah Dokter
                    </h2>

                    <p className="mt-1 text-xs text-gray-400 sm:text-sm">
                        Lengkapi data dokter baru di bawah ini
                    </p>
                </div>

                <DokterForm
                    processing={processing}
                    errors={errors}
                    onSubmit={handleSubmit}
                />
            </AppLayout>
        </>
    );
}
