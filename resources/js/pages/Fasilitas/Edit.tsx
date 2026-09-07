import { Head, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import {
    getFasilitas,
    updateFasilitas,
    type Fasilitas,
    type FasilitasPayload,
} from '@/api/fasilitas';
import AppLayout from '@/Layouts/AppLayout';
import FasilitasForm from './Form';

export default function FasilitasEdit() {
    const { id } = usePage<{ id: number | string }>().props;

    const [fasilitas, setFasilitas] = useState<Fasilitas | null>(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        getFasilitas(id)
            .then((response) => {
                setFasilitas(response.data?.fasilitas ?? null);
            })
            .catch((error: any) => {
                console.error('Gagal memuat fasilitas', error);

                if (
                    error.response?.status === 401 ||
                    error.response?.status === 404
                ) {
                    window.location.href =
                        error.response?.status === 401
                            ? '/login'
                            : '/fasilitas';

                    return;
                }

                window.alert('Gagal memuat data fasilitas.');
            })
            .finally(() => {
                setLoading(false);
            });
    }, [id]);

    const handleSubmit = async (payload: FasilitasPayload, image?: File) => {
        setProcessing(true);
        setErrors({});

        try {
            await updateFasilitas(id, payload, image);

            router.visit('/fasilitas');
        } catch (error: any) {
            console.error('Gagal memperbarui fasilitas', error);

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
                    'Gagal memperbarui data fasilitas.',
            });
        } finally {
            setProcessing(false);
        }
    };

    return (
        <>
            <Head title="Ubah Fasilitas" />

            <AppLayout wide>
                <div>
                    <h2 className="text-lg font-bold text-gray-800 sm:text-xl">
                        Ubah Fasilitas
                    </h2>

                    <p className="mt-1 text-xs text-gray-400 sm:text-sm">
                        Perbarui data fasilitas di bawah ini
                    </p>
                </div>

                {loading ? (
                    <div className="mt-4 rounded-xl bg-white p-10 text-center text-sm text-gray-400 shadow-sm">
                        Memuat data fasilitas...
                    </div>
                ) : (
                    <FasilitasForm
                        initial={fasilitas}
                        processing={processing}
                        errors={errors}
                        onSubmit={handleSubmit}
                    />
                )}
            </AppLayout>
        </>
    );
}
