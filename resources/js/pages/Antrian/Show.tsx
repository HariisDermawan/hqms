import { Head, Link, router } from '@inertiajs/react';
import { useCallback, useEffect, useState } from 'react';
import {
    deleteAntrian,
    getAntrian,
    updateAntrian,
    type Antrian,
    type AntrianStatus,
} from '@/api/antrian';
import AppLayout from '@/Layouts/AppLayout';
import { formatTime, statusBadgeClass, statusLabel } from './status';

export default function AntrianShow({ id }: { id: number }) {
    const [antrian, setAntrian] = useState<Antrian | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [processing, setProcessing] = useState(false);

    const load = useCallback(async () => {
        try {
            setLoading(true);
            setError('');

            const response = await getAntrian(id);

            setAntrian(response.data?.antrian ?? null);

            if (!response.data?.antrian) {
                setError('Antrean tidak ditemukan.');
            }
        } catch (error: any) {
            console.error('Gagal memuat detail antrean', error);

            if (error.response?.status === 401) {
                window.location.href = '/login';
                return;
            }

            setError(
                error.response?.data?.message ||
                    'Gagal mengambil detail antrean.',
            );
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        void load();
    }, [load]);

    const changeStatus = async (status: AntrianStatus, label: string) => {
        if (!antrian) return;

        const confirmed = window.confirm(
            `Pindahkan antrean ${antrian.queue_number} ke status "${label}"?`,
        );

        if (!confirmed) return;

        try {
            setProcessing(true);

            await updateAntrian(antrian.id, { status });

            await load();
        } catch (error: any) {
            console.error('Gagal memperbarui status antrean', error);

            window.alert(
                error.response?.data?.message ||
                    'Gagal memperbarui status antrean.',
            );
        } finally {
            setProcessing(false);
        }
    };

    const handleDelete = async () => {
        if (!antrian) return;

        const confirmed = window.confirm(
            `Hapus antrean ${antrian.queue_number}? Tindakan ini tidak bisa dibatalkan.`,
        );

        if (!confirmed) return;

        try {
            setProcessing(true);

            await deleteAntrian(antrian.id);

            router.visit('/antrians');
        } catch (error: any) {
            console.error('Gagal menghapus antrean', error);

            window.alert(
                error.response?.data?.message || 'Gagal menghapus antrean.',
            );
        } finally {
            setProcessing(false);
        }
    };

    const steps: { key: AntrianStatus; label: string }[] = [
        { key: 'waiting', label: 'Menunggu' },
        { key: 'called', label: 'Dipanggil' },
        { key: 'serving', label: 'Dilayani' },
        { key: 'completed', label: 'Selesai' },
    ];

    const currentStep = antrian
        ? steps.findIndex((step) => step.key === antrian.status)
        : -1;

    if (loading) {
        return (
            <>
                <Head title="Detail Antrean" />

                <AppLayout wide>
                    <div className="flex min-h-[200px] items-center justify-center rounded-xl bg-white p-10 text-sm text-gray-400 shadow-sm">
                        Memuat detail antrean...
                    </div>
                </AppLayout>
            </>
        );
    }

    if (error || !antrian) {
        return (
            <>
                <Head title="Detail Antrean" />

                <AppLayout wide>
                    <div className="rounded-xl bg-white p-8 shadow-sm">
                        <p className="text-sm text-red-500">
                            {error || 'Antrean tidak ditemukan.'}
                        </p>
                    </div>
                </AppLayout>
            </>
        );
    }

    return (
        <>
            <Head title={`Antrean ${antrian.queue_number}`} />

            <AppLayout wide>
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h2 className="text-lg font-bold text-gray-800 sm:text-xl">
                            Antrean {antrian.queue_number}
                        </h2>

                        <p className="mt-1 text-xs text-gray-400 sm:text-sm">
                            Detail antrean pasien
                        </p>
                    </div>

                    <Link
                        href="/antrians"
                        className="rounded-[12px] bg-[#d9d9d9] px-4 py-[11px] text-[13px] font-bold text-gray-600 transition hover:bg-[#c9c9c9]"
                    >
                        Kembali
                    </Link>
                </div>

                <div className="mt-4 grid gap-4 lg:grid-cols-5">
                    {/* LEFT */}
                    <div className="lg:col-span-3">
                        {/* HERO */}
                        <div className="relative overflow-hidden rounded-xl bg-[#07577f] p-6 text-white shadow-sm">
                            <p className="text-[11px] font-semibold tracking-[0.14em] text-white/50 uppercase">
                                Antrean
                            </p>

                            <div className="mt-3 flex items-center gap-5">
                                <span className="text-5xl font-black tracking-tight">
                                    {antrian.queue_number}
                                </span>

                                <span
                                    className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${statusBadgeClass(antrian.status)}`}
                                >
                                    {statusLabel(antrian.status)}
                                </span>
                            </div>

                            <div className="mt-5">
                                <p className="text-lg font-bold">
                                    {antrian.pendaftaran?.pasien?.name ?? '-'}
                                </p>

                                <p className="text-[12px] text-white/60">
                                    No. RM{' '}
                                    {antrian.pendaftaran?.pasien
                                        ?.medical_record_number ?? '-'}
                                </p>
                            </div>
                        </div>

                        {/* TIMELINE */}
                        <div className="mt-4 rounded-xl bg-white p-5 shadow-sm">
                            <h3 className="text-[11px] font-bold tracking-wide text-gray-400 uppercase">
                                Alur Status
                            </h3>

                            <div className="mt-4 flex items-center">
                                {steps.map((step, index) => {
                                    const reached = index <= currentStep;
                                    const isCurrent = index === currentStep;

                                    return (
                                        <div
                                            key={step.key}
                                            className="flex flex-1 flex-col items-center"
                                        >
                                            <div
                                                className={`flex h-9 w-9 items-center justify-center rounded-full text-[12px] font-bold ${
                                                    isCurrent
                                                        ? 'bg-[#07577f] text-white ring-2 ring-[#07577f]/20'
                                                        : reached
                                                          ? 'bg-[#07577f] text-white'
                                                          : 'bg-[#f0f2f4] text-gray-400'
                                                }`}
                                            >
                                                {index + 1}
                                            </div>

                                            <p
                                                className={`mt-2 text-[9px] font-semibold whitespace-nowrap sm:text-[10px] ${
                                                    reached
                                                        ? 'text-[#07577f]'
                                                        : 'text-gray-400'
                                                }`}
                                            >
                                                {step.label}
                                            </p>

                                            {index < steps.length - 1 && (
                                                <div
                                                    className={`absolute top-[18px] right-0 h-0.5 w-full ${
                                                        index < currentStep
                                                            ? 'bg-[#07577f]'
                                                            : 'bg-[#f0f2f4]'
                                                    }`}
                                                />
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                                <div className="rounded-[10px] bg-[#f7f9fb] p-3.5">
                                    <p className="text-[10px] font-semibold tracking-wide text-gray-400 uppercase">
                                        Dipanggil
                                    </p>
                                    <p className="mt-1 text-[13px] font-semibold text-gray-700">
                                        {formatTime(antrian.called_at)}
                                    </p>
                                </div>

                                <div className="rounded-[10px] bg-[#f7f9fb] p-3.5">
                                    <p className="text-[10px] font-semibold tracking-wide text-gray-400 uppercase">
                                        Mulai Dilayani
                                    </p>
                                    <p className="mt-1 text-[13px] font-semibold text-gray-700">
                                        {formatTime(antrian.started_at)}
                                    </p>
                                </div>

                                <div className="rounded-[10px] bg-[#f7f9fb] p-3.5">
                                    <p className="text-[10px] font-semibold tracking-wide text-gray-400 uppercase">
                                        Selesai
                                    </p>
                                    <p className="mt-1 text-[13px] font-semibold text-gray-700">
                                        {formatTime(antrian.completed_at)}
                                    </p>
                                </div>

                                <div className="rounded-[10px] bg-[#f7f9fb] p-3.5">
                                    <p className="text-[10px] font-semibold tracking-wide text-gray-400 uppercase">
                                        Catatan
                                    </p>
                                    <p className="mt-1 text-[13px] font-semibold text-gray-700">
                                        {antrian.notes || '—'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT */}
                    <div className="lg:col-span-2">
                        <div className="rounded-xl bg-white p-5 shadow-sm">
                            <h3 className="text-[11px] font-bold tracking-wide text-gray-400 uppercase">
                                Informasi Pendaftaran
                            </h3>

                            <div className="mt-3 divide-y divide-gray-50">
                                <div className="flex justify-between py-2.5">
                                    <span className="text-[12px] text-gray-400">
                                        No. Registrasi
                                    </span>
                                    <Link
                                        href={`/pendaftarans/${antrian.pendaftaran?.id}`}
                                        className="max-w-[55%] text-right text-[12px] font-semibold text-[#07577f] hover:underline"
                                    >
                                        {antrian.pendaftaran
                                            ?.registration_number || '-'}
                                    </Link>
                                </div>

                                <div className="flex justify-between py-2.5">
                                    <span className="text-[12px] text-gray-400">
                                        Tanggal Daftar
                                    </span>
                                    <span className="text-[12px] font-semibold text-gray-700">
                                        {antrian.pendaftaran
                                            ?.registration_date || '-'}
                                    </span>
                                </div>

                                <div className="flex justify-between py-2.5">
                                    <span className="text-[12px] text-gray-400">
                                        Poli
                                    </span>
                                    <span className="text-[12px] font-semibold text-gray-700">
                                        {antrian.poli?.name || '-'}
                                    </span>
                                </div>

                                <div className="flex justify-between py-2.5">
                                    <span className="text-[12px] text-gray-400">
                                        Nama Pasien
                                    </span>
                                    <span className="max-w-[55%] text-right text-[12px] font-semibold text-gray-700">
                                        {antrian.pendaftaran?.pasien?.name ||
                                            '-'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* ACTIONS */}
                        <div className="mt-4 rounded-xl bg-white p-5 shadow-sm">
                            <h3 className="text-[11px] font-bold tracking-wide text-gray-400 uppercase">
                                Aksi
                            </h3>

                            <div className="mt-3 flex flex-col gap-2">
                                {antrian.status === 'waiting' && (
                                    <Link
                                        href={`/pendaftarans/create?antrian_id=${antrian.id}`}
                                        className="flex h-[43px] items-center justify-center gap-2 rounded-[12px] bg-[#07577f] text-[13px] font-bold text-white transition hover:bg-[#063f62] hover:shadow-md active:scale-[0.99]"
                                    >
                                        Panggil &amp; Daftarkan Pasien
                                    </Link>
                                )}

                                {antrian.status === 'called' && (
                                    <button
                                        type="button"
                                        disabled={processing}
                                        onClick={() =>
                                            changeStatus('serving', 'Dilayani')
                                        }
                                        className="flex h-[43px] items-center justify-center gap-2 rounded-[12px] bg-indigo-600 text-[13px] font-bold text-white transition hover:bg-indigo-700 hover:shadow-md active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        Mulai Pelayanan
                                    </button>
                                )}

                                {antrian.status === 'serving' && (
                                    <Link
                                        href={`/pemeriksaans/create?pasien_id=${antrian.pendaftaran?.pasien?.id ?? ''}&poli_id=${antrian.poli?.id ?? ''}`}
                                        className="flex h-[43px] items-center justify-center gap-2 rounded-[12px] bg-green-600 text-[13px] font-bold text-white transition hover:bg-green-700 hover:shadow-md active:scale-[0.99]"
                                    >
                                        Lanjut ke Pemeriksaan
                                    </Link>
                                )}

                                {(antrian.status === 'waiting' ||
                                    antrian.status === 'called') && (
                                    <button
                                        type="button"
                                        disabled={processing}
                                        onClick={() =>
                                            changeStatus('skipped', 'Dilewati')
                                        }
                                        className="flex h-[43px] items-center justify-center gap-2 rounded-[12px] bg-[#d9d9d9] text-[13px] font-bold text-gray-600 transition hover:bg-[#c9c9c9] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        Lewati
                                    </button>
                                )}

                                {antrian.status === 'serving' && (
                                    <button
                                        type="button"
                                        disabled={processing}
                                        onClick={() =>
                                            changeStatus('completed', 'Selesai')
                                        }
                                        className="flex h-[43px] items-center justify-center gap-2 rounded-[12px] bg-gray-800 text-[13px] font-bold text-white transition hover:bg-gray-900 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        Tandai Selesai
                                    </button>
                                )}

                                <Link
                                    href={`/antrians/${antrian.id}/edit`}
                                    className="flex h-[43px] items-center justify-center gap-2 rounded-[12px] bg-[#d9d9d9] text-[13px] font-bold text-gray-600 transition hover:bg-[#c9c9c9] active:scale-[0.99]"
                                >
                                    Ubah Status / Catatan
                                </Link>

                                <button
                                    type="button"
                                    disabled={processing}
                                    onClick={handleDelete}
                                    className="flex h-[43px] items-center justify-center gap-2 rounded-[12px] bg-red-50 text-[13px] font-bold text-red-500 transition hover:bg-red-100 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    Hapus Antrean
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </AppLayout>
        </>
    );
}
