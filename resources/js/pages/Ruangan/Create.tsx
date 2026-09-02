import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { storeRuangan, type RuanganPayload } from '@/api/ruangan';
import AppLayout from '@/Layouts/AppLayout';
import RuanganForm from './Form';

export default function RuanganCreate() {
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleSubmit = async (payload: RuanganPayload) => {
        setProcessing(true);
        setErrors({});

        try {
            await storeRuangan(payload);

            router.visit('/ruangans');
        } catch (error: any) {
            console.error('Gagal menyimpan ruangan', error);

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
                    'Gagal menyimpan data ruangan.',
            });
        } finally {
            setProcessing(false);
        }
    };

    return (
        <>
            <Head title="Tambah Ruangan" />

            <AppLayout wide>
                <div>
                    <h2 className="text-lg font-bold text-gray-800 sm:text-xl">
                        Tambah Ruangan
                    </h2>

                    <p className="mt-1 text-xs text-gray-400 sm:text-sm">
                        Lengkapi data ruangan baru di bawah ini
                    </p>
                </div>

                <RuanganForm
                    processing={processing}
                    errors={errors}
                    onSubmit={handleSubmit}
                />
            </AppLayout>
        </>
    );
}
