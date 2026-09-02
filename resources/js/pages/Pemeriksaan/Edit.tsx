import { Head, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import {
    getPemeriksaan,
    updatePemeriksaan,
    type Pemeriksaan,
    type PemeriksaanPayload,
} from '@/api/pemeriksaan';
import AppLayout from '@/Layouts/AppLayout';
import PemeriksaanForm from './Form';

export default function PemeriksaanEdit() {
    const { id } = usePage<{ id: number }>().props;

    const [pemeriksaan, setPemeriksaan] = useState<Pemeriksaan | null>(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        getPemeriksaan(id)
            .then((response) => {
                setPemeriksaan(response.data?.pemeriksaan ?? null);
            })
            .catch((error: any) => {
                console.error('Gagal memuat pemeriksaan', error);

                if (
                    error.response?.status === 401 ||
                    error.response?.status === 404
                ) {
                    window.location.href =
                        error.response?.status === 401
                            ? '/login'
                            : '/pemeriksaans';
                    return;
                }

                window.alert('Gagal memuat data pemeriksaan.');
            })
            .finally(() => {
                setLoading(false);
            });
    }, [id]);

    const handleSubmit = async (payload: PemeriksaanPayload) => {
        setProcessing(true);
        setErrors({});

        try {
            await updatePemeriksaan(id, payload);

            router.visit(`/pemeriksaans/${id}`);
        } catch (error: any) {
            console.error('Gagal memperbarui pemeriksaan', error);

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
                    'Gagal memperbarui data pemeriksaan.',
            });
        } finally {
            setProcessing(false);
        }
    };

    return (
        <>
            <Head title="Edit Pemeriksaan" />

            <AppLayout wide>
                <div>
                    <h2 className="text-lg font-bold text-gray-800 sm:text-xl">
                        Edit Pemeriksaan
                    </h2>

                    <p className="mt-1 text-xs text-gray-400 sm:text-sm">
                        Perbarui hasil pemeriksaan pasien
                    </p>
                </div>

                {loading ? (
                    <div className="mt-4 rounded-xl bg-white p-10 text-center text-sm text-gray-400 shadow-sm">
                        Memuat data pemeriksaan...
                    </div>
                ) : (
                    <PemeriksaanForm
                        initial={pemeriksaan}
                        processing={processing}
                        errors={errors}
                        onSubmit={handleSubmit}
                    />
                )}
            </AppLayout>
        </>
    );
}
