import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { storeBerita, type BeritaPayload } from '@/api/berita';
import AppLayout from '@/Layouts/AppLayout';
import BeritaForm from './Form';

export default function BeritaCreate() {
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleSubmit = async (payload: BeritaPayload, image?: File) => {
        if (!image) {
            setErrors({ image: 'Gambar berita wajib diisi.' });

            return;
        }

        setProcessing(true);
        setErrors({});

        try {
            await storeBerita(payload, image);

            router.visit('/beritas');
        } catch (error: any) {
            console.error('Gagal menyimpan berita', error);

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
                    'Gagal menyimpan data berita.',
            });
        } finally {
            setProcessing(false);
        }
    };

    return (
        <>
            <Head title="Tambah Berita" />

            <AppLayout wide>
                <div>
                    <h2 className="text-lg font-bold text-gray-800 sm:text-xl">
                        Tambah Berita
                    </h2>

                    <p className="mt-1 text-xs text-gray-400 sm:text-sm">
                        Buat berita baru di bawah ini
                    </p>
                </div>

                <BeritaForm
                    processing={processing}
                    errors={errors}
                    onSubmit={handleSubmit}
                />
            </AppLayout>
        </>
    );
}
