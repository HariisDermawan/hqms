import { Head, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import {
    getMessage,
    updateMessage,
    type Message,
    type MessagePayload,
} from '@/api/message';
import AppLayout from '@/Layouts/AppLayout';
import MessageForm from './Form';

export default function MessageEdit() {
    const { id, reply } = usePage<{ id: number; reply?: boolean }>().props;

    const forceReply = reply ?? false;

    const [message, setMessage] = useState<Message | null>(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        getMessage(id)
            .then((response) => {
                setMessage(response.data?.message ?? null);
            })
            .catch((error: any) => {
                console.error('Gagal memuat pesan', error);

                if (
                    error.response?.status === 401 ||
                    error.response?.status === 404
                ) {
                    window.location.href = '/messages';
                    return;
                }

                window.alert('Gagal memuat data pesan.');
            })
            .finally(() => {
                setLoading(false);
            });
    }, [id]);

    const handleSubmit = async (payload: MessagePayload) => {
        setProcessing(true);
        setErrors({});

        try {
            await updateMessage(id, payload);

            router.visit(`/messages/${id}`);
        } catch (error: any) {
            console.error('Gagal memperbarui pesan', error);

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
                    error.response?.data?.message || 'Gagal memperbarui pesan.',
            });
        } finally {
            setProcessing(false);
        }
    };

    return (
        <>
            <Head title="Edit Pesan" />

            <AppLayout wide>
                <div>
                    <h2 className="text-lg font-bold text-gray-800 sm:text-xl">
                        Edit Pesan
                    </h2>

                    <p className="mt-1 text-xs text-gray-400 sm:text-sm">
                        Perbarui pesan masuk dari pengunjung
                    </p>
                </div>

                {loading ? (
                    <div className="mt-4 rounded-xl bg-white p-10 text-center text-sm text-gray-400 shadow-sm">
                        Memuat data pesan...
                    </div>
                ) : (
                    <MessageForm
                        initial={message}
                        forceReply={forceReply}
                        processing={processing}
                        errors={errors}
                        onSubmit={handleSubmit}
                    />
                )}
            </AppLayout>
        </>
    );
}
