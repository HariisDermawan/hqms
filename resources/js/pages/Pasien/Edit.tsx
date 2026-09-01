import { Head, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import {
    getPasien,
    updatePasien,
    type Pasien,
    type PasienPayload,
} from '@/api/pasien';
import AppLayout from '@/Layouts/AppLayout';
import PasienForm from './Form';

export default function PasienEdit() {
    const { id } = usePage<{ id: number }>().props;

    const [pasien, setPasien] = useState<Pasien | null>(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        getPasien(id)
            .then((response) => {
                setPasien(response.data?.pasien ?? null);
            })
            .catch((error: any) => {
                console.error('Gagal memuat pasien', error);

                if (
                    error.response?.status === 401 ||
                    error.response?.status === 404
                ) {
                    window.location.href =
                        error.response?.status === 401 ? '/login' : '/pasiens';
                    return;
                }

                window.alert('Gagal memuat data pasien.');
            })
            .finally(() => {
                setLoading(false);
            });
    }, [id]);

    const handleSubmit = async (payload: PasienPayload) => {
        setProcessing(true);
        setErrors({});

        try {
            await updatePasien(id, payload);

            router.visit('/pasiens');
        } catch (error: any) {
            console.error('Gagal memperbarui pasien', error);

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
                    'Gagal memperbarui data pasien.',
            });
        } finally {
            setProcessing(false);
        }
    };

    return (
        <>
            <Head title="Edit Pasien" />

            <AppLayout wide>
                <div>
                    <h2 className="text-lg font-bold text-gray-800 sm:text-xl">
                        Edit Pasien
                    </h2>

                    <p className="mt-1 text-xs text-gray-400 sm:text-sm">
                        Perbarui data pasien di bawah ini
                    </p>
                </div>

                {loading ? (
                    <div className="mt-4 rounded-xl bg-white p-10 text-center text-sm text-gray-400 shadow-sm">
                        Memuat data pasien...
                    </div>
                ) : (
                    <PasienForm
                        initial={pasien}
                        processing={processing}
                        errors={errors}
                        onSubmit={handleSubmit}
                    />
                )}
            </AppLayout>
        </>
    );
}
