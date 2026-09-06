import { Head, Link } from '@inertiajs/react';
import Navbar from '@/components/Navbar';
import type { Dokter } from '@/api/dokter';

const WEEK: { label: string; key: string }[] = [
    { label: 'Senin', key: 'monday' },
    { label: 'Selasa', key: 'tuesday' },
    { label: 'Rabu', key: 'wednesday' },
    { label: 'Kamis', key: 'thursday' },
    { label: 'Jumat', key: 'friday' },
    { label: 'Sabtu', key: 'saturday' },
];

const formatTime = (time: string): string => time.slice(0, 5);

const getInitials = (name: string): string =>
    name
        .replace(/^dr[a-z]*\.\s*/i, '')
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part.charAt(0).toUpperCase())
        .join('');

export default function Detail({ dokter }: { dokter: Dokter }) {
    const specialization = dokter.specialization
        ? dokter.specialization[0].toUpperCase() +
          dokter.specialization.slice(1)
        : 'Dokter';

    return (
        <>
            <Head title={`${dokter.name} - RS Merdeka`} />
            <Navbar />

            <main className="bg-slate-50">
                <section className="relative w-full overflow-hidden bg-[#075985]">
                    <div
                        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
                        style={{ backgroundImage: "url('/banner/bn1.png')" }}
                    />
                    <div className="absolute inset-0 z-[1] bg-gradient-to-r from-[#075985]/95 via-[#075985]/85 to-[#0284c7]/55" />
                    <div className="absolute inset-0 z-[1] bg-[radial-gradient(circle_at_75%_50%,rgba(56,189,248,0.25),transparent_40%)]" />

                    <div className="relative z-10 mx-auto flex w-full max-w-7xl items-center px-5 pt-[110px] pb-20 sm:px-8 sm:pt-[120px] sm:pb-24 md:px-10 md:pt-[130px] lg:px-14">
                        <div className="relative z-20 w-full max-w-[680px]">
                            <h1 className="text-[34px] leading-[0.98] font-extrabold tracking-tight text-white drop-shadow-sm sm:text-[42px] md:text-[50px] lg:text-[58px]">
                                Cari Dokter
                            </h1>
                            <p className="mt-3 max-w-[580px] text-sm leading-6 text-white/90 sm:mt-5 sm:text-base sm:leading-7 md:text-lg">
                                Temukan dokter dan jadwal praktik terbaik untuk
                                keluarga Anda.
                            </p>

                            <nav className="mt-7 inline-flex items-center gap-1.5 rounded-full bg-white/10 px-5 py-2.5 text-[13px] font-semibold backdrop-blur-sm">
                                <Link
                                    href="/"
                                    className="inline-flex items-center gap-1.5 text-white/90 transition hover:text-white"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-3.5 w-3.5"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M3 10.182V22a1 1 0 0 0 1 1h5v-7h6v7h5a1 1 0 0 0 1-1V10.182" />
                                        <path d="M1.462 10.182 11.73 2.41a1 1 0 0 1 1.54 0l10.268 7.772" />
                                    </svg>
                                    Beranda
                                </Link>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-3.5 w-3.5 text-white/50"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="m9 18 6-6-6-6" />
                                </svg>
                                <span className="text-white">Cari Dokter</span>
                            </nav>
                        </div>
                    </div>
                </section>

                <div className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 md:px-10 lg:px-14">
                    <div className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-xl shadow-sky-100/70">
                        <div className="h-2.5 bg-gradient-to-r from-[#075985] via-[#0284c7] to-[#38bdf8]" />

                        <div className="flex flex-col gap-8 p-6 sm:p-8 lg:flex-row lg:gap-10 lg:p-10">
                            <div className="shrink-0">
                                <div className="mx-auto aspect-[3/4] w-56 overflow-hidden rounded-2xl bg-gradient-to-br from-[#e0f2fe] via-[#bae6fd] to-[#7dd3fc] sm:w-64 lg:mx-0 lg:w-72">
                                    {dokter.image_url ? (
                                        <img
                                            src={dokter.image_url}
                                            alt={dokter.name}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center">
                                            <span className="text-6xl font-extrabold text-[#075985]/40">
                                                {getInitials(dokter.name) ||
                                                    '?'}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="min-w-0 flex-1">
                                <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                                    {dokter.name}
                                </h1>

                                <p className="mt-1.5 text-sm font-medium text-[#0284c7] sm:text-base">
                                    {specialization}
                                </p>

                                <div className="mt-6 flex items-center gap-2.5">
                                    <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#075985]/10 text-[#075985]">
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
                                            <path d="M8 2v4" />
                                            <path d="M16 2v4" />
                                            <rect
                                                width="18"
                                                height="18"
                                                x="3"
                                                y="4"
                                                rx="2"
                                            />
                                            <path d="M3 10h18" />
                                        </svg>
                                    </span>
                                    <p className="text-sm font-bold tracking-wide text-[#075985] uppercase">
                                        Jadwal Praktik
                                    </p>
                                </div>

                                <div className="mt-4 overflow-hidden rounded-2xl border border-slate-100">
                                    <table className="w-full text-center">
                                        <thead>
                                            <tr className="border-b border-slate-100 bg-[#f0f9ff]">
                                                {WEEK.map(({ label, key }) => (
                                                    <th
                                                        key={key}
                                                        className="px-3 py-2.5 text-[11px] font-bold tracking-wider text-[#075985] uppercase sm:text-xs"
                                                    >
                                                        {label}
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>

                                        <tbody>
                                            <tr>
                                                {WEEK.map(({ key }) => {
                                                    const daySchedules = (
                                                        dokter.schedules ?? []
                                                    ).filter(
                                                        (s) => s.day === key,
                                                    );

                                                    return (
                                                        <td
                                                            key={key}
                                                            className="px-3 py-4 align-top"
                                                        >
                                                            {daySchedules.length ===
                                                            0 ? (
                                                                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-red-50 text-xs font-bold text-red-500">
                                                                    ✕
                                                                </span>
                                                            ) : (
                                                                <div className="space-y-1.5">
                                                                    {daySchedules.map(
                                                                        (s) => (
                                                                            <span
                                                                                key={
                                                                                    s.id
                                                                                }
                                                                                className="block text-[12px] font-semibold text-[#075985] sm:text-[13px]"
                                                                            >
                                                                                {formatTime(
                                                                                    s.start_time,
                                                                                )}{' '}
                                                                                –{' '}
                                                                                {formatTime(
                                                                                    s.end_time,
                                                                                )}
                                                                                {s.poli ? (
                                                                                    <span className="block text-[11px] font-medium text-slate-400">
                                                                                        {
                                                                                            s.poli
                                                                                        }
                                                                                    </span>
                                                                                ) : null}
                                                                            </span>
                                                                        ),
                                                                    )}
                                                                </div>
                                                            )}
                                                        </td>
                                                    );
                                                })}
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}
