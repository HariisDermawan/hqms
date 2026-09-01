import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { storePoli, type PoliPayload } from '@/api/poli';
import AppLayout from '@/Layouts/AppLayout';
import PoliForm from './Form';

export default function PoliCreate() {
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleSubmit = async (payload: PoliPayload, image?: File) => {
        setProcessing(true);
        setErrors({});

        try {
            await storePoli(payload, image);

            router.visit('/polis');
        } catch (error: any) {
            console.error('Gagal menyimpan poli', error);

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
                    'Gagal menyimpan data poli.',
            });
        } finally {
            setProcessing(false);
        }
    };

    return (
        <>
            <Head title="Tambah Poli" />

            <AppLayout wide>
                <div>
                    <h2 className="text-lg font-bold text-gray-800 sm:text-xl">
                        Tambah Poli
                    </h2>

                    <p className="mt-1 text-xs text-gray-400 sm:text-sm">
                        Lengkapi data poli baru di bawah ini
                    </p>
                </div>

                <PoliForm
                    processing={processing}
                    errors={errors}
                    onSubmit={handleSubmit}
                />
            </AppLayout>
        </>
    );
}
