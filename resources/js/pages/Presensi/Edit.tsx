import { Head, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import {
    getPresensi,
    updatePresensi,
    type Presensi,
    type PresensiPayload,
} from '@/api/presensi';
import AppLayout from '@/Layouts/AppLayout';
import PresensiForm from './Form';

export default function PresensiEdit() {
    const { id } = usePage<{ id: number }>().props;

    const [presensi, setPresensi] = useState<Presensi | null>(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        getPresensi(id)
            .then((response) => {
                setPresensi(response.data?.presensi ?? null);
            })
            .catch((error: any) => {
                console.error('Gagal memuat presensi', error);

                if (
                    error.response?.status === 401 ||
                    error.response?.status === 404
                ) {
                    window.location.href =
                        error.response?.status === 401
                            ? '/login'
                            : '/presensis';
                    return;
                }

                window.alert('Gagal memuat data presensi.');
            })
            .finally(() => {
                setLoading(false);
            });
    }, [id]);

    const handleSubmit = async (payload: PresensiPayload) => {
        setProcessing(true);
        setErrors({});

        try {
            await updatePresensi(id, payload);

            router.visit('/presensis');
        } catch (error: any) {
            console.error('Gagal memperbarui presensi', error);

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
                    'Gagal memperbarui data presensi.',
            });
        } finally {
            setProcessing(false);
        }
    };

    return (
        <>
            <Head title="Edit Presensi" />

            <AppLayout wide>
                <div>
                    <h2 className="text-lg font-bold text-gray-800 sm:text-xl">
                        Edit Presensi
                    </h2>

                    <p className="mt-1 text-xs text-gray-400 sm:text-sm">
                        Perbarui data presensi di bawah ini
                    </p>
                </div>

                {loading ? (
                    <div className="mt-4 rounded-xl bg-white p-10 text-center text-sm text-gray-400 shadow-sm">
                        Memuat data presensi...
                    </div>
                ) : (
                    <PresensiForm
                        initial={presensi}
                        processing={processing}
                        errors={errors}
                        onSubmit={handleSubmit}
                    />
                )}
            </AppLayout>
        </>
    );
}
