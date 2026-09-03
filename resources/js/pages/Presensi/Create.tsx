import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { storePresensi, type PresensiPayload } from '@/api/presensi';
import AppLayout from '@/Layouts/AppLayout';
import PresensiForm from './Form';

export default function PresensiCreate() {
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleSubmit = async (payload: PresensiPayload) => {
        setProcessing(true);
        setErrors({});

        try {
            await storePresensi(payload);

            router.visit('/presensis');
        } catch (error: any) {
            console.error('Gagal menyimpan presensi', error);

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
                    'Gagal menyimpan data presensi.',
            });
        } finally {
            setProcessing(false);
        }
    };

    return (
        <>
            <Head title="Tambah Presensi" />

            <AppLayout wide>
                <div>
                    <h2 className="text-lg font-bold text-gray-800 sm:text-xl">
                        Tambah Presensi
                    </h2>

                    <p className="mt-1 text-xs text-gray-400 sm:text-sm">
                        Catat kehadiran perawat (check-in / check-out)
                    </p>
                </div>

                <PresensiForm
                    processing={processing}
                    errors={errors}
                    onSubmit={handleSubmit}
                />
            </AppLayout>
        </>
    );
}
