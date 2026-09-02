import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { storeMessage, type MessagePayload } from '@/api/message';
import AppLayout from '@/Layouts/AppLayout';
import MessageForm from './Form';

export default function MessageCreate() {
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleSubmit = async (payload: MessagePayload) => {
        setProcessing(true);
        setErrors({});

        try {
            await storeMessage(payload);

            router.visit('/messages');
        } catch (error: any) {
            console.error('Gagal menyimpan pesan', error);

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
                    error.response?.data?.message || 'Gagal menyimpan pesan.',
            });
        } finally {
            setProcessing(false);
        }
    };

    return (
        <>
            <Head title="Buat Pesan" />

            <AppLayout wide>
                <div>
                    <h2 className="text-lg font-bold text-gray-800 sm:text-xl">
                        Buat Pesan
                    </h2>

                    <p className="mt-1 text-xs text-gray-400 sm:text-sm">
                        Catat pesan masuk dari pengunjung
                    </p>
                </div>

                <MessageForm
                    processing={processing}
                    errors={errors}
                    onSubmit={handleSubmit}
                />
            </AppLayout>
        </>
    );
}
