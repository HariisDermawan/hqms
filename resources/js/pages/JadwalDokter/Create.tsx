import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import {
    storeJadwalDokter,
    type JadwalDokterPayload,
} from '@/api/jadwalDokter';
import AppLayout from '@/Layouts/AppLayout';
import JadwalDokterForm from './Form';

export default function JadwalDokterCreate() {
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleSubmit = async (payload: JadwalDokterPayload) => {
        setProcessing(true);
        setErrors({});

        try {
            await storeJadwalDokter(payload);

            router.visit('/jadwal-dokters');
        } catch (error: any) {
            console.error('Gagal menyimpan jadwal', error);

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
                    'Gagal menyimpan data jadwal.',
            });
        } finally {
            setProcessing(false);
        }
    };

    return (
        <>
            <Head title="Tambah Jadwal Dokter" />

            <AppLayout wide>
                <div>
                    <h2 className="text-lg font-bold text-gray-800 sm:text-xl">
                        Tambah Jadwal Dokter
                    </h2>

                    <p className="mt-1 text-xs text-gray-400 sm:text-sm">
                        Atur jadwal praktik dokter di bawah ini
                    </p>
                </div>

                <JadwalDokterForm
                    processing={processing}
                    errors={errors}
                    onSubmit={handleSubmit}
                />
            </AppLayout>
        </>
    );
}
