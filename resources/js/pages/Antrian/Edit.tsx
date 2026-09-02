import { Head, Link, router } from '@inertiajs/react';
import { useCallback, useEffect, useState } from 'react';
import { getAntrian, updateAntrian, type AntrianStatus } from '@/api/antrian';
import AppLayout from '@/Layouts/AppLayout';
import { STATUS_OPTIONS, statusLabel } from './status';

const inputClass =
    'w-full h-[42px] px-[12px] rounded-[12px] bg-[#d9d9d9] text-[13px] text-gray-700 placeholder:text-[#999] outline-none focus:bg-[#d5d5d5] focus:ring-2 focus:ring-[#084e7a]/30 transition';

const labelClass = 'block text-[13px] text-[#333] mb-[4px]';

const HINT: Partial<Record<AntrianStatus, string>> = {
    called: 'Waktu panggil akan dicatat otomatis.',
    serving: 'Waktu mulai akan dicatat otomatis.',
    completed: 'Waktu selesai akan dicatat otomatis.',
};

export default function AntrianEdit({ id }: { id: number }) {
    const [status, setStatus] = useState<AntrianStatus | ''>('');
    const [notes, setNotes] = useState('');
    const [initialStatus, setInitialStatus] = useState('');
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        getAntrian(id)
            .then((response) => {
                const antrian = response.data?.antrian;

                if (!antrian) {
                    setNotFound(true);
                    return;
                }

                setStatus(antrian.status);
                setInitialStatus(antrian.status);
                setNotes(antrian.notes ?? '');
            })
            .catch((error: any) => {
                console.error('Gagal memuat antrean', error);

                if (error.response?.status === 401) {
                    window.location.href = '/login';
                    return;
                }

                setNotFound(true);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [id]);

    const handleBack = useCallback(() => {
        router.visit('/antrians');
    }, []);

    if (loading) {
        return (
            <>
                <Head title="Ubah Antrean" />

                <AppLayout wide>
                    <div className="flex min-h-[200px] items-center justify-center rounded-xl bg-white p-10 text-sm text-gray-400 shadow-sm">
                        Memuat antrean...
                    </div>
                </AppLayout>
            </>
        );
    }

    if (notFound) {
        return (
            <>
                <Head title="Ubah Antrean" />

                <AppLayout wide>
                    <div className="rounded-xl bg-white p-8 shadow-sm">
                        <p className="text-sm text-red-500">
                            Antrean tidak ditemukan.
                        </p>
                    </div>
                </AppLayout>
            </>
        );
    }

    const handleSubmit = async () => {
        if (!status) return;

        setProcessing(true);
        setErrors({});

        try {
            await updateAntrian(id, {
                status,
                notes: notes.trim() || undefined,
            });

            handleBack();
        } catch (error: any) {
            console.error('Gagal memperbarui antrean', error);

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
                    'Gagal memperbarui antrean.',
            });
        } finally {
            setProcessing(false);
        }
    };

    return (
        <>
            <Head title="Ubah Antrean" />

            <AppLayout wide>
                <div>
                    <h2 className="text-lg font-bold text-gray-800 sm:text-xl">
                        Ubah Antrean
                    </h2>

                    <p className="mt-1 text-xs text-gray-400 sm:text-sm">
                        Perbarui status dan catatan antrean
                    </p>
                </div>

                <div className="mt-4 rounded-xl bg-white p-5 shadow-sm sm:p-6">
                    {errors.general && (
                        <div className="mb-4 rounded-[10px] bg-red-50 px-3 py-2 text-[12px] text-red-500">
                            {errors.general}
                        </div>
                    )}

                    <div>
                        <label htmlFor="status" className={labelClass}>
                            Status
                        </label>

                        <select
                            id="status"
                            value={status}
                            onChange={(event) =>
                                setStatus(event.target.value as AntrianStatus)
                            }
                            className={inputClass}
                        >
                            {STATUS_OPTIONS.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>

                        {HINT[status as AntrianStatus] &&
                            initialStatus !== status && (
                                <p className="mt-1.5 text-[11px] text-amber-600">
                                    {HINT[status as AntrianStatus]}
                                </p>
                            )}

                        {errors.status && (
                            <p className="mt-1 text-[11px] text-red-500">
                                {errors.status}
                            </p>
                        )}
                    </div>

                    <div className="mt-4">
                        <label htmlFor="notes" className={labelClass}>
                            Catatan{' '}
                            <span className="font-normal text-gray-400">
                                (opsional)
                            </span>
                        </label>

                        <textarea
                            id="notes"
                            value={notes}
                            onChange={(event) => setNotes(event.target.value)}
                            rows={3}
                            placeholder="Keterangan tambahan untuk petugas..."
                            className="w-full rounded-[12px] bg-[#d9d9d9] px-[12px] py-[10px] text-[13px] text-gray-700 transition outline-none placeholder:text-[#999] focus:bg-[#d5d5d5] focus:ring-2 focus:ring-[#084e7a]/30"
                        />

                        {errors.notes && (
                            <p className="mt-1 text-[11px] text-red-500">
                                {errors.notes}
                            </p>
                        )}
                    </div>

                    <div className="mt-6 flex items-center gap-3">
                        <p className="flex-1 text-[11px] text-gray-400">
                            Status saat ini:{' '}
                            <span className="font-semibold text-[#07577f]">
                                {statusLabel(initialStatus as AntrianStatus)}
                            </span>
                        </p>

                        <Link
                            href="/antrians"
                            className="h-[43px] rounded-[12px] bg-[#d9d9d9] px-5 text-[13px] font-bold text-gray-600 transition hover:bg-[#c9c9c9]"
                        >
                            Batal
                        </Link>

                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={processing || !status}
                            className="h-[43px] rounded-[12px] bg-[#084e7a] px-6 text-[13px] font-bold text-white transition hover:bg-[#063f62] hover:shadow-md active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                        </button>
                    </div>
                </div>
            </AppLayout>
        </>
    );
}
