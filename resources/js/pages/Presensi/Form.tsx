import { Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { getPerawats, type Perawat } from '@/api/perawat';
import type { Presensi, PresensiPayload, PresensiStatus } from '@/api/presensi';

interface PresensiFormProps {
    initial?: Presensi | null;
    processing: boolean;
    errors?: Record<string, string | undefined> & {
        general?: string;
    };
    onSubmit: (payload: PresensiPayload) => void;
}

const statusOptions: { value: PresensiStatus; label: string }[] = [
    { value: 'hadir', label: 'Hadir' },
    { value: 'ijin', label: 'Izin' },
    { value: 'sakit', label: 'Sakit' },
    { value: 'cuti', label: 'Cuti' },
    { value: 'alpa', label: 'Alpa' },
];

const time = (value: string | null | undefined): string =>
    value ? value.slice(0, 5) : '';

const inputClass =
    'w-full h-[42px] px-[12px] rounded-[12px] bg-[#d9d9d9] text-[13px] text-gray-700 placeholder:text-[#999] outline-none focus:bg-[#d5d5d5] focus:ring-2 focus:ring-[#084e7a]/30 transition';

const labelClass = 'block text-[13px] text-[#333] mb-[4px]';

export default function PresensiForm({
    initial,
    processing,
    errors = {},
    onSubmit,
}: PresensiFormProps) {
    const [perawatId, setPerawatId] = useState(
        initial?.perawat_id ?? undefined,
    );
    const [date, setDate] = useState(initial?.date ?? '');
    const [timeIn, setTimeIn] = useState(time(initial?.time_in));
    const [timeOut, setTimeOut] = useState(time(initial?.time_out));
    const [status, setStatus] = useState<PresensiStatus>(
        initial?.status ?? 'hadir',
    );
    const [note, setNote] = useState(initial?.note ?? '');

    const [perawats, setPerawats] = useState<Perawat[]>([]);
    const [loadingPerawats, setLoadingPerawats] = useState(true);

    useEffect(() => {
        getPerawats(1, 100)
            .then((response) => {
                setPerawats(response.data?.items ?? []);
            })
            .catch(() => {
                setPerawats([]);
            })
            .finally(() => {
                setLoadingPerawats(false);
            });
    }, []);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!perawatId) {
            return;
        }

        onSubmit({
            perawat_id: perawatId,
            date,
            time_in: timeIn || undefined,
            time_out: timeOut || undefined,
            status,
            note: note || undefined,
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
                {/* PERAWAT */}
                <div>
                    <label htmlFor="perawat_id" className={labelClass}>
                        Perawat
                    </label>

                    <select
                        id="perawat_id"
                        value={perawatId ?? ''}
                        onChange={(event) =>
                            setPerawatId(
                                Number(event.target.value) || undefined,
                            )
                        }
                        disabled={loadingPerawats}
                        className={inputClass}
                    >
                        <option value="">-- Pilih Perawat --</option>

                        {perawats.map((perawat) => (
                            <option key={perawat.id} value={perawat.id}>
                                {perawat.name} ({perawat.code})
                            </option>
                        ))}
                    </select>

                    {errors.perawat_id && (
                        <p className="mt-1 text-[11px] text-red-500">
                            {errors.perawat_id}
                        </p>
                    )}
                </div>

                {/* TANGGAL */}
                <div>
                    <label htmlFor="date" className={labelClass}>
                        Tanggal
                    </label>

                    <input
                        id="date"
                        type="date"
                        value={date}
                        onChange={(event) => setDate(event.target.value)}
                        className={inputClass}
                    />

                    {errors.date && (
                        <p className="mt-1 text-[11px] text-red-500">
                            {errors.date}
                        </p>
                    )}
                </div>

                {/* JAM MASUK */}
                <div>
                    <label htmlFor="time_in" className={labelClass}>
                        Jam Masuk (Check-in)
                    </label>

                    <input
                        id="time_in"
                        type="time"
                        value={timeIn}
                        onChange={(event) => setTimeIn(event.target.value)}
                        className={inputClass}
                    />

                    {errors.time_in && (
                        <p className="mt-1 text-[11px] text-red-500">
                            {errors.time_in}
                        </p>
                    )}
                </div>

                {/* JAM KELUAR */}
                <div>
                    <label htmlFor="time_out" className={labelClass}>
                        Jam Keluar (Check-out)
                    </label>

                    <input
                        id="time_out"
                        type="time"
                        value={timeOut}
                        onChange={(event) => setTimeOut(event.target.value)}
                        className={inputClass}
                    />

                    {errors.time_out && (
                        <p className="mt-1 text-[11px] text-red-500">
                            {errors.time_out}
                        </p>
                    )}
                </div>

                {/* STATUS */}
                <div>
                    <label htmlFor="status" className={labelClass}>
                        Status
                    </label>

                    <select
                        id="status"
                        value={status}
                        onChange={(event) =>
                            setStatus(event.target.value as PresensiStatus)
                        }
                        className={inputClass}
                    >
                        {statusOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>

                    {errors.status && (
                        <p className="mt-1 text-[11px] text-red-500">
                            {errors.status}
                        </p>
                    )}
                </div>

                {/* CATATAN */}
                <div className="sm:col-span-2">
                    <label htmlFor="note" className={labelClass}>
                        Catatan
                    </label>

                    <textarea
                        id="note"
                        value={note}
                        onChange={(event) => setNote(event.target.value)}
                        placeholder="Catatan (opsional)"
                        rows={3}
                        className="w-full rounded-[12px] bg-[#d9d9d9] px-[12px] py-[10px] text-[13px] text-gray-700 transition outline-none placeholder:text-[#999] focus:bg-[#d5d5d5] focus:ring-2 focus:ring-[#084e7a]/30"
                    />

                    {errors.note && (
                        <p className="mt-1 text-[11px] text-red-500">
                            {errors.note}
                        </p>
                    )}
                </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
                <Link
                    href="/presensis"
                    className="flex h-[43px] items-center rounded-[12px] bg-[#d9d9d9] px-5 text-[13px] font-bold text-gray-600 transition hover:bg-[#c9c9c9]"
                >
                    Batal
                </Link>

                <button
                    type="submit"
                    disabled={processing}
                    className="h-[43px] rounded-[12px] bg-[#084e7a] px-6 text-[13px] font-bold text-white transition hover:bg-[#063f62] hover:shadow-md active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {processing ? 'Menyimpan...' : 'Simpan'}
                </button>
            </div>
        </form>
    );
}
