import { Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { me } from '@/api/auth';
import { getDokters, type Dokter } from '@/api/dokter';
import { getJadwalDokters, type JadwalDokter } from '@/api/jadwalDokter';
import AppLayout from '@/Layouts/AppLayout';

interface User {
    id: number;
    name: string;
    email: string;
}

const DAYS: Record<string, string> = {
    sunday: 'Minggu',
    monday: 'Senin',
    tuesday: 'Selasa',
    wednesday: 'Rabu',
    thursday: 'Kamis',
    friday: 'Jumat',
    saturday: 'Sabtu',
};

const formatDay = (day: string): string => DAYS[day] ?? day;
const formatTime = (time: string): string => time.slice(0, 5);
const getInitials = (name: string): string =>
    name
        .replace(/^dr[a-z]*\.\s*/i, '')
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part.charAt(0).toUpperCase())
        .join('');

export default function Dashboard() {
    const [user, setUser] = useState<User | null>(null);
    const [doctors, setDoctors] = useState<Dokter[]>([]);
    const [jadwals, setJadwals] = useState<JadwalDokter[]>([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadDashboard();
    }, []);

    const loadDashboard = async () => {
        try {
            setLoading(true);
            setError('');

            const [meResponse, dokterResponse, jadwalResponse] =
                await Promise.all([me(), getDokters(), getJadwalDokters()]);

            setUser(meResponse.data?.user ?? null);
            setDoctors(
                (dokterResponse.data?.items ?? []).filter(
                    (dokter) => dokter.is_active,
                ),
            );
            setJadwals(
                (jadwalResponse.data?.items ?? []).filter(
                    (jadwal) => jadwal.is_active && jadwal.dokter,
                ),
            );
        } catch (error: any) {
            console.error('Faild to load dashboard', error);

            if (error.response?.status === 401) {
                window.location.href = '/login';
                return;
            }

            setError(
                error.response?.data?.message ||
                    'Gagal mengambil data dashboard .',
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <AppLayout>
            <section>
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h2 className="text-lg font-bold text-gray-800 sm:text-xl">
                            Service
                        </h2>

                        <p className="mt-1 text-xs text-gray-400 sm:text-sm">
                            Akses layanan kesehatan dengan cepat
                        </p>
                    </div>

                    <button
                        type="button"
                        className="text-xs font-semibold text-[#07577f]"
                    >
                        All →
                    </button>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
                    {/* PASIEN */}
                    <Link
                        href="/pasiens"
                        className="group flex h-[82px] items-center gap-3 rounded-xl bg-[#07577f] px-4 text-left text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:h-[90px] lg:h-[105px]"
                    >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/10">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.7"
                            >
                                <circle cx="12" cy="8" r="3.5" />
                                <path d="M5 20c.8-3.3 3.2-5 7-5s6.2 1.7 7 5" />
                            </svg>
                        </div>

                        <div>
                            <p className="text-sm font-semibold">Pasien</p>

                            <p className="mt-0.5 text-[10px] text-white/60">
                                Kelola pasien
                            </p>
                        </div>
                    </Link>

                    {/* POLI */}
                    <Link
                        href="/polis"
                        className="group flex h-[82px] items-center gap-3 rounded-xl bg-[#07577f] px-4 text-left text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:h-[90px] lg:h-[105px]"
                    >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/10">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.7"
                            >
                                <rect
                                    x="5"
                                    y="3"
                                    width="14"
                                    height="18"
                                    rx="2"
                                />
                                <path d="M9 7h6M9 11h6M9 15h4" />
                            </svg>
                        </div>

                        <div>
                            <p className="text-sm font-semibold">Poli</p>

                            <p className="mt-0.5 text-[10px] text-white/60">
                                Kelola poli
                            </p>
                        </div>
                    </Link>

                    {/* ANTREAN */}
                    <button
                        type="button"
                        className="group flex h-[82px] items-center gap-3 rounded-xl bg-[#07577f] px-4 text-left text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:h-[90px] lg:h-[105px]"
                    >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/10">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.7"
                            >
                                <circle cx="12" cy="12" r="8.5" />
                                <path d="M12 7v5l3 2" />
                            </svg>
                        </div>

                        <div>
                            <p className="text-sm font-semibold">Antrean</p>

                            <p className="mt-0.5 text-[10px] text-white/60">
                                Kelola antrean
                            </p>
                        </div>
                    </button>

                    {/* PEMERIKSAAN */}
                    <button
                        type="button"
                        className="group flex h-[82px] items-center gap-3 rounded-xl bg-[#07577f] px-4 text-left text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:h-[90px] lg:h-[105px]"
                    >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/10">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.7"
                            >
                                <rect
                                    x="4"
                                    y="4"
                                    width="16"
                                    height="16"
                                    rx="2"
                                />
                                <path d="M12 8v8M8 12h8" />
                            </svg>
                        </div>

                        <div>
                            <p className="text-sm font-semibold">Pemeriksaan</p>

                            <p className="mt-0.5 text-[10px] text-white/60">
                                Pemeriksaan pasien
                            </p>
                        </div>
                    </button>
                </div>
            </section>

            <section className="mt-8">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h2 className="text-lg font-bold text-gray-800 sm:text-xl">
                            Doctor
                        </h2>

                        <p className="mt-1 text-xs text-gray-400 sm:text-sm">
                            Daftar dokter yang tersedia
                        </p>
                    </div>

                    <button
                        type="button"
                        className="text-xs font-semibold text-[#07577f]"
                    >
                        Lihat semua →
                    </button>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
                    {doctors.length > 0 ? (
                        doctors.map((dokter) => (
                            <div
                                key={dokter.id}
                                className="overflow-hidden rounded-xl bg-white shadow-sm"
                            >
                                <div className="flex h-[145px] items-center justify-center bg-[#07577f]/10 sm:h-[165px] lg:h-[210px]">
                                    {dokter.image_url ? (
                                        <img
                                            src={dokter.image_url}
                                            alt={dokter.name}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <span className="text-4xl font-bold text-[#07577f] sm:text-5xl">
                                            {getInitials(dokter.name)}
                                        </span>
                                    )}
                                </div>

                                <div className="bg-[#07577f] px-3 py-3 text-white">
                                    <p className="text-xs font-semibold sm:text-sm">
                                        {dokter.name}
                                    </p>

                                    <p className="mt-0.5 text-[10px] text-white/60">
                                        {dokter.specialization}
                                    </p>

                                    <div className="mt-2 flex items-center gap-1.5">
                                        <span className="h-1.5 w-1.5 rounded-full bg-green-400" />

                                        <span className="text-[9px] text-white/70">
                                            Tersedia hari ini
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-2 rounded-xl bg-white px-4 py-8 text-center text-sm text-gray-400 shadow-sm sm:col-span-4">
                            Belum ada data dokter.
                        </div>
                    )}
                </div>
            </section>

            <section className="mt-8">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h2 className="text-lg font-bold text-gray-800 sm:text-xl">
                            Jadwal Doctor
                        </h2>

                        <p className="mt-1 text-xs text-gray-400 sm:text-sm">
                            Jadwal praktik dokter hari ini
                        </p>
                    </div>

                    <button
                        type="button"
                        className="text-xs font-semibold text-[#07577f]"
                    >
                        Lihat semua →
                    </button>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
                    {jadwals.length > 0 ? (
                        jadwals.map((jadwal) => (
                            <div
                                key={jadwal.id}
                                className="overflow-hidden rounded-xl bg-white shadow-sm"
                            >
                                <div className="flex h-[145px] items-center justify-center bg-[#07577f]/10 sm:h-[165px] lg:h-[210px]">
                                    {jadwal.dokter?.image_url ? (
                                        <img
                                            src={jadwal.dokter.image_url}
                                            alt={jadwal.dokter?.name ?? ''}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <span className="text-4xl font-bold text-[#07577f] sm:text-5xl">
                                            {getInitials(
                                                jadwal.dokter?.name ?? '',
                                            )}
                                        </span>
                                    )}
                                </div>

                                <div className="bg-[#07577f] px-3 py-3 text-white">
                                    <p className="text-xs font-semibold sm:text-sm">
                                        {jadwal.dokter?.name}
                                    </p>
                                    <p className="mt-0.5 text-[10px] text-white/60">
                                        {formatDay(jadwal.day)} ·{' '}
                                        {jadwal.poli?.name}
                                    </p>
                                    <p className="mt-1 text-[11px] font-medium">
                                        {formatTime(jadwal.start_time)} -{' '}
                                        {formatTime(jadwal.end_time)}
                                    </p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-2 rounded-xl bg-white px-4 py-8 text-center text-sm text-gray-400 shadow-sm sm:col-span-4">
                            Belum ada jadwal dokter.
                        </div>
                    )}
                </div>
            </section>

            <section className="mt-8">
                <div>
                    <h2 className="text-lg font-bold text-gray-800 sm:text-xl">
                        Informasi
                    </h2>

                    <p className="mt-1 text-xs text-gray-400 sm:text-sm">
                        Informasi klinik
                    </p>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                    {/* JAM OPERASIONAL */}
                    <div className="rounded-xl bg-white p-4 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#07577f]/10 text-[#07577f]">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.7"
                                >
                                    <circle cx="12" cy="12" r="8.5" />
                                    <path d="M12 7v5l3 2" />
                                </svg>
                            </div>

                            <div>
                                <p className="text-xs text-gray-400">
                                    Jam Operasional
                                </p>

                                <p className="mt-1 text-sm font-semibold text-gray-800">
                                    08:00 - 17:00
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* LAYANAN */}
                    <div className="rounded-xl bg-white p-4 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#07577f]/10 text-[#07577f]">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.7"
                                >
                                    <rect
                                        x="4"
                                        y="4"
                                        width="16"
                                        height="16"
                                        rx="2"
                                    />
                                    <path d="M12 8v8M8 12h8" />
                                </svg>
                            </div>

                            <div>
                                <p className="text-xs text-gray-400">Layanan</p>

                                <p className="mt-1 text-sm font-semibold text-gray-800">
                                    Layanan kesehatan
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* STATUS SISTEM */}
                    <div className="rounded-xl bg-white p-4 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50 text-green-500">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.7"
                                >
                                    <path d="M20 6 9 17l-5-5" />
                                </svg>
                            </div>

                            <div>
                                <p className="text-xs text-gray-400">
                                    Status Sistem
                                </p>

                                <div className="mt-1 flex items-center gap-1.5">
                                    <span className="h-1.5 w-1.5 rounded-full bg-green-500" />

                                    <p className="text-sm font-semibold text-green-500">
                                        Online
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </AppLayout>
    );
}
