import { Head, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import {
    getBerita,
    updateBerita,
    type Berita,
    type BeritaPayload,
} from '@/api/berita';
import AppLayout from '@/Layouts/AppLayout';
import BeritaForm from './Form';

export default function BeritaEdit() {
    const { id } = usePage<{ id: number }>().props;

    const [berita, setBerita] = useState<Berita | null>(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        getBerita(id)
            .then((response) => {
                setBerita(response.data?.berita ?? null);
            })
            .catch((error: any) => {
                console.error('Gagal memuat berita', error);

                if (
                    error.response?.status === 401 ||
                    error.response?.status === 404
                ) {
                    window.location.href =
                        error.response?.status === 401 ? '/login' : '/beritas';
                    return;
                }

                window.alert('Gagal memuat data berita.');
            })
            .finally(() => {
                setLoading(false);
            });
    }, [id]);

    const handleSubmit = async (payload: BeritaPayload, image?: File) => {
        setProcessing(true);
        setErrors({});

        try {
            await updateBerita(id, payload, image);

            router.visit('/beritas');
        } catch (error: any) {
            console.error('Gagal memperbarui berita', error);

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
                    'Gagal memperbarui data berita.',
            });
        } finally {
            setProcessing(false);
        }
    };

    return (
        <>
            <Head title="Edit Berita" />

            <AppLayout wide>
                <div>
                    <h2 className="text-lg font-bold text-gray-800 sm:text-xl">
                        Edit Berita
                    </h2>

                    <p className="mt-1 text-xs text-gray-400 sm:text-sm">
                        Perbarui data berita di bawah ini
                    </p>
                </div>

                {loading ? (
                    <div className="mt-4 rounded-xl bg-white p-10 text-center text-sm text-gray-400 shadow-sm">
                        Memuat data berita...
                    </div>
                ) : (
                    <BeritaForm
                        initial={berita}
                        processing={processing}
                        errors={errors}
                        onSubmit={handleSubmit}
                    />
                )}
            </AppLayout>
        </>
    );
}
