import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { storePemeriksaan, type PemeriksaanPayload } from '@/api/pemeriksaan';
import AppLayout from '@/Layouts/AppLayout';
import PemeriksaanForm from './Form';

export default function PemeriksaanCreate() {
    const { antrian_id: antrianId } = usePage<{ antrian_id?: number }>().props;

    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleSubmit = async (payload: PemeriksaanPayload) => {
        setProcessing(true);
        setErrors({});

        try {
            await storePemeriksaan(payload);

            router.visit('/pemeriksaans');
        } catch (error: any) {
            console.error('Gagal menyimpan pemeriksaan', error);

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
                    'Gagal menyimpan data pemeriksaan.',
            });
        } finally {
            setProcessing(false);
        }
    };

    return (
        <>
            <Head title="Lanjut ke Pemeriksaan" />

            <AppLayout wide>
                <div>
                    <h2 className="text-lg font-bold text-gray-800 sm:text-xl">
                        Lanjut ke Pemeriksaan
                    </h2>

                    <p className="mt-1 text-xs text-gray-400 sm:text-sm">
                        Catat hasil pemeriksaan pasien
                    </p>
                </div>

                <PemeriksaanForm
                    initialAntrianId={antrianId}
                    processing={processing}
                    errors={errors}
                    onSubmit={handleSubmit}
                />
            </AppLayout>
        </>
    );
}
