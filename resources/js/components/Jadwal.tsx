import { getKioskPolis, type KioskPoli } from '@/api/kiosk';
import { useEffect, useState } from 'react';

const OPENING_HOURS = [
    { day: 'Senin', hours: '08.00 – 21.00' },
    { day: 'Selasa', hours: '08.00 – 21.00' },
    { day: 'Rabu', hours: '08.00 – 21.00' },
    { day: 'Kamis', hours: '08.00 – 21.00' },
    { day: 'Jumat', hours: '08.00 – 21.00' },
    { day: 'Sabtu', hours: '08.00 – 17.00' },
    { day: 'Minggu', hours: '09.00 – 15.00' },
];

const SERVICE_HOURS = [
    { name: 'Poli Umum', hours: '08.00 – 21.00' },
    { name: 'Poli Gigi', hours: '08.00 – 17.00' },
    { name: 'Poli Mata', hours: '08.00 – 17.00' },
    { name: 'Poli Jantung', hours: '09.00 – 17.00' },
    { name: 'Poli Anak', hours: '08.00 – 17.00' },
    { name: 'IGD 24 Jam', hours: '24 Jam' },
];

const DAY_ORDER = [
    'Senin',
    'Selasa',
    'Rabu',
    'Kamis',
    'Jumat',
    'Sabtu',
    'Minggu',
];

function SectionTitle({ title }: { title: string }) {
    return (
        <h3 className="mb-5 flex items-center gap-2.5 text-xl font-bold text-[#075985] sm:text-2xl">
            <span className="h-1.5 w-1.5 rounded-full bg-[#0284c7]" />
            {title}
        </h3>
    );
}

function SelectArrow() {
    return (
        <span className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-[#075985]">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <path d="M7 10l5 5 5-5" />
            </svg>
        </span>
    );
}

const inputClass =
    'h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#0284c7] focus:ring-2 focus:ring-[#0284c7]/20';

export default function Jadwal() {
    const [polis, setPolis] = useState<KioskPoli[]>([]);
    const [poliId, setPoliId] = useState('');
    const [doctorId, setDoctorId] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');

    useEffect(() => {
        let active = true;

        const load = async () => {
            try {
                const response = await getKioskPolis();
                if (active) {
                    setPolis(response.data?.items ?? []);
                }
            } catch {
                if (active) {
                    setPolis([]);
                }
            }
        };

        void load();

        return () => {
            active = false;
        };
    }, []);

    const selectedPoli = polis.find((poli) => String(poli.id) === poliId);

    const availableDokters = selectedPoli?.dokters ?? [];

    const today = DAY_ORDER[new Date().getDay()];
    const isToday = (day: string) => day === today;

    const handlePoliChange = (value: string) => {
        setPoliId(value);
        setDoctorId('');
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        console.log({
            poliId,
            doctorId,
            name,
            phone,
        });
    };

    return (
        <section className="w-full bg-white px-5 py-16 sm:px-8 sm:py-20 lg:px-14">
            <div className="mx-auto max-w-7xl">
                <div className="mb-10 text-center sm:mb-12">
                    <p className="text-xs font-bold tracking-widest text-[#0284c7] uppercase">
                        Informasi Layanan
                    </p>
                    <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-[#075985] sm:text-3xl">
                        Jadwal &amp; Pendaftaran
                    </h2>
                    <p className="mt-2 text-sm text-slate-500 sm:text-base">
                        Atur kunjungan Anda dengan mudah melalui jadwal layanan
                        dan form pendaftaran berikut.
                    </p>
                </div>

                <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
                        <SectionTitle title="Opening Hours" />

                        <ul className="space-y-2">
                            {OPENING_HOURS.map((item) => (
                                <li
                                    key={item.day}
                                    className={`flex items-center justify-between gap-4 rounded-xl px-3 py-2 text-sm transition ${
                                        isToday(item.day)
                                            ? 'bg-[#0284c7]/10 font-semibold text-[#075985]'
                                            : 'text-slate-600'
                                    }`}
                                >
                                    <span className="flex items-center gap-2">
                                        {isToday(item.day) && (
                                            <span className="h-2 w-2 rounded-full bg-[#0284c7]" />
                                        )}
                                        <span className="font-medium">
                                            {item.day}
                                        </span>
                                    </span>
                                    <span>{item.hours}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
                        <SectionTitle title="Jadwal Poli" />

                        <ul className="space-y-2">
                            {SERVICE_HOURS.map((item) => (
                                <li
                                    key={item.name}
                                    className="flex items-center justify-between gap-4 rounded-xl px-3 py-2 text-sm transition hover:bg-slate-50"
                                >
                                    <span className="font-medium text-slate-600">
                                        {item.name}
                                    </span>
                                    <span className="rounded-full bg-[#075985]/10 px-3 py-1 text-xs font-bold whitespace-nowrap text-[#075985]">
                                        {item.hours}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
                        <SectionTitle title="Buat Janji Tamu" />

                        <form onSubmit={handleSubmit} className="space-y-3">
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                <div className="relative">
                                    <select
                                        value={poliId}
                                        onChange={(e) =>
                                            handlePoliChange(e.target.value)
                                        }
                                        className={`${inputClass} relative appearance-none pr-10`}
                                    >
                                        <option value="" disabled>
                                            Pilih Poli
                                        </option>
                                        {polis.map((poli) => (
                                            <option
                                                key={poli.id}
                                                value={poli.id}
                                            >
                                                {poli.name}
                                            </option>
                                        ))}
                                    </select>
                                    <SelectArrow />
                                </div>

                                <div className="relative">
                                    <select
                                        value={doctorId}
                                        onChange={(e) =>
                                            setDoctorId(e.target.value)
                                        }
                                        disabled={!poliId}
                                        className={`${inputClass} appearance-none pr-10 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400`}
                                    >
                                        <option value="" disabled>
                                            {poliId
                                                ? 'Pilih Dokter'
                                                : 'Pilih Poli dulu'}
                                        </option>
                                        {availableDokters.map((dokter) => (
                                            <option
                                                key={dokter.id}
                                                value={dokter.id}
                                            >
                                                {dokter.name}
                                            </option>
                                        ))}
                                    </select>
                                    <SelectArrow />
                                </div>

                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Nama Anda"
                                    className={inputClass}
                                />

                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder="Nomor HP"
                                    className={inputClass}
                                />
                            </div>

                            <button
                                type="submit"
                                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#075985] px-5 text-sm font-bold text-white shadow-md shadow-sky-200/60 transition hover:bg-[#064e73] hover:shadow-lg active:scale-[0.98]"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <rect
                                        x="3"
                                        y="4"
                                        width="18"
                                        height="18"
                                        rx="2"
                                    />
                                    <path d="M16 2v4M8 2v4M3 10h18" />
                                </svg>
                                Buat Janji
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}
