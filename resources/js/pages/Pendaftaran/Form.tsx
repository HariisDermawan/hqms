import { Link } from '@inertiajs/react';
import { useEffect, useState, type FormEvent } from 'react';
import { getPasiens, type Pasien } from '@/api/pasien';
import {
    type Pendaftaran,
    type PendaftaranPayload,
    type PendaftaranStatus,
} from '@/api/pendaftaran';
import { getPolis, type Poli } from '@/api/poli';

export const STATUS_OPTIONS: {
    value: PendaftaranStatus;
    label: string;
}[] = [
    { value: 'waiting', label: 'Menunggu' },
    { value: 'called', label: 'Dipanggil' },
    { value: 'serving', label: 'Dilayani' },
    { value: 'completed', label: 'Selesai' },
    { value: 'cancelled', label: 'Dibatalkan' },
];

const STATUS_LABELS: Record<PendaftaranStatus, string> = Object.fromEntries(
    STATUS_OPTIONS.map((item) => [item.value, item.label]),
) as Record<PendaftaranStatus, string>;

export const statusLabel = (status: PendaftaranStatus): string =>
    STATUS_LABELS[status] ?? status;

export const statusBadgeClass = (status: PendaftaranStatus): string => {
    switch (status) {
        case 'waiting':
            return 'bg-amber-50 text-amber-600';
        case 'called':
            return 'bg-blue-50 text-blue-600';
        case 'serving':
            return 'bg-indigo-50 text-indigo-600';
        case 'completed':
            return 'bg-green-50 text-green-600';
        case 'cancelled':
            return 'bg-red-50 text-red-500';
        default:
            return 'bg-gray-100 text-gray-500';
    }
};

const todayLocal = (): string => {
    const now = new Date();

    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
};

interface PendaftaranFormProps {
    initial?: Pendaftaran | null;
    processing: boolean;
    errors?: Record<string, string | undefined> & {
        general?: string;
    };
    onSubmit: (payload: PendaftaranPayload) => void;
}

const inputClass =
    'w-full h-[42px] px-[12px] rounded-[12px] bg-[#d9d9d9] text-[13px] text-gray-700 placeholder:text-[#999] outline-none focus:bg-[#d5d5d5] focus:ring-2 focus:ring-[#084e7a]/30 transition';

const labelClass = 'block text-[13px] text-[#333] mb-[4px]';

