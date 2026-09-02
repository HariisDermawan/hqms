import { Head, Link, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { getAntrians, storeAntrian, type AntrianPayload } from '@/api/antrian';
import { getPendaftarans, type Pendaftaran } from '@/api/pendaftaran';
import AppLayout from '@/Layouts/AppLayout';
import { todayLocal } from './status';

const inputClass =
    'w-full h-[42px] px-[12px] rounded-[12px] bg-[#d9d9d9] text-[13px] text-gray-700 placeholder:text-[#999] outline-none focus:bg-[#d5d5d5] focus:ring-2 focus:ring-[#084e7a]/30 transition';

const labelClass = 'block text-[13px] text-[#333] mb-[4px]';

export default function AntrianCreate() {
    const [pendaftarans, setPendaftarans] = useState<Pendaftaran[]>([]);
    const [optionsLoaded, setOptionsLoaded] = useState(false);
    const [pendaftaranId, setPendaftaranId] = useState('');
    const [notes, setNotes] = useState('');
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        Promise.all([getPendaftarans(1, 100), getAntrians({ perPage: 100 })])
            .then(([pendaftaransResponse, antriansResponse]) => {
                const queuedIds = new Set(
                    (antriansResponse.data?.items ?? []).map(
                        (antrian) => antrian.pendaftaran?.id,
                    ),
                );

                setPendaftarans(
                    (pendaftaransResponse.data?.items ?? []).filter(
                        (pendaftaran) =>
                            pendaftaran.status === 'waiting' &&
                            pendaftaran.registration_date === todayLocal() &&
                            pendaftaran.id !== undefined &&
                            !queuedIds.has(pendaftaran.id),
                    ),
                );
            })
            .catch((error: any) => {
                console.error('Gagal memuat pendaftaran', error);

                if (error.response?.status === 401) {
                    window.location.href = '/login';
                }
            })
            .finally(() => {
                setOptionsLoaded(true);
            });
    }, []);

    const handleSubmit = async () => {
        setProcessing(true);
        setErrors({});

        try {
            await storeAntrian({
                pendaftaran_id: Number(pendaftaranId),
                notes: notes.trim() || undefined,
            } as AntrianPayload);

            router.visit('/antrians');
        } catch (error: any) {
            console.error('Gagal menambah antrean', error);

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
                    error.response?.data?.message || 'Gagal menambah antrean.',
            });
        } finally {
            setProcessing(false);
        }
    };

    return (
        <>
            <Head title="Tambah Antrean" />

            <AppLayout wide>
                <div>
                    <h2 className="text-lg font-bold text-gray-800 sm:text-xl">
                        Tambah Antrean
                    </h2>

                    <p className="mt-1 text-xs text-gray-400 sm:text-sm">
                        Masukkan pendaftaran pasien hari ini ke antrean
                    </p>
                </div>

                <div className="mt-4 rounded-xl bg-white p-5 shadow-sm sm:p-6">
                    {errors.general && (
                        <div className="mb-4 rounded-[10px] bg-red-50 px-3 py-2 text-[12px] text-red-500">
                            {errors.general}
                        </div>
                    )}

                    {!optionsLoaded ? (
                        <div className="p-10 text-center text-sm text-gray-400">
                            Memuat pendaftaran...
                        </div>
                    ) : (
                        <>
                            <div>
                                <label
                                    htmlFor="pendaftaran_id"
                                    className={labelClass}
                                >
                                    Pendaftaran (hari ini, status menunggu)
                                </label>

                                {pendaftarans.length === 0 ? (
                                    <div className="rounded-[10px] bg-amber-50 px-3 py-2.5 text-[12px] text-amber-600">
                                        Tidak ada pendaftaran tersedia. Pastikan
                                        ada pendaftaran hari ini dengan status
                                        menunggu.
                                    </div>
                                ) : (
                                    <select
                                        id="pendaftaran_id"
                                        value={pendaftaranId}
                                        onChange={(event) =>
                                            setPendaftaranId(event.target.value)
                                        }
                                        className={inputClass}
                                    >
                                        <option value="">
                                            Pilih pendaftaran...
                                        </option>

                                        {pendaftarans.map((pendaftaran) => (
                                            <option
                                                key={pendaftaran.id}
                                                value={pendaftaran.id}
                                            >
                                                {pendaftaran.queue_number} ·{' '}
                                                {pendaftaran.pasien?.name} ·{' '}
                                                {pendaftaran.poli?.name}
                                            </option>
                                        ))}
                                    </select>
                                )}

                                {errors.pendaftaran_id && (
                                    <p className="mt-1 text-[11px] text-red-500">
                                        {errors.pendaftaran_id}
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
                                    onChange={(event) =>
                                        setNotes(event.target.value)
                                    }
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

                            <div className="mt-6 flex items-center justify-end gap-3">
                                <Link
                                    href="/antrians"
                                    className="h-[43px] rounded-[12px] bg-[#d9d9d9] px-5 text-[13px] font-bold text-gray-600 transition hover:bg-[#c9c9c9]"
                                >
                                    Batal
                                </Link>

                                <button
                                    type="button"
                                    onClick={handleSubmit}
                                    disabled={processing || !pendaftaranId}
                                    className="h-[43px] rounded-[12px] bg-[#084e7a] px-6 text-[13px] font-bold text-white transition hover:bg-[#063f62] hover:shadow-md active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {processing
                                        ? 'Menambahkan...'
                                        : 'Tambah ke Antrean'}
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </AppLayout>
        </>
    );
}
