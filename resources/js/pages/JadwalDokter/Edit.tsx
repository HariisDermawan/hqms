import { Head, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import {
    getJadwalDokter,
    updateJadwalDokter,
    type JadwalDokter,
    type JadwalDokterPayload,
} from '@/api/jadwalDokter';
import AppLayout from '@/Layouts/AppLayout';
import JadwalDokterForm from './Form';

export default function JadwalDokterEdit() {
    const { id } = usePage<{ id: number }>().props;

    const [jadwal, setJadwal] = useState<JadwalDokter | null>(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        getJadwalDokter(id)
            .then((response) => {
                setJadwal(response.data?.jadwal_dokter ?? null);
            })
            .catch((error: any) => {
                console.error('Gagal memuat jadwal', error);

                if (
                    error.response?.status === 401 ||
                    error.response?.status === 404
                ) {
                    window.location.href =
                        error.response?.status === 401
                            ? '/login'
                            : '/jadwal-dokters';
                    return;
                }

                window.alert('Gagal memuat data jadwal.');
            })
            .finally(() => {
                setLoading(false);
            });
    }, [id]);

    const handleSubmit = async (payload: JadwalDokterPayload) => {
        setProcessing(true);
        setErrors({});

        try {
            await updateJadwalDokter(id, payload);

            router.visit('/jadwal-dokters');
        } catch (error: any) {
            console.error('Gagal memperbarui jadwal', error);

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
                    'Gagal memperbarui data jadwal.',
            });
        } finally {
            setProcessing(false);
        }
    };

    return (
        <>
            <Head title="Edit Jadwal Dokter" />

            <AppLayout wide>
                <div>
                    <h2 className="text-lg font-bold text-gray-800 sm:text-xl">
                        Edit Jadwal Dokter
                    </h2>

                    <p className="mt-1 text-xs text-gray-400 sm:text-sm">
                        Perbarui jadwal praktik di bawah ini
                    </p>
                </div>

                {loading ? (
                    <div className="mt-4 rounded-xl bg-white p-10 text-center text-sm text-gray-400 shadow-sm">
                        Memuat data jadwal...
                    </div>
                ) : (
                    <JadwalDokterForm
                        initial={jadwal}
                        processing={processing}
                        errors={errors}
                        onSubmit={handleSubmit}
                    />
                )}
            </AppLayout>
        </>
    );
}