export default function PendaftaranForm({
    initial,
    processing,
    errors = {},
    onSubmit,
}: PendaftaranFormProps) {
    const [pasiens, setPasiens] = useState<Pasien[]>([]);
    const [polis, setPolis] = useState<Poli[]>([]);
    const [optionsLoaded, setOptionsLoaded] = useState(false);

    const [pasienId, setPasienId] = useState('');
    const [poliId, setPoliId] = useState('');
    const [registrationDate, setRegistrationDate] = useState('');
    const [status, setStatus] = useState<PendaftaranStatus>('waiting');
    const [notes, setNotes] = useState('');

    useEffect(() => {
        Promise.all([getPasiens(1, 100), getPolis(1, 100)])
            .then(([pasiensResponse, polisResponse]) => {
                setPasiens(pasiensResponse.data?.items ?? []);
                setPolis(polisResponse.data?.items ?? []);
            })
            .catch((error: any) => {
                console.error('Gagal memuat opsi pasien/poli', error);

                if (error.response?.status === 401) {
                    window.location.href = '/login';
                }
            })
            .finally(() => {
                setOptionsLoaded(true);
            });
    }, []);

    useEffect(() => {
        if (!optionsLoaded) {
            return;
        }

        setPasienId(initial?.pasien?.id ? String(initial.pasien.id) : '');
        setPoliId(initial?.poli?.id ? String(initial.poli.id) : '');
        setRegistrationDate(initial?.registration_date ?? todayLocal());
        setStatus(initial?.status ?? 'waiting');
        setNotes(initial?.notes ?? '');
    }, [optionsLoaded, initial]);

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        onSubmit({
            pasien_id: Number(pasienId),
            poli_id: Number(poliId),
            registration_date: registrationDate,
            notes: notes.trim() || undefined,
            status: initial ? status : undefined,
        });
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="mt-4 rounded-xl bg-white p-5 shadow-sm sm:p-6"
        >
            {errors.general && (
                <div className="mb-4 rounded-[10px] bg-red-50 px-3 py-2 text-[12px] text-red-500">
                    {errors.general}
                </div>
            )}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* PASIEN */}
                <div className="sm:col-span-2">
                    <label htmlFor="pasien_id" className={labelClass}>
                        Pasien
                    </label>

                    <select
                        id="pasien_id"
                        value={pasienId}
                        onChange={(event) => setPasienId(event.target.value)}
                        className={inputClass}
                    >
                        <option value="">Pilih pasien...</option>

                        {pasiens.map((pasien) => (
                            <option key={pasien.id} value={pasien.id}>
                                {pasien.name} — {pasien.medical_record_number}
                            </option>
                        ))}
                    </select>

                    {errors.pasien_id && (
                        <p className="mt-1 text-[11px] text-red-500">
                            {errors.pasien_id}
                        </p>
                    )}
                </div>

                {/* POLI */}
                <div className="sm:col-span-2">
                    <label htmlFor="poli_id" className={labelClass}>
                        Poli
                    </label>

                    <select
                        id="poli_id"
                        value={poliId}
                        onChange={(event) => setPoliId(event.target.value)}
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

                {/* TANGGAL */}
                <div>
                    <label htmlFor="registration_date" className={labelClass}>
                        Tanggal Periksa
                    </label>

                    <input
                        id="registration_date"
                        type="date"
                        value={registrationDate}
                        onChange={(event) =>
                            setRegistrationDate(event.target.value)
                        }
                        className={inputClass}
                    />

                    {errors.registration_date && (
                        <p className="mt-1 text-[11px] text-red-500">
                            {errors.registration_date}
                        </p>
                    )}
                </div>

                {/* STATUS (hanya edit) */}
                {initial ? (
                    <div>
                        <label htmlFor="status" className={labelClass}>
                            Status
                        </label>

                        <select
                            id="status"
                            value={status}
                            onChange={(event) =>
                                setStatus(
                                    event.target.value as PendaftaranStatus,
                                )
                            }
                            className={inputClass}
                        >
                            {STATUS_OPTIONS.map((item) => (
                                <option key={item.value} value={item.value}>
                                    {item.label}
                                </option>
                            ))}
                        </select>

                        {errors.status && (
                            <p className="mt-1 text-[11px] text-red-500">
                                {errors.status}
                            </p>
                        )}
                    </div>
                ) : (
                    <div className="flex items-end">
                        <p className="w-full rounded-[10px] bg-[#f7f9fb] px-3 py-2.5 text-[12px] text-gray-500">
                            Nomor antrean & nomor registrasi dibuat otomatis
                            oleh sistem.
                        </p>
                    </div>
                )}

                {/* CATATAN */}
                <div className="sm:col-span-2">
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
                        placeholder="Catatan keluhan, rujukan, atau keterangan tambahan..."
                        className="w-full rounded-[12px] bg-[#d9d9d9] px-[12px] py-[10px] text-[13px] text-gray-700 transition outline-none placeholder:text-[#999] focus:bg-[#d5d5d5] focus:ring-2 focus:ring-[#084e7a]/30"
                    />

                    {errors.notes && (
                        <p className="mt-1 text-[11px] text-red-500">
                            {errors.notes}
                        </p>
                    )}
                </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
                <Link
                    href="/pendaftarans"
                    className="h-[43px] rounded-[12px] bg-[#d9d9d9] px-5 text-[13px] font-bold text-gray-600 transition hover:bg-[#c9c9c9]"
                >
                    Batal
                </Link>

                <button
                    type="submit"
                    disabled={processing}
                    className="h-[43px] rounded-[12px] bg-[#084e7a] px-6 text-[13px] font-bold text-white transition hover:bg-[#063f62] hover:shadow-md active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {processing
                        ? 'Menyimpan...'
                        : initial
                          ? 'Simpan Perubahan'
                          : 'Daftarkan'}
                </button>
            </div>
        </form>
    );
}
