import { Head, router, usePage } from '@inertiajs/react';
import { useEffect, useState, type FormEvent } from 'react';
import {
    storePembayaran,
    type DetailItem,
    type MetodePembayaran,
    type PembayaranPayload,
    type StatusPembayaran,
} from '@/api/pembayaran';
import { getPemeriksaans, type Pemeriksaan } from '@/api/pemeriksaan';
import AppLayout from '@/Layouts/AppLayout';

const inputClass =
    'w-full h-[42px] px-[12px] rounded-[12px] bg-[#d9d9d9] text-[13px] text-gray-700 placeholder:text-[#999] outline-none focus:bg-[#d5d5d5] focus:ring-2 focus:ring-[#084e7a]/30 transition';

const labelClass = 'block text-[13px] text-[#333] mb-[4px]';

const formatRupiah = (value: number): string =>
    new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(value);

const today = (): string => new Date().toISOString().slice(0, 10);

const metodeOptions: { value: MetodePembayaran; label: string }[] = [
    { value: 'cash', label: 'Tunai' },
    { value: 'transfer', label: 'Transfer' },
    { value: 'debit', label: 'Debit' },
    { value: 'credit', label: 'Kredit' },
    { value: 'qris', label: 'QRIS' },
];

const statusOptions: { value: StatusPembayaran; label: string }[] = [
    { value: 'unpaid', label: 'Belum Bayar' },
    { value: 'paid', label: 'Lunas' },
    { value: 'refunded', label: 'Refund' },
    { value: 'cancelled', label: 'Dibatalkan' },
];

interface DraftItem {
    description: string;
    quantity: string;
    unit_price: string;
}

