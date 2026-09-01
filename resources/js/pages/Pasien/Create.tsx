import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { storePasien, type PasienPayload } from '@/api/pasien';
import AppLayout from '@/Layouts/AppLayout';
import PasienForm from './Form';

export default function PasienCreate() {
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleSubmit = async (payload: PasienPayload) => {
        setProcessing(true);
        setErrors({});

        try {
            await storePasien(payload);

            router.visit('/pasiens');
        } catch (error: any) {
            console.error('Gagal menyimpan pasien', error);

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
                    'Gagal menyimpan data pasien.',
            });
        } finally {
            setProcessing(false);
        }
    };

    return (
        <>
            <Head title="Tambah Pasien" />

            <AppLayout wide>
                <div>
                    <h2 className="text-lg font-bold text-gray-800 sm:text-xl">
                        Tambah Pasien
                    </h2>

                    <p className="mt-1 text-xs text-gray-400 sm:text-sm">
                        Lengkapi data pasien baru di bawah ini
                    </p>
                </div>

                <PasienForm
                    processing={processing}
                    errors={errors}
                    onSubmit={handleSubmit}
                />
            </AppLayout>
        </>
    );
}
