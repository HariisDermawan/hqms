import { Link } from '@inertiajs/react';
import { useEffect, useState, type FormEvent } from 'react';
import { getDokters, type Dokter } from '@/api/dokter';
import {
    type JadwalDokter,
    type JadwalDokterPayload,
} from '@/api/jadwalDokter';
import { getPolis, type Poli } from '@/api/poli';

interface JadwalDokterFormProps {
    initial?: JadwalDokter | null;
    processing: boolean;
    errors?: Record<string, string | undefined> & {
        general?: string;
    };
    onSubmit: (payload: JadwalDokterPayload) => void;
}

const DAYS: { value: string; label: string }[] = [
    { value: 'monday', label: 'Senin' },
    { value: 'tuesday', label: 'Selasa' },
    { value: 'wednesday', label: 'Rabu' },
    { value: 'thursday', label: 'Kamis' },
    { value: 'friday', label: 'Jumat' },
    { value: 'saturday', label: 'Sabtu' },
    { value: 'sunday', label: 'Minggu' },
];

const inputClass =
    'w-full h-[42px] px-[12px] rounded-[12px] bg-[#d9d9d9] text-[13px] text-gray-700 placeholder:text-[#999] outline-none focus:bg-[#d5d5d5] focus:ring-2 focus:ring-[#084e7a]/30 transition';

const labelClass = 'block text-[13px] text-[#333] mb-[4px]';

export default function JadwalDokterForm({
    initial,
    processing,
    errors = {},
    onSubmit,
}: JadwalDokterFormProps) {
    const [dokters, setDokters] = useState<Dokter[]>([]);
    const [polis, setPolis] = useState<Poli[]>([]);
    const [optionsLoaded, setOptionsLoaded] = useState(false);

    const [dokterId, setDokterId] = useState('');
    const [poliId, setPoliId] = useState('');
    const [day, setDay] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [isActive, setIsActive] = useState(initial?.is_active ?? true);

    useEffect(() => {
        Promise.all([getDokters(1, 100), getPolis(1, 100)])
            .then(([doktersResponse, polisResponse]) => {
                setDokters(doktersResponse.data?.items ?? []);
                setPolis(polisResponse.data?.items ?? []);
            })
            .catch((error: any) => {
                console.error('Gagal memuat opsi dokter/poli', error);

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

        setDokterId(initial?.dokter?.id ? String(initial.dokter.id) : '');
        setPoliId(initial?.poli?.id ? String(initial.poli.id) : '');
        setDay(initial?.day ?? '');
        setStartTime(initial?.start_time?.slice(0, 5) ?? '');
        setEndTime(initial?.end_time?.slice(0, 5) ?? '');
    }, [optionsLoaded, initial]);

    const timeConflict = startTime && endTime && endTime <= startTime;

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!timeConflict) {
            onSubmit({
                dokter_id: Number(dokterId),
                poli_id: Number(poliId),
                day,
                start_time: startTime,
                end_time: endTime,
                is_active: isActive,
            });
        }
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
                {/* DOKTER */}
                <div className="sm:col-span-2">
                    <label htmlFor="dokter_id" className={labelClass}>
                        Dokter
                    </label>

                    <select
                        id="dokter_id"
                        value={dokterId}
                        onChange={(event) => setDokterId(event.target.value)}
                        className={inputClass}
                    >
                        <option value="">Pilih dokter...</option>

                        {dokters.map((dokter) => (
                            <option key={dokter.id} value={dokter.id}>
                                {dokter.name} —{' '}
                                {dokter.specialization || 'Dokter'}
                            </option>
                        ))}
                    </select>

                    {errors.dokter_id && (
                        <p className="mt-1 text-[11px] text-red-500">
                            {errors.dokter_id}
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
                            </option>
                        ))}
                    </select>

                    {errors.poli_id && (
                        <p className="mt-1 text-[11px] text-red-500">
                            {errors.poli_id}
                        </p>
                    )}
                </div>

                {/* HARI */}
                <div>
                    <label htmlFor="day" className={labelClass}>
                        Hari
                    </label>

                    <select
                        id="day"
                        value={day}
                        onChange={(event) => setDay(event.target.value)}
                        className={inputClass}
                    >
                        <option value="">Pilih hari...</option>

                        {DAYS.map((item) => (
                            <option key={item.value} value={item.value}>
                                {item.label}
                            </option>
                        ))}
                    </select>

                    {errors.day && (
                        <p className="mt-1 text-[11px] text-red-500">
                            {errors.day}
                        </p>
                    )}
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {/* START TIME */}
                    <div className="sm:col-span-1">
                        <label htmlFor="start_time" className={labelClass}>
                            Jam Mulai
                        </label>

                        <input
                            id="start_time"
                            type="time"
                            value={startTime}
                            onChange={(event) =>
                                setStartTime(event.target.value)
                            }
                            className={inputClass}
                        />

                        {errors.start_time && (
                            <p className="mt-1 text-[11px] text-red-500">
                                {errors.start_time}
                            </p>
                        )}
                    </div>

                    {/* END TIME */}
                    <div className="sm:col-span-1">
                        <label htmlFor="end_time" className={labelClass}>
                            Jam Selesai
                        </label>

                        <input
                            id="end_time"
                            type="time"
                            value={endTime}
                            onChange={(event) => setEndTime(event.target.value)}
                            className={inputClass}
                        />

                        {timeConflict ? (
                            <p className="mt-1 text-[11px] text-red-500">
                                Jam selesai harus setelah jam mulai.
                            </p>
                        ) : (
                            errors.end_time && (
                                <p className="mt-1 text-[11px] text-red-500">
                                    {errors.end_time}
                                </p>
                            )
                        )}
                    </div>
                </div>

                {/* STATUS AKTIF */}
                <div className="sm:col-span-2">
                    <span className={labelClass}>Status</span>

                    <button
                        type="button"
                        onClick={() => setIsActive((active) => !active)}
                        className={`flex h-[42px] w-full items-center gap-3 rounded-[12px] border-2 px-3 text-[13px] font-semibold transition sm:w-[260px] ${
                            isActive
                                ? 'border-green-500/40 bg-green-50 text-green-600'
                                : 'border-[#d9d9d9] bg-[#d9d9d9] text-gray-500'
                        }`}
                    >
                        <span
                            className={`flex h-5 w-5 items-center justify-center rounded-full border-2 transition ${
                                isActive
                                    ? 'border-green-500 bg-green-500 text-white'
                                    : 'border-gray-300 bg-white'
                            }`}
                        >
                            {isActive && (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-3 w-3"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="3"
                                >
                                    <path d="M20 6 9 17l-5-5" />
                                </svg>
                            )}
                        </span>

                        {isActive ? 'Aktif' : 'Nonaktif'}
                    </button>

                    {errors.is_active && (
                        <p className="mt-1 text-[11px] text-red-500">
                            {errors.is_active}
                        </p>
                    )}
                </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
                <Link
                    href="/jadwal-dokters"
                    className="h-[43px] rounded-[12px] bg-[#d9d9d9] px-5 text-[13px] font-bold text-gray-600 transition hover:bg-[#c9c9c9]"
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
