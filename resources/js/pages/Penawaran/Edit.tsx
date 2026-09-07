import { Head, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import {
    getPenawaran,
    updatePenawaran,
    type Penawaran,
    type PenawaranPayload,
} from '@/api/penawaran';
import AppLayout from '@/Layouts/AppLayout';
import PenawaranForm from './Form';

export default function PenawaranEdit() {
    const { id } = usePage<{ id: number }>().props;

    const [penawaran, setPenawaran] = useState<Penawaran | null>(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        getPenawaran(id)
            .then((response) => {
                setPenawaran(response.data?.penawaran ?? null);
            })
            .catch((error: any) => {
                console.error('Gagal memuat penawaran', error);

                if (
                    error.response?.status === 401 ||
                    error.response?.status === 404
                ) {
                    window.location.href =
                        error.response?.status === 401
                            ? '/login'
                            : '/penawarans';
                    return;
                }

                window.alert('Gagal memuat data penawaran.');
            })
            .finally(() => {
                setLoading(false);
            });
    }, [id]);

    const handleSubmit = async (payload: PenawaranPayload, image?: File) => {
        setProcessing(true);
        setErrors({});

        try {
            await updatePenawaran(id, payload, image);

            router.visit('/penawarans');
        } catch (error: any) {
            console.error('Gagal memperbarui penawaran', error);

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
                    'Gagal memperbarui data penawaran.',
            });
        } finally {
            setProcessing(false);
        }
    };

    return (
        <>
            <Head title="Edit Penawaran" />

            <AppLayout wide>
                <div>
                    <h2 className="text-lg font-bold text-gray-800 sm:text-xl">
                        Edit Penawaran
                    </h2>

                    <p className="mt-1 text-xs text-gray-400 sm:text-sm">
                        Perbarui data penawaran di bawah ini
                    </p>
                </div>

                {loading ? (
                    <div className="mt-4 rounded-xl bg-white p-10 text-center text-sm text-gray-400 shadow-sm">
                        Memuat data penawaran...
                    </div>
                ) : (
                    <PenawaranForm
                        initial={penawaran}
                        processing={processing}
                        errors={errors}
                        onSubmit={handleSubmit}
                    />
                )}
            </AppLayout>
        </>
    );
}
