import { Head, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import {
    getDokter,
    updateDokter,
    type Dokter,
    type DokterPayload,
} from '@/api/dokter';
import AppLayout from '@/Layouts/AppLayout';
import DokterForm from './Form';

export default function DokterEdit() {
    const { id } = usePage<{ id: number }>().props;

    const [dokter, setDokter] = useState<Dokter | null>(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        getDokter(id)
            .then((response) => {
                setDokter(response.data?.dokter ?? null);
            })
            .catch((error: any) => {
                console.error('Gagal memuat dokter', error);

                if (
                    error.response?.status === 401 ||
                    error.response?.status === 404
                ) {
                    window.location.href =
                        error.response?.status === 401 ? '/login' : '/dokters';
                    return;
                }

                window.alert('Gagal memuat data dokter.');
            })
            .finally(() => {
                setLoading(false);
            });
    }, [id]);

    const handleSubmit = async (payload: DokterPayload, image?: File) => {
        setProcessing(true);
        setErrors({});

        try {
            await updateDokter(id, payload, image);

            router.visit('/dokters');
        } catch (error: any) {
            console.error('Gagal memperbarui dokter', error);

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
                    'Gagal memperbarui data dokter.',
            });
        } finally {
            setProcessing(false);
        }
    };

    return (
        <>
            <Head title="Edit Dokter" />

            <AppLayout wide>
                <div>
                    <h2 className="text-lg font-bold text-gray-800 sm:text-xl">
                        Edit Dokter
                    </h2>

                    <p className="mt-1 text-xs text-gray-400 sm:text-sm">
                        Perbarui data dokter di bawah ini
                    </p>
                </div>

                {loading ? (
                    <div className="mt-4 rounded-xl bg-white p-10 text-center text-sm text-gray-400 shadow-sm">
                        Memuat data dokter...
                    </div>
                ) : (
                    <DokterForm
                        initial={dokter}
                        processing={processing}
                        errors={errors}
                        onSubmit={handleSubmit}
                    />
                )}
            </AppLayout>
        </>
    );
}
