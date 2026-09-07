import { Head, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { getFasilitas, type Fasilitas } from '@/api/fasilitas';
import AppLayout from '@/Layouts/AppLayout';
import Form from './Form';

export default function Edit() {
    const { id } = usePage<{ id: number | string }>().props;

    const [fasilitas, setFasilitas] = useState<Fasilitas | null>(null);
    const [loading, setLoading] = useState(true);

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
                        error.response?.status === 401 ? '/login' : '/fasilitas';
                    return;
                }

                window.alert('Gagal memuat data fasilitas.');
            })
            .finally(() => {
                setLoading(false);
            });
    }, [id]);

    return (
        <>
            <Head title="Ubah Fasilitas" />

            <AppLayout wide>
                {loading ? (
                    <div className="rounded-xl bg-white p-10 text-center text-sm text-gray-400 shadow-sm">
                        Memuat data fasilitas...
                    </div>
                ) : (
                    <Form fasilitas={fasilitas ?? undefined} mode="edit" />
                )}
            </AppLayout>
        </>
    );
}
