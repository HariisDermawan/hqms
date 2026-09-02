import { Head, Link, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { storeAntrian } from '@/api/antrian';
import { getPolis, type Poli } from '@/api/poli';
import AppLayout from '@/Layouts/AppLayout';

const inputClass =
    'w-full h-[42px] px-[12px] rounded-[12px] bg-[#d9d9d9] text-[13px] text-gray-700 placeholder:text-[#999] outline-none focus:bg-[#d5d5d5] focus:ring-2 focus:ring-[#084e7a]/30 transition';

const labelClass = 'block text-[13px] text-[#333] mb-[4px]';

export default function AntrianCreate() {
    const [polis, setPolis] = useState<Poli[]>([]);
    const [optionsLoaded, setOptionsLoaded] = useState(false);
    const [poliId, setPoliId] = useState('');
    const [notes, setNotes] = useState('');
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        getPolis(1, 100)
            .then((polisResponse) => {
                setPolis(polisResponse.data?.items ?? []);
            })
            .catch((error: any) => {
                console.error('Gagal memuat poli', error);

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
                poli_id: Number(poliId),
                notes: notes.trim() || undefined,
            });

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
            <Head title="Ambil Antrean" />

            <AppLayout wide>
                <div>
                    <h2 className="text-lg font-bold text-gray-800 sm:text-xl">
                        Ambil Antrean
                    </h2>

                    <p className="mt-1 text-xs text-gray-400 sm:text-sm">
                        Ambil tiket antrean untuk poli tujuan
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
                            Memuat poli...
                        </div>
                    ) : (
                        <>
                            <div>
                                <label htmlFor="poli_id" className={labelClass}>
                                    Poli
                                </label>

                                <select
                                    id="poli_id"
                                    value={poliId}
                                    onChange={(event) =>
                                        setPoliId(event.target.value)
                                    }
                                    className={inputClass}
                                >
                                    <option value="">Pilih poli...</option>

                                    {polis.map((poli) => (
                                        <option key={poli.id} value={poli.id}>
                                            {poli.name}
                                            {poli.queue_prefix
                                                ? ` — antrean ${poli.queue_prefix}-001..`
                                                : ''}
                                        </option>
                                    ))}
                                </select>

                                {errors.poli_id && (
                                    <p className="mt-1 text-[11px] text-red-500">
                                        {errors.poli_id}
                                    </p>
                                )}
                            </div>

                            <p className="mt-2 text-[11px] text-gray-400">
                                Nomor antrean dibuat otomatis oleh sistem
                                berdasarkan poli dan urutan antrean hari ini.
                            </p>

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
                                    disabled={processing || !poliId}
                                    className="h-[43px] rounded-[12px] bg-[#084e7a] px-6 text-[13px] font-bold text-white transition hover:bg-[#063f62] hover:shadow-md active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {processing
                                        ? 'Menambahkan...'
                                        : 'Ambil Tiket'}
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </AppLayout>
        </>
    );
}
