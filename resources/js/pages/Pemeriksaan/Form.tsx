import { Link } from '@inertiajs/react';
import { useEffect, useState, type FormEvent } from 'react';
import { getPasiens, type Pasien } from '@/api/pasien';
import { getPolis, type Poli } from '@/api/poli';
import { type Pemeriksaan, type PemeriksaanPayload } from '@/api/pemeriksaan';

interface PemeriksaanFormProps {
    initial?: Pemeriksaan | null;
    initialPasienId?: number;
    initialPoliId?: number;
    processing: boolean;
    errors?: Record<string, string | undefined> & {
        general?: string;
    };
    onSubmit: (payload: PemeriksaanPayload) => void;
}

const inputClass =
    'w-full h-[42px] px-[12px] rounded-[12px] bg-[#d9d9d9] text-[13px] text-gray-700 placeholder:text-[#999] outline-none focus:bg-[#d5d5d5] focus:ring-2 focus:ring-[#084e7a]/30 transition';

const labelClass = 'block text-[13px] text-[#333] mb-[4px]';

const categories = [
    'Umum',
    'Gigi',
    'Anak',
    'Mata',
    'THT',
    'Kandungan',
    'Bedah',
    'Penyakit Dalam',
];

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
    initialPasienId,
    initialPoliId,
    processing,
    errors = {},
    onSubmit,
}: PemeriksaanFormProps) {
    const [pasiens, setPasiens] = useState<Pasien[]>([]);
    const [polis, setPolis] = useState<Poli[]>([]);
    const [optionsLoaded, setOptionsLoaded] = useState(false);

    const [pasienId, setPasienId] = useState('');
    const [poliId, setPoliId] = useState('');
    const [dokterId, setDokterId] = useState('');
    const [category, setCategory] = useState('');
    const [examinedAt, setExaminedAt] = useState(nowLocal());
    const [complaint, setComplaint] = useState('');
    const [diagnosis, setDiagnosis] = useState('');
    const [treatment, setTreatment] = useState('');
    const [notes, setNotes] = useState('');

    useEffect(() => {
        Promise.all([getPasiens(1, 100), getPolis(1, 100)])
            .then(([pasienResponse, poliResponse]) => {
                setPasiens(pasienResponse.data?.items ?? []);
                setPolis(poliResponse.data?.items ?? []);
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

        setPasienId(
            initial?.pasien?.id
                ? String(initial.pasien.id)
                : initialPasienId
                  ? String(initialPasienId)
                  : '',
        );
        setPoliId(
            initial?.poli?.id
                ? String(initial.poli.id)
                : initialPoliId
                  ? String(initialPoliId)
                  : '',
        );
        setDokterId(initial?.dokter?.id ? String(initial.dokter.id) : '');
        setCategory(initial?.category ?? '');
        setExaminedAt(
            initial?.examined_at
                ? toLocalInput(initial.examined_at)
                : nowLocal(),
        );
        setComplaint(initial?.complaint ?? '');
        setDiagnosis(initial?.diagnosis ?? '');
        setTreatment(initial?.treatment ?? '');
        setNotes(initial?.notes ?? '');
    }, [initial, initialPasienId, initialPoliId, optionsLoaded]);

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        onSubmit({
            pasien_id: Number(pasienId),
            poli_id: Number(poliId),
            dokter_id: dokterId ? Number(dokterId) : undefined,
            category: category.trim(),
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
                <div>
                    <label htmlFor="poli_id" className={labelClass}>
                        Poli
                    </label>

                    <select
                        id="poli_id"
                        value={poliId}
                        onChange={(event) => {
                            setPoliId(event.target.value);
                            setDokterId('');
                        }}
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

                {/* DOKTER */}
                <div>
                    <label htmlFor="dokter_id" className={labelClass}>
                        Dokter{' '}
                        <span className="font-normal text-gray-400">
                            (opsional)
                        </span>
                    </label>

                    <select
                        id="dokter_id"
                        value={dokterId}
                        onChange={(event) => setDokterId(event.target.value)}
                        className={inputClass}
                        disabled={!poliId}
                    >
                        <option value="">
                            {poliId ? 'Pilih dokter...' : 'Pilih poli dahulu'}
                        </option>

                        {polis
                            .find((poli) => String(poli.id) === poliId)
                            ?.dokters?.map((dokter) => (
                                <option key={dokter.id} value={dokter.id}>
                                    {dokter.name}
                                </option>
                            ))}
                    </select>

                    {errors.dokter_id && (
                        <p className="mt-1 text-[11px] text-red-500">
                            {errors.dokter_id}
                        </p>
                    )}
                </div>

                {/* KATEGORI */}
                <div>
                    <label htmlFor="category" className={labelClass}>
                        Kategori
                    </label>

                    <select
                        id="category"
                        value={category}
                        onChange={(event) => setCategory(event.target.value)}
                        className={inputClass}
                    >
                        <option value="">Pilih kategori...</option>

                        {categories.map((item) => (
                            <option key={item} value={item}>
                                {item}
                            </option>
                        ))}
                    </select>

                    {errors.category && (
                        <p className="mt-1 text-[11px] text-red-500">
                            {errors.category}
                        </p>
                    )}
                </div>

                {/* WAKTU */}
                <div className="sm:col-span-2">
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
