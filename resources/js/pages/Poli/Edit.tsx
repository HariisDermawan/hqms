import { Head, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { getPoli, updatePoli, type Poli, type PoliPayload } from '@/api/poli';
import AppLayout from '@/Layouts/AppLayout';
import PoliForm from './Form';

export default function PoliEdit() {
    const { id } = usePage<{ id: number }>().props;

    const [poli, setPoli] = useState<Poli | null>(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        getPoli(id)
            .then((response) => {
                setPoli(response.data?.poli ?? null);
            })
            .catch((error: any) => {
                console.error('Gagal memuat poli', error);

                if (
                    error.response?.status === 401 ||
                    error.response?.status === 404
                ) {
                    window.location.href =
                        error.response?.status === 401 ? '/login' : '/polis';
                    return;
                }

                window.alert('Gagal memuat data poli.');
            })
            .finally(() => {
                setLoading(false);
            });
    }, [id]);

    const handleSubmit = async (payload: PoliPayload, image?: File) => {
        setProcessing(true);
        setErrors({});

        try {
            await updatePoli(id, payload, image);

            router.visit('/polis');
        } catch (error: any) {
            console.error('Gagal memperbarui poli', error);

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
                    'Gagal memperbarui data poli.',
            });
        } finally {
            setProcessing(false);
        }
    };

    return (
        <>
            <Head title="Edit Poli" />

            <AppLayout wide>
                <div>
                    <h2 className="text-lg font-bold text-gray-800 sm:text-xl">
                        Edit Poli
                    </h2>

                    <p className="mt-1 text-xs text-gray-400 sm:text-sm">
                        Perbarui data poli di bawah ini
                    </p>
                </div>

                {loading ? (
                    <div className="mt-4 rounded-xl bg-white p-10 text-center text-sm text-gray-400 shadow-sm">
                        Memuat data poli...
                    </div>
                ) : (
                    <PoliForm
                        initial={poli}
                        processing={processing}
                        errors={errors}
                        onSubmit={handleSubmit}
                    />
                )}
            </AppLayout>
        </>
    );
}
