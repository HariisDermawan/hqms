import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { storeObat, type ObatPayload } from '@/api/obat';
import AppLayout from '@/Layouts/AppLayout';
import ObatForm from './Form';

export default function ObatCreate() {
    const { pemeriksaan_id: pemeriksaanId } = usePage<{
        pemeriksaan_id?: number;
    }>().props;

    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleSubmit = async (payload: ObatPayload) => {
        setProcessing(true);
        setErrors({});

        try {
            await storeObat(payload);

            router.visit('/obats');
        } catch (error: any) {
            console.error('Gagal menyimpan obat', error);

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
                    'Gagal menyimpan data obat.',
            });
        } finally {
            setProcessing(false);
        }
    };

    return (
        <>
            <Head title="Tambah Obat" />

            <AppLayout wide>
                <div>
                    <h2 className="text-lg font-bold text-gray-800 sm:text-xl">
                        Tambah Obat
                    </h2>

                    <p className="mt-1 text-xs text-gray-400 sm:text-sm">
                        Catat resep obat dari hasil pemeriksaan
                    </p>
                </div>

                <ObatForm
                    initialPemeriksaanId={pemeriksaanId}
                    processing={processing}
                    errors={errors}
                    onSubmit={handleSubmit}
                />
            </AppLayout>
        </>
    );
}
