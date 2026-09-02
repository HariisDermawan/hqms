import { Head, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import {
    getPendaftaran,
    updatePendaftaran,
    type Pendaftaran,
    type PendaftaranPayload,
} from '@/api/pendaftaran';
import AppLayout from '@/Layouts/AppLayout';
import PendaftaranForm from './Form';

export default function PendaftaranEdit() {
    const { id } = usePage<{ id: number }>().props;

    const [pendaftaran, setPendaftaran] = useState<Pendaftaran | null>(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        getPendaftaran(id)
            .then((response) => {
                setPendaftaran(response.data?.pendaftaran ?? null);
            })
            .catch((error: any) => {
                console.error('Gagal memuat pendaftaran', error);

                if (
                    error.response?.status === 401 ||
                    error.response?.status === 404
                ) {
                    window.location.href =
                        error.response?.status === 401
                            ? '/login'
                            : '/pendaftarans';
                    return;
                }

                window.alert('Gagal memuat data pendaftaran.');
            })
            .finally(() => {
                setLoading(false);
            });
    }, [id]);

    const handleSubmit = async (payload: PendaftaranPayload) => {
        setProcessing(true);
        setErrors({});

        try {
            await updatePendaftaran(id, payload);

            router.visit('/pendaftarans');
        } catch (error: any) {
            console.error('Gagal memperbarui pendaftaran', error);

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
                    'Gagal memperbarui data pendaftaran.',
            });
        } finally {
            setProcessing(false);
        }
    };

    return (
        <>
            <Head title="Edit Pendaftaran" />

            <AppLayout wide>
                <div>
                    <h2 className="text-lg font-bold text-gray-800 sm:text-xl">
                        Edit Pendaftaran
                    </h2>

                    <p className="mt-1 text-xs text-gray-400 sm:text-sm">
                        Perbarui data pendaftaran di bawah ini
                    </p>
                </div>

                {loading ? (
                    <div className="mt-4 rounded-xl bg-white p-10 text-center text-sm text-gray-400 shadow-sm">
                        Memuat data pendaftaran...
                    </div>
                ) : (
                    <PendaftaranForm
                        initial={pendaftaran}
                        processing={processing}
                        errors={errors}
                        onSubmit={handleSubmit}
                    />
                )}
            </AppLayout>
        </>
    );
}