export default function PembayaranCreate() {
    const { pemeriksaan_id: pemeriksaanId } = usePage<{
        pemeriksaan_id?: number;
    }>().props;

    const [pemeriksaans, setPemeriksaans] = useState<Pemeriksaan[]>([]);
    const [optionsLoaded, setOptionsLoaded] = useState(false);

    const [pemeriksaanIdSelected, setPemeriksaanIdSelected] = useState('');
    const [total, setTotal] = useState<string>('');
    const [metode, setMetode] = useState<MetodePembayaran>('cash');
    const [status, setStatus] = useState<StatusPembayaran>('paid');
    const [tanggal, setTanggal] = useState(today());
    const [keterangan, setKeterangan] = useState('');
    const [draftItems, setDraftItems] = useState<DraftItem[]>([]);
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

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
            .finally(() => setOptionsLoaded(true));
    }, []);

    useEffect(() => {
        if (!optionsLoaded) {
            return;
        }

        setPemeriksaanIdSelected(pemeriksaanId ? String(pemeriksaanId) : '');
    }, [pemeriksaanId, optionsLoaded]);

    const handleAddItem = () => {
        setDraftItems((prev) => [
            ...prev,
            { description: '', quantity: '1', unit_price: '' },
        ]);
    };

    const handleItemChange = (
        index: number,
        field: keyof DraftItem,
        value: string,
    ) => {
        setDraftItems((prev) =>
            prev.map((item, i) =>
                i === index ? { ...item, [field]: value } : item,
            ),
        );
    };

    const handleRemoveItem = (index: number) => {
        setDraftItems((prev) => prev.filter((_, i) => i !== index));
    };

    const computedTotal = draftItems.reduce((sum, item) => {
        const qty = Number(item.quantity) || 0;
        const price = Number(item.unit_price) || 0;

        return sum + qty * price;
    }, 0);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const detailItems: DetailItem[] = draftItems
            .filter((item) => item.description.trim() !== '')
            .map((item) => ({
                description: item.description.trim(),
                quantity: Number(item.quantity) || 0,
                unit_price: Number(item.unit_price) || 0,
            }));

        const payload: PembayaranPayload = {
            pemeriksaan_id: Number(pemeriksaanIdSelected),
            metode,
            status,
            tanggal,
            detail_items: detailItems.length > 0 ? detailItems : undefined,
            keterangan: keterangan.trim() || undefined,
        };

        if (total.trim() !== '') {
            payload.total = Number(total);
        }

        setProcessing(true);
        setErrors({});

        try {
            await storePembayaran(payload);

            router.visit('/pembayarans');
        } catch (error: any) {
            console.error('Gagal menyimpan pembayaran', error);

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
                    'Gagal menyimpan data pembayaran.',
            });
        } finally {
            setProcessing(false);
        }
    };

    return (
        <>
            <Head title="Buat Pembayaran" />

            <AppLayout wide>
                <div>
                    <h2 className="text-lg font-bold text-gray-800 sm:text-xl">
                        Buat Pembayaran
                    </h2>

                    <p className="mt-1 text-xs text-gray-400 sm:text-sm">
                        Catat tagihan pembayaran pasien
                    </p>
                </div>

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
                            <label
                                htmlFor="pemeriksaan_id"
                                className={labelClass}
                            >
                                Pemeriksaan
                            </label>

                            <select
                                id="pemeriksaan_id"
                                value={pemeriksaanIdSelected}
                                onChange={(event) =>
                                    setPemeriksaanIdSelected(event.target.value)
                                }
                                className={inputClass}
                            >
                                <option value="">Pilih pemeriksaan...</option>

                                {pemeriksaans.map((pemeriksaan) => (
                                    <option
                                        key={pemeriksaan.id}
                                        value={pemeriksaan.id}
                                    >
                                        {pemeriksaan.pasien?.name ?? 'Pasien'} —
                                        Antrian{' '}
                                        {pemeriksaan.antrian?.queue_number ??
                                            '-'}{' '}
                                        ({pemeriksaan.poli?.name ?? '-'})
                                    </option>
                                ))}
                            </select>

                            {errors.pemeriksaan_id && (
                                <p className="mt-1 text-[11px] text-red-500">
                                    {errors.pemeriksaan_id}
                                </p>
                            )}
                        </div>

                        {/* TANGGAL */}
                        <div>
                            <label htmlFor="tanggal" className={labelClass}>
                                Tanggal
                            </label>

                            <input
                                id="tanggal"
                                type="date"
                                value={tanggal}
                                onChange={(event) =>
                                    setTanggal(event.target.value)
                                }
                                className={inputClass}
                            />

                            {errors.tanggal && (
                                <p className="mt-1 text-[11px] text-red-500">
                                    {errors.tanggal}
                                </p>
                            )}
                        </div>

                        {/* METODE */}
                        <div>
                            <label htmlFor="metode" className={labelClass}>
                                Metode Pembayaran
                            </label>

                            <select
                                id="metode"
                                value={metode}
                                onChange={(event) =>
                                    setMetode(
                                        event.target.value as MetodePembayaran,
                                    )
                                }
                                className={inputClass}
                            >
                                {metodeOptions.map((option) => (
                                    <option
                                        key={option.value}
                                        value={option.value}
                                    >
                                        {option.label}
                                    </option>
                                ))}
                            </select>

                            {errors.metode && (
                                <p className="mt-1 text-[11px] text-red-500">
                                    {errors.metode}
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
                                    setStatus(
                                        event.target.value as StatusPembayaran,
                                    )
                                }
                                className={inputClass}
                            >
                                {statusOptions.map((option) => (
                                    <option
                                        key={option.value}
                                        value={option.value}
                                    >
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

                        {/* TOTAL */}
                        <div>
                            <label htmlFor="total" className={labelClass}>
                                Total{' '}
                                <span className="font-normal text-gray-400">
                                    (opsional)
                                </span>
                            </label>

                            <input
                                id="total"
                                type="number"
                                min="0"
                                step="0.01"
                                value={total}
                                onChange={(event) =>
                                    setTotal(event.target.value)
                                }
                                placeholder="Kosongkan untuk menghitung otomatis"
                                className={inputClass}
                            />

                            {draftItems.length > 0 && (
                                <p className="mt-1 text-[11px] text-gray-400">
                                    Total item:{' '}
                                    <span className="font-bold text-[#07577f]">
                                        {formatRupiah(computedTotal)}
                                    </span>
                                </p>
                            )}

                            {errors.total && (
                                <p className="mt-1 text-[11px] text-red-500">
                                    {errors.total}
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
                                onChange={(event) =>
                                    setKeterangan(event.target.value)
                                }
                                rows={2}
                                placeholder="Catatan tambahan..."
                                className="w-full rounded-[12px] bg-[#d9d9d9] px-[12px] py-[10px] text-[13px] text-gray-700 transition outline-none placeholder:text-[#999] focus:bg-[#d5d5d5] focus:ring-2 focus:ring-[#084e7a]/30"
                            />

                            {errors.keterangan && (
                                <p className="mt-1 text-[11px] text-red-500">
                                    {errors.keterangan}
                                </p>
                            )}
                        </div>

                        {/* ITEM TAGIHAN */}
                        <div className="sm:col-span-2">
                            <div className="flex items-center justify-between">
                                <label className={labelClass}>
                                    Item Tagihan
                                    <span className="font-normal text-gray-400">
                                        {' '}
                                        (opsional)
                                    </span>
                                </label>

                                <button
                                    type="button"
                                    onClick={handleAddItem}
                                    disabled={!pemeriksaanIdSelected}
                                    className="h-[38px] rounded-[10px] bg-[#07577f]/10 px-4 text-[12px] font-bold text-[#07577f] transition hover:bg-[#07577f]/20 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    + Tambah Item
                                </button>
                            </div>

                            {errors.detail_items && (
                                <p className="mb-2 text-[11px] text-red-500">
                                    {errors.detail_items}
                                </p>
                            )}

                            {draftItems.length === 0 ? (
                                <p className="rounded-[10px] bg-[#f7f9fb] p-4 text-[12px] text-gray-400">
                                    Belum ada item. Tambahkan rincian tagihan
                                    (mis. biaya jasa, obat, tindakan).
                                </p>
                            ) : (
                                <div className="space-y-2">
                                    {draftItems.map((item, index) => (
                                        <div
                                            key={index}
                                            className="grid grid-cols-1 gap-2 rounded-[10px] bg-[#f7f9fb] p-3 sm:grid-cols-[1fr_90px_120px_40px]"
                                        >
                                            <input
                                                type="text"
                                                value={item.description}
                                                onChange={(event) =>
                                                    handleItemChange(
                                                        index,
                                                        'description',
                                                        event.target.value,
                                                    )
                                                }
                                                placeholder="Uraian item"
                                                className="w-full rounded-[8px] bg-white px-3 py-2 text-[13px] text-gray-700 ring-1 ring-gray-200 outline-none focus:ring-[#084e7a]/30"
                                            />

                                            <input
                                                type="number"
                                                min="0"
                                                value={item.quantity}
                                                onChange={(event) =>
                                                    handleItemChange(
                                                        index,
                                                        'quantity',
                                                        event.target.value,
                                                    )
                                                }
                                                placeholder="Jml"
                                                className="w-full rounded-[8px] bg-white px-3 py-2 text-[13px] text-gray-700 ring-1 ring-gray-200 outline-none focus:ring-[#084e7a]/30"
                                            />

                                            <input
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                value={item.unit_price}
                                                onChange={(event) =>
                                                    handleItemChange(
                                                        index,
                                                        'unit_price',
                                                        event.target.value,
                                                    )
                                                }
                                                placeholder="Harga"
                                                className="w-full rounded-[8px] bg-white px-3 py-2 text-[13px] text-gray-700 ring-1 ring-gray-200 outline-none focus:ring-[#084e7a]/30"
                                            />

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleRemoveItem(index)
                                                }
                                                className="flex items-center justify-center rounded-[8px] bg-red-50 text-red-500 transition hover:bg-red-100"
                                                aria-label="Hapus item"
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-4 w-4"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                >
                                                    <path d="M18 6 6 18M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="mt-6 flex items-center justify-end gap-3">
                        <button
                            type="button"
                            onClick={() => router.visit('/pembayarans')}
                            className="h-[43px] rounded-[12px] bg-[#d9d9d9] px-5 text-[13px] font-bold text-gray-600 transition hover:bg-[#c9c9c9]"
                        >
                            Batal
                        </button>

                        <button
                            type="submit"
                            disabled={processing}
                            className="h-[43px] rounded-[12px] bg-[#084e7a] px-6 text-[13px] font-bold text-white transition hover:bg-[#063f62] hover:shadow-md active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {processing ? 'Menyimpan...' : 'Simpan Pembayaran'}
                        </button>
                    </div>
                </form>
            </AppLayout>
        </>
    );
}
