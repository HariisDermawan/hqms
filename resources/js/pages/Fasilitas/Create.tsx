import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { storeFasilitas, type FasilitasPayload } from '@/api/fasilitas';
import AppLayout from '@/Layouts/AppLayout';
import FasilitasForm from './Form';

export default function FasilitasCreate() {
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleSubmit = async (payload: FasilitasPayload, image?: File) => {
        setProcessing(true);
        setErrors({});

        try {
            await storeFasilitas(payload, image);

            router.visit('/fasilitas');
        } catch (error: any) {
            console.error('Gagal menyimpan fasilitas', error);

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
                    'Gagal menyimpan data fasilitas.',
            });
        } finally {
            setProcessing(false);
        }
    };

    return (
        <>
            <Head title="Tambah Fasilitas" />

            <AppLayout wide>
                <div>
                    <h2 className="text-lg font-bold text-gray-800 sm:text-xl">
                        Tambah Fasilitas
                    </h2>

                    <p className="mt-1 text-xs text-gray-400 sm:text-sm">
                        Buat fasilitas baru di bawah ini
                    </p>
                </div>

                <FasilitasForm
                    processing={processing}
                    errors={errors}
                    onSubmit={handleSubmit}
                />
            </AppLayout>
        </>
    );
}
