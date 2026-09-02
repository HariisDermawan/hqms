import { Head, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import {
    getRuangan,
    updateRuangan,
    type Ruangan,
    type RuanganPayload,
} from '@/api/ruangan';
import AppLayout from '@/Layouts/AppLayout';
import RuanganForm from './Form';

export default function RuanganEdit() {
    const { id } = usePage<{ id: number }>().props;

    const [ruangan, setRuangan] = useState<Ruangan | null>(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        getRuangan(id)
            .then((response) => {
                setRuangan(response.data?.ruangan ?? null);
            })
            .catch((error: any) => {
                console.error('Gagal memuat ruangan', error);

                if (
                    error.response?.status === 401 ||
                    error.response?.status === 404
                ) {
                    window.location.href =
                        error.response?.status === 401 ? '/login' : '/ruangans';
                    return;
                }

                window.alert('Gagal memuat data ruangan.');
            })
            .finally(() => {
                setLoading(false);
            });
    }, [id]);

    const handleSubmit = async (payload: RuanganPayload) => {
        setProcessing(true);
        setErrors({});

        try {
            await updateRuangan(id, payload);

            router.visit('/ruangans');
        } catch (error: any) {
            console.error('Gagal memperbarui ruangan', error);

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
                    'Gagal memperbarui data ruangan.',
            });
        } finally {
            setProcessing(false);
        }
    };

    return (
        <>
            <Head title="Edit Ruangan" />

            <AppLayout wide>
                <div>
                    <h2 className="text-lg font-bold text-gray-800 sm:text-xl">
                        Edit Ruangan
                    </h2>

                    <p className="mt-1 text-xs text-gray-400 sm:text-sm">
                        Perbarui data ruangan di bawah ini
                    </p>
                </div>

                {loading ? (
                    <div className="mt-4 rounded-xl bg-white p-10 text-center text-sm text-gray-400 shadow-sm">
                        Memuat data ruangan...
                    </div>
                ) : (
                    <RuanganForm
                        initial={ruangan}
                        processing={processing}
                        errors={errors}
                        onSubmit={handleSubmit}
                    />
                )}
            </AppLayout>
        </>
    );
}
