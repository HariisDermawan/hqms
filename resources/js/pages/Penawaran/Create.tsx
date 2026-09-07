import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { storePenawaran, type PenawaranPayload } from '@/api/penawaran';
import AppLayout from '@/Layouts/AppLayout';
import PenawaranForm from './Form';

export default function PenawaranCreate() {
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleSubmit = async (payload: PenawaranPayload, image?: File) => {
        if (!image) {
            setErrors({ image: 'Gambar penawaran wajib diisi.' });

            return;
        }

        setProcessing(true);
        setErrors({});

        try {
            await storePenawaran(payload, image);

            router.visit('/penawarans');
        } catch (error: any) {
            console.error('Gagal menyimpan penawaran', error);

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
                    'Gagal menyimpan data penawaran.',
            });
        } finally {
            setProcessing(false);
        }
    };

    return (
        <>
            <Head title="Tambah Penawaran" />

            <AppLayout wide>
                <div>
                    <h2 className="text-lg font-bold text-gray-800 sm:text-xl">
                        Tambah Penawaran
                    </h2>

                    <p className="mt-1 text-xs text-gray-400 sm:text-sm">
                        Buat penawaran baru di bawah ini
                    </p>
                </div>

                <PenawaranForm
                    processing={processing}
                    errors={errors}
                    onSubmit={handleSubmit}
                />
            </AppLayout>
        </>
    );
}
