import { Head, Link, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { getMessage, type Message } from '@/api/message';
import AppLayout from '@/Layouts/AppLayout';
import { statusBadgeClass, statusLabel } from './status';

const formatDate = (value: string | null): string => {
    if (!value) {
        return '—';
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return '—';
    }

    return date.toLocaleString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

const getInitials = (name: string): string =>
    name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part.charAt(0).toUpperCase())
        .join('');

const detailItem = (label: string, value: string, highlight = false) => (
    <div className="rounded-[10px] bg-[#f7f9fb] p-3">
        <p className="text-[11px] tracking-wider text-gray-400 uppercase">
            {label}
        </p>

        <p
            className={`mt-1 text-[13px] font-semibold ${highlight ? 'text-[#07577f]' : 'text-gray-700'}`}
        >
            {value}
        </p>
    </div>
);

export default function MessageShow() {
    const { id } = usePage<{ id: number }>().props;

    const [message, setMessage] = useState<Message | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        getMessage(id)
            .then((response) => {
                setMessage(response.data?.message ?? null);
            })
            .catch((error: any) => {
                console.error('Gagal memuat pesan', error);

                if (error.response?.status === 401) {
                    window.location.href = '/login';
                    return;
                }

                setError('Gagal mengambil data pesan.');
            })
            .finally(() => {
                setLoading(false);
            });
    }, [id]);

    return (
        <>
            <Head title="Detail Pesan" />

            <AppLayout wide>
                <div className="flex items-end justify-between">
                    <div>
                        <h2 className="text-lg font-bold text-gray-800 sm:text-xl">
                            Detail Pesan
                        </h2>

                        <p className="mt-1 text-xs text-gray-400 sm:text-sm">
                            Pesan yang dikirim melalui formulir kontak
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link
                            href={
                                message
                                    ? `/messages/${message.id}/edit`
                                    : '/messages'
                            }
                            className="flex h-[43px] items-center gap-2 rounded-[12px] bg-[#d9d9d9] px-4 text-[13px] font-bold text-gray-600 transition hover:bg-[#c9c9c9]"
                        >
                            Edit Pesan
                        </Link>

                        <Link
                            href={
                                message
                                    ? `/messages/${message.id}/edit?reply=1`
                                    : '/messages'
                            }
                            className="flex h-[43px] items-center gap-2 rounded-[12px] bg-[#084e7a] px-4 text-[13px] font-bold text-white transition hover:bg-[#063f62] hover:shadow-md active:scale-[0.99]"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-[15px] w-[15px]"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <path d="M9 14 4 9l5-5" />
                                <path d="M4 9h10a6 6 0 0 1 0 12h-3" />
                            </svg>

                            <span>Balas</span>
                        </Link>
                    </div>
                </div>

                {loading ? (
                    <div className="mt-4 rounded-xl bg-white p-10 text-center text-sm text-gray-400 shadow-sm">
                        Memuat data pesan...
                    </div>
                ) : error ? (
                    <div className="mt-4 rounded-[10px] bg-red-50 px-3 py-2 text-[12px] text-red-500">
                        {error}
                    </div>
                ) : (
                    message && (
                        <div className="mt-4 rounded-xl bg-white p-5 shadow-sm sm:p-6">
                            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#07577f]/10">
                                    <span className="text-lg font-bold text-[#07577f]">
                                        {getInitials(message.name) || '?'}
                                    </span>
                                </div>

                                <div>
                                    <div className="flex flex-wrap items-center gap-2">
                                        <h3 className="text-base font-bold text-gray-800">
                                            {message.name}
                                        </h3>

                                        <span
                                            className={`rounded-md px-2 py-0.5 text-[11px] font-bold ${statusBadgeClass(message.status)}`}
                                        >
                                            {statusLabel(message.status)}
                                        </span>
                                    </div>

                                    <p className="mt-1 text-[13px] text-gray-500">
                                        {message.email}
                                        {message.phone
                                            ? ` · ${message.phone}`
                                            : ''}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                                {detailItem(
                                    'Subjek',
                                    message.subject ?? '-',
                                    true,
                                )}
                                {detailItem(
                                    'Dibalas pada',
                                    formatDate(message.replied_at),
                                    true,
                                )}
                            </div>

                            <div className="mt-4 rounded-[10px] bg-[#f7f9fb] p-3">
                                <p className="text-[11px] tracking-wider text-gray-400 uppercase">
                                    Pesan
                                </p>

                                <p className="mt-1 text-[13px] whitespace-pre-wrap text-gray-700">
                                    {message.message}
                                </p>
                            </div>

                            {message.admin_reply && (
                                <div className="mt-4 rounded-[10px] bg-[#07577f]/5 p-3">
                                    <p className="text-[11px] tracking-wider text-[#07577f]/70 uppercase">
                                        Balasan Admin
                                    </p>

                                    <p className="mt-1 text-[13px] whitespace-pre-wrap text-gray-700">
                                        {message.admin_reply}
                                    </p>
                                </div>
                            )}

                            <div className="mt-4">
                                <Link
                                    href="/messages"
                                    className="inline-flex h-[43px] items-center rounded-[12px] bg-[#d9d9d9] px-5 text-[13px] font-bold text-gray-600 transition hover:bg-[#c9c9c9]"
                                >
                                    Kembali
                                </Link>
                            </div>
                        </div>
                    )
                )}
            </AppLayout>
        </>
    );
}
