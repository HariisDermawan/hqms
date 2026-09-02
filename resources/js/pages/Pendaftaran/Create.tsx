import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { storePendaftaran, type PendaftaranPayload } from '@/api/pendaftaran';
import AppLayout from '@/Layouts/AppLayout';
import PendaftaranForm from './Form';

export default function PendaftaranCreate() {
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleSubmit = async (payload: PendaftaranPayload) => {
        setProcessing(true);
        setErrors({});

        try {
            await storePendaftaran(payload);

            router.visit('/pendaftarans');
        } catch (error: any) {
            console.error('Gagal menyimpan pendaftaran', error);

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
                    'Gagal menyimpan data pendaftaran.',
            });
        } finally {
            setProcessing(false);
        }
    };

    return (
        <>
            <Head title="Registrasi Pasien" />

            <AppLayout wide>
                <div>
                    <h2 className="text-lg font-bold text-gray-800 sm:text-xl">
                        Registrasi Pasien
                    </h2>

                    <p className="mt-1 text-xs text-gray-400 sm:text-sm">
                        Daftarkan pasien ke poli tujuan
                    </p>
                </div>

                <PendaftaranForm
                    processing={processing}
                    errors={errors}
                    onSubmit={handleSubmit}
                />
            </AppLayout>
        </>
    );
}
