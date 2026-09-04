import { Link } from '@inertiajs/react';
import { useEffect, useState, type FormEvent } from 'react';
import { type Obat, type ObatPayload } from '@/api/obat';
import {
    getPemeriksaan,
    getPemeriksaans,
    type Pemeriksaan,
} from '@/api/pemeriksaan';

interface ObatFormProps {
    initial?: Obat | null;
    initialPemeriksaanId?: number;
    processing: boolean;
    errors?: Record<string, string | undefined> & {
        general?: string;
    };
    onSubmit: (payload: ObatPayload) => void;
}

const inputClass =
    'w-full h-[42px] px-[12px] rounded-[12px] bg-[#d9d9d9] text-[13px] text-gray-700 placeholder:text-[#999] outline-none focus:bg-[#d5d5d5] focus:ring-2 focus:ring-[#084e7a]/30 transition';

const labelClass = 'block text-[13px] text-[#333] mb-[4px]';

export default function ObatForm({
    initial,
    initialPemeriksaanId,
    processing,
    errors = {},
    onSubmit,
}: ObatFormProps) {
    const [pemeriksaans, setPemeriksaans] = useState<Pemeriksaan[]>([]);
    const [optionsLoaded, setOptionsLoaded] = useState(false);

    const [pemeriksaanId, setPemeriksaanId] = useState('');
    const [namaObat, setNamaObat] = useState('');
    const [dosis, setDosis] = useState('');
    const [jumlah, setJumlah] = useState('1');
    const [satuan, setSatuan] = useState('');
    const [harga, setHarga] = useState('');
    const [keterangan, setKeterangan] = useState('');
    const [selectedPemeriksaan, setSelectedPemeriksaan] =
        useState<Pemeriksaan | null>(null);

    useEffect(() => {
        const id = Number(pemeriksaanId);

        if (!id) {
            setSelectedPemeriksaan(null);

            return;
        }

        const match = pemeriksaans.find((item) => item.id === id);

        setSelectedPemeriksaan(match ?? null);

        let cancelled = false;

        getPemeriksaan(id)
            .then((response) => {
                if (!cancelled) {
                    setSelectedPemeriksaan(response.data?.pemeriksaan ?? null);
                }
            })
            .catch((error: any) => {
                console.error('Gagal memuat detail pemeriksaan', error);

                if (!cancelled && error.response?.status === 401) {
                    window.location.href = '/login';
                }
            });

        return () => {
            cancelled = true;
        };
    }, [pemeriksaanId, pemeriksaans]);

    useEffect(() => {
        getPemeriksaans(1, 100)
            .then((response) => {
                setPemeriksaans(response.data?.items ?? []);
            })
            .catch((error: any) => {
                console.error('Gagal memuat opsi pemeriksaan', error);

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

        setPemeriksaanId(
            initial?.pemeriksaan?.id
                ? String(initial.pemeriksaan.id)
                : initialPemeriksaanId
                  ? String(initialPemeriksaanId)
                  : '',
        );
        setNamaObat(initial?.nama_obat ?? '');
        setDosis(initial?.dosis ?? '');
        setJumlah(initial ? String(initial.jumlah) : '1');
        setSatuan(initial?.satuan ?? '');
        setHarga(initial ? String(initial.harga) : '');
        setKeterangan(initial?.keterangan ?? '');
    }, [initial, initialPemeriksaanId, optionsLoaded]);

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        onSubmit({
            pemeriksaan_id: Number(pemeriksaanId),
            nama_obat: namaObat.trim(),
            dosis: dosis.trim() || undefined,
            jumlah: jumlah ? Number(jumlah) : undefined,
            satuan: satuan.trim() || undefined,
            harga: harga ? Number(harga) : undefined,
            keterangan: keterangan.trim() || undefined,
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
                {/* PEMERIKSAAN */}
                <div className="sm:col-span-2">
                    <label htmlFor="pemeriksaan_id" className={labelClass}>
                        Pemeriksaan
                    </label>

                    <select
                        id="pemeriksaan_id"
                        value={pemeriksaanId}
                        onChange={(event) =>
                            setPemeriksaanId(event.target.value)
                        }
                        className={inputClass}
                    >
                        <option value="">Pilih pemeriksaan...</option>

                        {pemeriksaans.map((pemeriksaan) => (
                            <option key={pemeriksaan.id} value={pemeriksaan.id}>
                                {pemeriksaan.pasien?.name ?? 'Pasien'} — Antrian{' '}
                                {pemeriksaan.antrian?.queue_number ?? '-'} (
                                {pemeriksaan.poli?.name ?? '-'})
                            </option>
                        ))}
                    </select>

                    {errors.pemeriksaan_id && (
                        <p className="mt-1 text-[11px] text-red-500">
                            {errors.pemeriksaan_id}
                        </p>
                    )}
                </div>
            </div>

            {/* PANEL DETAIL PEMERIKSAAN */}
            {selectedPemeriksaan && (
                <div className="mt-4 mb-4 rounded-[12px] border border-[#07577f]/15 bg-[#07577f]/5 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                            <p className="text-[11px] tracking-wider text-gray-400 uppercase">
                                Detail Pemeriksaan
                            </p>

                            <p className="text-[14px] font-bold text-gray-800">
                                {selectedPemeriksaan.pasien?.name ?? '-'}
                                <span className="ml-2 text-[11px] font-medium text-gray-400">
                                    No. RM{' '}
                                    {selectedPemeriksaan.pasien
                                        ?.medical_record_number ?? '-'}
                                </span>
                            </p>
                        </div>

                        <div className="flex items-center gap-2">
                            {selectedPemeriksaan.antrian?.queue_number && (
                                <span className="flex h-9 w-11 items-center justify-center rounded-lg bg-[#07577f] text-[13px] font-bold text-white">
                                    {selectedPemeriksaan.antrian.queue_number}
                                </span>
                            )}

                            <span className="rounded-lg bg-[#07577f]/10 px-3 py-2 text-[12px] font-semibold text-[#07577f]">
                                {selectedPemeriksaan.poli?.name ?? '-'}
                            </span>
                        </div>
                    </div>

                    <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div className="rounded-[10px] bg-white p-3">
                            <p className="text-[11px] tracking-wider text-gray-400 uppercase">
                                Keluhan
                            </p>

                            <p className="mt-1 text-[13px] whitespace-pre-line text-gray-700">
                                {selectedPemeriksaan.complaint || '—'}
                            </p>
                        </div>

                        <div className="rounded-[10px] bg-white p-3">
                            <p className="text-[11px] tracking-wider text-gray-400 uppercase">
                                Diagnosis
                            </p>

                            <p className="mt-1 text-[13px] whitespace-pre-line text-gray-700">
                                {selectedPemeriksaan.diagnosis || '—'}
                            </p>
                        </div>

                        <div className="rounded-[10px] bg-white p-3">
                            <p className="text-[11px] tracking-wider text-gray-400 uppercase">
                                Tindakan / Terapi
                            </p>

                            <p className="mt-1 text-[13px] whitespace-pre-line text-gray-700">
                                {selectedPemeriksaan.treatment || '—'}
                            </p>
                        </div>

                        <div className="rounded-[10px] bg-white p-3">
                            <p className="text-[11px] tracking-wider text-gray-400 uppercase">
                                Catatan
                            </p>

                            <p className="mt-1 text-[13px] whitespace-pre-line text-gray-700">
                                {selectedPemeriksaan.notes || '—'}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* NAMA OBAT */}
                <div className="sm:col-span-2">
                    <label htmlFor="nama_obat" className={labelClass}>
                        Nama Obat
                    </label>

                    <input
                        id="nama_obat"
                        type="text"
                        value={namaObat}
                        onChange={(event) => setNamaObat(event.target.value)}
                        placeholder="Contoh: Paracetamol"
                        className={inputClass}
                    />

                    {errors.nama_obat && (
                        <p className="mt-1 text-[11px] text-red-500">
                            {errors.nama_obat}
                        </p>
                    )}
                </div>

                {/* DOSIS */}
                <div>
                    <label htmlFor="dosis" className={labelClass}>
                        Dosis{' '}
                        <span className="font-normal text-gray-400">
                            (opsional)
                        </span>
                    </label>

                    <input
                        id="dosis"
                        type="text"
                        value={dosis}
                        onChange={(event) => setDosis(event.target.value)}
                        placeholder="Contoh: 3x1"
                        className={inputClass}
                    />

                    {errors.dosis && (
                        <p className="mt-1 text-[11px] text-red-500">
                            {errors.dosis}
                        </p>
                    )}
                </div>

                {/* JUMLAH */}
                <div>
                    <label htmlFor="jumlah" className={labelClass}>
                        Jumlah{' '}
                        <span className="font-normal text-gray-400">
                            (opsional)
                        </span>
                    </label>

                    <input
                        id="jumlah"
                        type="number"
                        min="1"
                        value={jumlah}
                        onChange={(event) => setJumlah(event.target.value)}
                        className={inputClass}
                    />

                    {errors.jumlah && (
                        <p className="mt-1 text-[11px] text-red-500">
                            {errors.jumlah}
                        </p>
                    )}
                </div>

                {/* SATUAN */}
                <div>
                    <label htmlFor="satuan" className={labelClass}>
                        Satuan{' '}
                        <span className="font-normal text-gray-400">
                            (opsional)
                        </span>
                    </label>

                    <input
                        id="satuan"
                        type="text"
                        value={satuan}
                        onChange={(event) => setSatuan(event.target.value)}
                        placeholder="Contoh: strip, botol"
                        className={inputClass}
                    />

                    {errors.satuan && (
                        <p className="mt-1 text-[11px] text-red-500">
                            {errors.satuan}
                        </p>
                    )}
                </div>

                {/* HARGA */}
                <div>
                    <label htmlFor="harga" className={labelClass}>
                        Harga{' '}
                        <span className="font-normal text-gray-400">
                            (opsional)
                        </span>
                    </label>

                    <input
                        id="harga"
                        type="number"
                        min="0"
                        step="0.01"
                        value={harga}
                        onChange={(event) => setHarga(event.target.value)}
                        placeholder="0"
                        className={inputClass}
                    />

                    {errors.harga && (
                        <p className="mt-1 text-[11px] text-red-500">
                            {errors.harga}
                        </p>
                    )}
                </div>

                {/* KETERANGAN */}
                <div className="sm:col-span-2">
                    <label htmlFor="keterangan" className={labelClass}>
                        Keterangan{' '}
                        <span className="font-normal text-gray-400">
                            (opsional)
                        </span>
                    </label>

                    <textarea
                        id="keterangan"
                        value={keterangan}
                        onChange={(event) => setKeterangan(event.target.value)}
                        rows={3}
                        placeholder="Catatan pemakaian obat..."
                        className="w-full rounded-[12px] bg-[#d9d9d9] px-[12px] py-[10px] text-[13px] text-gray-700 transition outline-none placeholder:text-[#999] focus:bg-[#d5d5d5] focus:ring-2 focus:ring-[#084e7a]/30"
                    />

                    {errors.keterangan && (
                        <p className="mt-1 text-[11px] text-red-500">
                            {errors.keterangan}
                        </p>
                    )}
                </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
                <Link
                    href={initial ? `/obats/${initial.id}` : '/obats'}
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
                          : 'Simpan Obat'}
                </button>
            </div>
        </form>
    );
}
