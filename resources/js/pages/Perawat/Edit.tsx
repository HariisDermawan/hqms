import { Head, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import {
    getPerawat,
    updatePerawat,
    type Perawat,
    type PerawatPayload,
} from '@/api/perawat';
import AppLayout from '@/Layouts/AppLayout';
import PerawatForm from './Form';

export default function PerawatEdit() {
    const { id } = usePage<{ id: number }>().props;

    const [perawat, setPerawat] = useState<Perawat | null>(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        getPerawat(id)
            .then((response) => {
                setPerawat(response.data?.perawat ?? null);
            })
            .catch((error: any) => {
                console.error('Gagal memuat perawat', error);

                if (
                    error.response?.status === 401 ||
                    error.response?.status === 404
                ) {
                    window.location.href =
                        error.response?.status === 401 ? '/login' : '/perawats';
                    return;
                }

                window.alert('Gagal memuat data perawat.');
            })
            .finally(() => {
                setLoading(false);
            });
    }, [id]);

    const handleSubmit = async (payload: PerawatPayload, image?: File) => {
        setProcessing(true);
        setErrors({});

        try {
            await updatePerawat(id, payload, image);

            router.visit('/perawats');
        } catch (error: any) {
            console.error('Gagal memperbarui perawat', error);

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
                    'Gagal memperbarui data perawat.',
            });
        } finally {
            setProcessing(false);
        }
    };

    return (
        <>
            <Head title="Edit Perawat" />

            <AppLayout wide>
                <div>
                    <h2 className="text-lg font-bold text-gray-800 sm:text-xl">
                        Edit Perawat
                    </h2>

                    <p className="mt-1 text-xs text-gray-400 sm:text-sm">
                        Perbarui data perawat di bawah ini
                    </p>
                </div>

                {loading ? (
                    <div className="mt-4 rounded-xl bg-white p-10 text-center text-sm text-gray-400 shadow-sm">
                        Memuat data perawat...
                    </div>
                ) : (
                    <PerawatForm
                        initial={perawat}
                        processing={processing}
                        errors={errors}
                        onSubmit={handleSubmit}
                    />
                )}
            </AppLayout>
        </>
    );
}
