import { Link } from '@inertiajs/react';
import { useEffect, useState, type FormEvent } from 'react';
import { getAntrians, type Antrian } from '@/api/antrian';
import { getDokters, type Dokter } from '@/api/dokter';
import { type Pemeriksaan, type PemeriksaanPayload } from '@/api/pemeriksaan';

interface PemeriksaanFormProps {
    initial?: Pemeriksaan | null;
    initialAntrianId?: number;
    processing: boolean;
    errors?: Record<string, string | undefined> & {
        general?: string;
    };
    onSubmit: (payload: PemeriksaanPayload) => void;
}

const inputClass =
    'w-full h-[42px] px-[12px] rounded-[12px] bg-[#d9d9d9] text-[13px] text-gray-700 placeholder:text-[#999] outline-none focus:bg-[#d5d5d5] focus:ring-2 focus:ring-[#084e7a]/30 transition';

const labelClass = 'block text-[13px] text-[#333] mb-[4px]';

const nowLocal = (): string => {
    const now = new Date();

    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());

    return now.toISOString().slice(0, 16);
};

const toLocalInput = (value: string | null): string => {
    if (!value) {
        return '';
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return '';
    }

    const local = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);

    return local.toISOString().slice(0, 16);
};

export default function PemeriksaanForm({
    initial,
    initialAntrianId,
    processing,
    errors = {},
    onSubmit,
}: PemeriksaanFormProps) {
    const [antrians, setAntrians] = useState<Antrian[]>([]);
    const [dokters, setDokters] = useState<Dokter[]>([]);
    const [optionsLoaded, setOptionsLoaded] = useState(false);

    const [antrianId, setAntrianId] = useState('');
    const [dokterId, setDokterId] = useState('');
    const [examinedAt, setExaminedAt] = useState(nowLocal());
    const [complaint, setComplaint] = useState('');
    const [diagnosis, setDiagnosis] = useState('');
    const [treatment, setTreatment] = useState('');
    const [notes, setNotes] = useState('');

    useEffect(() => {
        Promise.all([getAntrians({ perPage: 100 }), getDokters(1, 100)])
            .then(([antriansResponse, doktersResponse]) => {
                setAntrians(antriansResponse.data?.items ?? []);
                setDokters(doktersResponse.data?.items ?? []);
            })
            .catch((error: any) => {
                console.error('Gagal memuat opsi antrean/dokter', error);

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

        setAntrianId(
            initial?.antrian?.id
                ? String(initial.antrian.id)
                : initialAntrianId
                  ? String(initialAntrianId)
                  : '',
        );
        setDokterId(initial?.dokter?.id ? String(initial.dokter.id) : '');
        setExaminedAt(
            initial?.examined_at
                ? toLocalInput(initial.examined_at)
                : nowLocal(),
        );
        setComplaint(initial?.complaint ?? '');
        setDiagnosis(initial?.diagnosis ?? '');
        setTreatment(initial?.treatment ?? '');
        setNotes(initial?.notes ?? '');
    }, [initial, initialAntrianId, optionsLoaded]);

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        onSubmit({
            antrian_id: Number(antrianId),
            dokter_id: Number(dokterId),
            examined_at: examinedAt,
            complaint: complaint.trim() || undefined,
            diagnosis: diagnosis.trim() || undefined,
            treatment: treatment.trim() || undefined,
            notes: notes.trim() || undefined,
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
                {/* ANTREAN */}
                <div className="sm:col-span-2">
                    <label htmlFor="antrian_id" className={labelClass}>
                        Antrean
                    </label>

                    <select
                        id="antrian_id"
                        value={antrianId}
                        onChange={(event) => setAntrianId(event.target.value)}
                        className={inputClass}
                    >
                        <option value="">Pilih antrean...</option>

                        {antrians.map((antrian) => (
                            <option key={antrian.id} value={antrian.id}>
                                {antrian.queue_number}
                                {antrian.pasien?.name
                                    ? ` — ${antrian.pasien.name}`
                                    : ''}
                            </option>
                        ))}
                    </select>

                    {errors.antrian_id && (
                        <p className="mt-1 text-[11px] text-red-500">
                            {errors.antrian_id}
                        </p>
                    )}
                </div>

                {/* DOKTER */}
                <div>
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
                                {dokter.name}
                                {dokter.specialization
                                    ? ` (${dokter.specialization})`
                                    : ''}
                            </option>
                        ))}
                    </select>

                    {errors.dokter_id && (
                        <p className="mt-1 text-[11px] text-red-500">
                            {errors.dokter_id}
                        </p>
                    )}
                </div>

                {/* WAKTU */}
                <div>
                    <label htmlFor="examined_at" className={labelClass}>
                        Waktu pemeriksaan
                    </label>

                    <input
                        id="examined_at"
                        type="datetime-local"
                        value={examinedAt}
                        onChange={(event) => setExaminedAt(event.target.value)}
                        className={inputClass}
                    />

                    {errors.examined_at && (
                        <p className="mt-1 text-[11px] text-red-500">
                            {errors.examined_at}
                        </p>
                    )}
                </div>

                {/* KELUHAN */}
                <div className="sm:col-span-2">
                    <label htmlFor="complaint" className={labelClass}>
                        Keluhan{' '}
                        <span className="font-normal text-gray-400">
                            (opsional)
                        </span>
                    </label>

                    <textarea
                        id="complaint"
                        value={complaint}
                        onChange={(event) => setComplaint(event.target.value)}
                        rows={3}
                        placeholder="Keluhan atau gejala yang dialami pasien..."
                        className="w-full rounded-[12px] bg-[#d9d9d9] px-[12px] py-[10px] text-[13px] text-gray-700 transition outline-none placeholder:text-[#999] focus:bg-[#d5d5d5] focus:ring-2 focus:ring-[#084e7a]/30"
                    />

                    {errors.complaint && (
                        <p className="mt-1 text-[11px] text-red-500">
                            {errors.complaint}
                        </p>
                    )}
                </div>

                {/* DIAGNOSIS */}
                <div className="sm:col-span-2">
                    <label htmlFor="diagnosis" className={labelClass}>
                        Diagnosis{' '}
                        <span className="font-normal text-gray-400">
                            (opsional)
                        </span>
                    </label>

                    <textarea
                        id="diagnosis"
                        value={diagnosis}
                        onChange={(event) => setDiagnosis(event.target.value)}
                        rows={3}
                        placeholder="Hasil diagnosis dokter..."
                        className="w-full rounded-[12px] bg-[#d9d9d9] px-[12px] py-[10px] text-[13px] text-gray-700 transition outline-none placeholder:text-[#999] focus:bg-[#d5d5d5] focus:ring-2 focus:ring-[#084e7a]/30"
                    />

                    {errors.diagnosis && (
                        <p className="mt-1 text-[11px] text-red-500">
                            {errors.diagnosis}
                        </p>
                    )}
                </div>

                {/* TINDAKAN */}
                <div className="sm:col-span-2">
                    <label htmlFor="treatment" className={labelClass}>
                        Tindakan / Terapi{' '}
                        <span className="font-normal text-gray-400">
                            (opsional)
                        </span>
                    </label>

                    <textarea
                        id="treatment"
                        value={treatment}
                        onChange={(event) => setTreatment(event.target.value)}
                        rows={3}
                        placeholder="Tindakan, resep, atau terapi yang diberikan..."
                        className="w-full rounded-[12px] bg-[#d9d9d9] px-[12px] py-[10px] text-[13px] text-gray-700 transition outline-none placeholder:text-[#999] focus:bg-[#d5d5d5] focus:ring-2 focus:ring-[#084e7a]/30"
                    />

                    {errors.treatment && (
                        <p className="mt-1 text-[11px] text-red-500">
                            {errors.treatment}
                        </p>
                    )}
                </div>

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
                        placeholder="Catatan tambahan..."
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
                    href={
                        initial
                            ? `/pemeriksaans/${initial.id}`
                            : '/pemeriksaans'
                    }
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
                          : 'Simpan Pemeriksaan'}
                </button>
            </div>
        </form>
    );
}
