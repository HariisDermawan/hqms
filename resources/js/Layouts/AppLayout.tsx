import { Link, usePage } from '@inertiajs/react';
import { useState, type ReactNode } from 'react';
import { logout } from '@/api/auth';
import { usePermissions } from '@/lib/permissions';

interface AppLayoutProps {
    children: ReactNode;
    wide?: boolean;
}

const staticNav =
    'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[13px] font-medium text-white/60 transition hover:bg-white/10 hover:text-white';

const linkNav = (active: boolean): string =>
    active
        ? 'flex w-full items-center gap-3 rounded-lg bg-white/15 px-3 py-2.5 text-left text-[13px] font-medium text-white'
        : staticNav;

const navBottom = (active: boolean): string =>
    active
        ? 'flex h-full flex-1 flex-col items-center justify-center gap-1 px-1 text-white'
        : 'flex h-full flex-1 flex-col items-center justify-center gap-1 px-1 text-white/55';

export default function AppLayout({ children, wide = false }: AppLayoutProps) {
    const { url } = usePage();
    const { canAccess } = usePermissions();
    const [loggingOut, setLoggingOut] = useState(false);

    const isActive = (href: string): boolean =>
        href === '/dashboard' ? url === href : url.startsWith(href);

    const handleLogout = async () => {
        try {
            setLoggingOut(true);

            await logout();

            window.location.href = '/login';
        } catch (error) {
            console.error('Logout Failed', error);

            window.location.href = '/login';
        } finally {
            setLoggingOut(false);
        }
    };

    return (
        <div className="min-h-screen w-full bg-[#f7f9fb]">
            <aside className="fixed top-0 left-0 z-50 hidden h-screen w-[250px] bg-[#07577f] text-white lg:flex lg:flex-col">
                <div className="flex h-[86px] shrink-0 items-center border-b border-white/10 px-7">
                    <div>
                        <h1 className="text-[21px] font-bold tracking-tight">
                            Rs Merdeka
                        </h1>

                        <p className="mt-0.5 text-[11px] font-medium tracking-wide text-white/50">
                            Management System
                        </p>
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto px-4 py-5">
                    <div className="mb-6">
                        <p className="mb-2 px-3 text-[10px] font-semibold tracking-[0.16em] text-white/40 uppercase">
                            Main
                        </p>
                        <div className="space-y-1">
                            {canAccess('/dashboard') && (
                                <Link
                                    href="/dashboard"
                                    className={linkNav(isActive('/dashboard'))}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-[18px] w-[18px]"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                    >
                                        <rect
                                            x="3"
                                            y="3"
                                            width="7"
                                            height="7"
                                            rx="1"
                                        />
                                        <rect
                                            x="14"
                                            y="3"
                                            width="7"
                                            height="7"
                                            rx="1"
                                        />
                                        <rect
                                            x="3"
                                            y="14"
                                            width="7"
                                            height="7"
                                            rx="1"
                                        />
                                        <rect
                                            x="14"
                                            y="14"
                                            width="7"
                                            height="7"
                                            rx="1"
                                        />
                                    </svg>

                                    <span>Dashboard</span>
                                </Link>
                            )}

                            {/* Monitoring */}
                            {canAccess('/monitorings') && (
                                <Link
                                    href="/monitorings"
                                    className={linkNav(
                                        isActive('/monitorings'),
                                    )}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-[18px] w-[18px]"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                    >
                                        <path d="M3 12h4l2.2-6 4.2 12 2.2-6H21" />
                                    </svg>

                                    <span>Monitoring</span>
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* MASTER DATA */}
                    <div className="mb-6">
                        <p className="mb-2 px-3 text-[10px] font-semibold tracking-[0.16em] text-white/40 uppercase">
                            Master Data
                        </p>

                        <div className="space-y-1">
                            {/* Pasien */}
                            {canAccess('/pasiens') && (
                                <Link
                                    href="/pasiens"
                                    className={linkNav(isActive('/pasiens'))}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-[18px] w-[18px]"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                    >
                                        <circle cx="12" cy="8" r="3.5" />
                                        <path d="M5 20c.8-3.3 3.2-5 7-5s6.2 1.7 7 5" />
                                    </svg>

                                    <span>Pasien</span>
                                </Link>
                            )}

                            {/* Poli */}
                            {canAccess('/polis') && (
                                <Link
                                    href="/polis"
                                    className={linkNav(isActive('/polis'))}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-[18px] w-[18px]"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
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

                                    <span>Poli</span>
                                </Link>
                            )}

                            {/* Dokter */}
                            {canAccess('/dokters') && (
                                <Link
                                    href="/dokters"
                                    className={linkNav(isActive('/dokters'))}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-[18px] w-[18px]"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                    >
                                        <circle cx="12" cy="7" r="3" />
                                        <path d="M6 20c.7-3.2 2.7-5 6-5s5.3 1.8 6 5" />
                                        <path d="M18 4v4M16 6h4" />
                                    </svg>

                                    <span>Dokter</span>
                                </Link>
                            )}

                            {/* Jadwal Dokter */}
                            {canAccess('/jadwal-dokters') && (
                                <Link
                                    href="/jadwal-dokters"
                                    className={linkNav(
                                        isActive('/jadwal-dokters'),
                                    )}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-[18px] w-[18px]"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                    >
                                        <rect
                                            x="3"
                                            y="5"
                                            width="18"
                                            height="16"
                                            rx="2"
                                        />
                                        <path d="M8 3v4M16 3v4M3 10h18M9 14h.01M13 14h.01M17 14h.01M9 18h.01M13 18h.01" />
                                    </svg>

                                    <span>Jadwal Dokter</span>
                                </Link>
                            )}

                            {/* Perawat */}
                            {canAccess('/perawats') && (
                                <Link
                                    href="/perawats"
                                    className={linkNav(isActive('/perawats'))}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-[18px] w-[18px]"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                    >
                                        <circle cx="9" cy="8" r="3" />
                                        <path d="M3 20c.7-3.2 2.7-5 6-5s5.3 1.8 6 5" />
                                        <circle cx="17" cy="9" r="2.5" />
                                    </svg>

                                    <span>Perawat</span>
                                </Link>
                            )}

                            {/* Presensi */}
                            {canAccess('/presensis') && (
                                <Link
                                    href="/presensis"
                                    className={linkNav(isActive('/presensis'))}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-[18px] w-[18px]"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                    >
                                        <rect
                                            x="3"
                                            y="4"
                                            width="18"
                                            height="18"
                                            rx="2"
                                        />
                                        <path d="M16 2v4M8 2v4M3 10h18" />
                                        <path d="m9 16 2 2 4-4" />
                                    </svg>

                                    <span>Presensi</span>
                                </Link>
                            )}

                            {/* Obat */}
                            {canAccess('/obats') && (
                                <Link
                                    href="/obats"
                                    className={linkNav(isActive('/obats'))}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-[18px] w-[18px]"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                    >
                                        <rect
                                            x="4"
                                            y="6"
                                            width="16"
                                            height="12"
                                            rx="6"
                                            transform="rotate(-45 12 12)"
                                        />
                                        <path d="m8.5 8.5 7 7" />
                                    </svg>

                                    <span>Obat</span>
                                </Link>
                            )}

                            {/* Ruangan */}
                            {canAccess('/ruangans') && (
                                <Link
                                    href="/ruangans"
                                    className={linkNav(isActive('/ruangans'))}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-[18px] w-[18px]"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                    >
                                        <path d="M4 21V4a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v17" />
                                        <path d="M8 7h2M14 7h2M8 11h2M14 11h2M8 15h2M14 15h2" />
                                        <path d="M10 21v-3h4v3" />
                                    </svg>

                                    <span>Ruangan</span>
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* PELAYANAN */}
                    <div className="mb-6">
                        <p className="mb-2 px-3 text-[10px] font-semibold tracking-[0.16em] text-white/40 uppercase">
                            Pelayanan
                        </p>

                        <div className="space-y-1">
                            {/* Pendaftaran */}
                            {canAccess('/pendaftarans') && (
                                <Link
                                    href="/pendaftarans"
                                    className={linkNav(
                                        isActive('/pendaftarans'),
                                    )}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-[18px] w-[18px]"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                    >
                                        <rect
                                            x="4"
                                            y="3"
                                            width="16"
                                            height="18"
                                            rx="2"
                                        />
                                        <path d="M8 7h8M8 11h8M8 15h5" />
                                    </svg>

                                    <span>Pendaftaran</span>
                                </Link>
                            )}

                            {/* Antrean */}
                            {canAccess('/antrians') && (
                                <Link
                                    href="/antrians"
                                    className={linkNav(isActive('/antrians'))}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-[18px] w-[18px]"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                    >
                                        <circle cx="12" cy="12" r="8.5" />
                                        <path d="M12 7v5l3 2" />
                                    </svg>

                                    <span>Antrean</span>
                                </Link>
                            )}

                            {/* Pemeriksaan */}
                            {canAccess('/pemeriksaans') && (
                                <Link
                                    href="/pemeriksaans"
                                    className={linkNav(
                                        isActive('/pemeriksaans'),
                                    )}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-[18px] w-[18px]"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
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

                                    <span>Pemeriksaan</span>
                                </Link>
                            )}

                            {/* Pembayaran */}
                            {canAccess('/pembayarans') && (
                                <Link
                                    href="/pembayarans"
                                    className={linkNav(
                                        isActive('/pembayarans'),
                                    )}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-[18px] w-[18px]"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                    >
                                        <rect
                                            x="3"
                                            y="6"
                                            width="18"
                                            height="13"
                                            rx="2"
                                        />
                                        <path d="M3 10h18M16 15h2" />
                                    </svg>

                                    <span>Pembayaran</span>
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* LAPORAN */}
                    <div className="mb-6">
                        <p className="mb-2 px-3 text-[10px] font-semibold tracking-[0.16em] text-white/40 uppercase">
                            Laporan
                        </p>

                        <div className="space-y-1">
                            {/* Laporan Pasien */}
                            <button type="button" className={staticNav}>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-[18px] w-[18px]"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                >
                                    <rect
                                        x="5"
                                        y="3"
                                        width="14"
                                        height="18"
                                        rx="2"
                                    />
                                    <path d="M9 8h6M9 12h6M9 16h4" />
                                </svg>

                                <span>Laporan Pasien</span>
                            </button>

                            {/* Laporan Kunjungan */}
                            <button type="button" className={staticNav}>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-[18px] w-[18px]"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                >
                                    <rect
                                        x="4"
                                        y="5"
                                        width="16"
                                        height="15"
                                        rx="2"
                                    />
                                    <path d="M8 3v4M16 3v4M4 9h16" />
                                </svg>

                                <span>Laporan Kunjungan</span>
                            </button>

                            {/* Laporan Antrean */}
                            <button type="button" className={staticNav}>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-[18px] w-[18px]"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                >
                                    <circle cx="12" cy="12" r="8.5" />
                                    <path d="M12 7v5l3 2" />
                                </svg>

                                <span>Laporan Antrean</span>
                            </button>

                            {/* Laporan Pendapatan */}
                            <button type="button" className={staticNav}>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-[18px] w-[18px]"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                >
                                    <path d="M4 19V5M4 19h17" />
                                    <path d="m7 15 4-4 3 2 5-6" />
                                </svg>

                                <span>Laporan Pendapatan</span>
                            </button>
                        </div>
                    </div>

                    {/* SISTEM */}
                    <div className="mb-6">
                        <p className="mb-2 px-3 text-[10px] font-semibold tracking-[0.16em] text-white/40 uppercase">
                            Sistem
                        </p>

                        <div className="space-y-1">
                            {/* Profile */}
                            <Link
                                href="/profile"
                                className={linkNav(isActive('/profile'))}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-[18px] w-[18px]"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                >
                                    <circle cx="12" cy="8" r="3.5" />
                                    <path d="M5 20c.8-3.3 3.2-5 7-5s6.2 1.7 7 5" />
                                </svg>

                                <span>Profile</span>
                            </Link>

                            {/* Message */}
                            <Link
                                href="/messages"
                                className={linkNav(isActive('/messages'))}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-[18px] w-[18px]"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                >
                                    <path d="M21 12a8 8 0 0 1-8 8H4l2-3a8 8 0 1 1 15-5Z" />
                                    <path d="M8 9h8M8 13h5" />
                                </svg>

                                <span>Message</span>
                            </Link>

                            {/* FAQ */}
                            <Link
                                href="/faqs"
                                className={linkNav(isActive('/faqs'))}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-[18px] w-[18px]"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                >
                                    <circle cx="12" cy="12" r="8.5" />
                                    <path d="M9.5 9.2a2.6 2.6 0 1 1 3.6 2.4c-.8.4-1.1 1-1.1 1.9" />
                                    <path d="M12 17h.01" />
                                </svg>

                                <span>FAQ</span>
                            </Link>

                            {/* Testimonial */}
                            <Link
                                href="/testimonials"
                                className={linkNav(isActive('/testimonials'))}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-[18px] w-[18px]"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                >
                                    <path d="M3 21h18" />
                                    <path d="M5 21V8l7-5 7 5v13" />
                                    <path d="M10 21v-4h4v4" />
                                </svg>

                                <span>Testimonial</span>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* SYSTEM */}
                <div className="shrink-0 border-t border-white/10 px-4 py-4">
                    <p className="mb-2 px-3 text-[10px] font-semibold tracking-[0.16em] text-white/40 uppercase">
                        System
                    </p>

                    <div className="space-y-1">
                        {/* Logout */}
                        <button
                            type="button"
                            onClick={handleLogout}
                            disabled={loggingOut}
                            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[13px] font-medium text-white/60 transition hover:bg-red-500/15 hover:text-red-200 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-[18px] w-[18px]"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                            >
                                <path d="M10 17l5-5-5-5" />
                                <path d="M15 12H3" />
                                <path d="M21 19V5a2 2 0 0 0-2-2h-6" />
                            </svg>

                            <span>
                                {loggingOut ? 'Logging out...' : 'Logout'}
                            </span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* MOBILE HEADER */}
            <header className="fixed top-0 right-0 left-0 z-40 overflow-hidden rounded-b-[22px] bg-[#07577f] px-5 py-6 text-white shadow-md sm:px-8 lg:hidden">
                <div className="pointer-events-none absolute -top-24 -right-20 h-72 w-72 rounded-full bg-white/5" />

                <div className="relative z-10 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="h-12 w-12 overflow-hidden rounded-full border border-white/20 bg-white/10">
                            <img
                                src="/assets/me.jpeg"
                                alt="Profile"
                                className="h-full w-full object-cover"
                            />
                        </div>

                        <div>
                            <p className="text-xs text-white/65">
                                Hallo, Welcome
                            </p>

                            <h1 className="mt-0.5 text-base font-semibold">
                                Haris Darmawan
                            </h1>
                        </div>
                    </div>

                    <button
                        type="button"
                        className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white/10"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                        >
                            <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
                            <path d="M10 21h4" />
                        </svg>

                        <span className="absolute top-2 right-2.5 h-2 w-2 rounded-full bg-red-400" />
                    </button>
                </div>

                {/* SEARCH */}
                <div className="relative z-10 mt-5 flex h-12 items-center rounded-full bg-white px-4 text-gray-400">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="mr-3 h-5 w-5 shrink-0"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                    >
                        <circle cx="11" cy="11" r="7" />
                        <path d="m20 20-4-4" />
                    </svg>

                    <input
                        type="text"
                        placeholder="Cari pasien, dokter, poli..."
                        className="w-full bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400"
                    />
                </div>
            </header>

            {/* DESKTOP HEADER */}
            <header className="fixed top-0 right-0 left-[250px] z-40 hidden border-b border-gray-100 bg-white lg:block">
                <div className="mx-auto max-w-[1440px] px-8 xl:px-12">
                    <div className="flex h-[86px] items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="h-12 w-12 overflow-hidden rounded-full border border-gray-100 bg-gray-100">
                                <img
                                    src="/assets/me.jpeg"
                                    alt="Profile"
                                    className="h-full w-full object-cover"
                                />
                            </div>

                            <div>
                                <p className="text-xs text-gray-400">
                                    Hallo, Welcome
                                </p>

                                <h1 className="mt-0.5 text-base font-semibold text-gray-800">
                                    Haris Darmawan
                                </h1>
                            </div>
                        </div>

                        <div className="flex items-center gap-5">
                            {/* SEARCH */}
                            <div className="flex h-10 w-[320px] items-center rounded-full border border-gray-200 bg-[#f7f9fb] px-4">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="mr-3 h-[17px] w-[17px] text-gray-400"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                >
                                    <circle cx="11" cy="11" r="7" />
                                    <path d="m20 20-4-4" />
                                </svg>

                                <input
                                    type="text"
                                    placeholder="Cari pasien, dokter, poli..."
                                    className="w-full bg-transparent text-xs text-gray-700 outline-none placeholder:text-gray-400"
                                />
                            </div>

                            {/* NOTIFICATION */}
                            <button
                                type="button"
                                className="relative flex h-10 w-10 items-center justify-center rounded-full bg-[#f7f9fb] text-gray-500"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-[19px] w-[19px]"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                >
                                    <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
                                    <path d="M10 21h4" />
                                </svg>

                                <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500" />
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="min-h-screen lg:ml-[250px]">
                <main
                    className={
                        'mx-auto px-5 pt-[205px] pb-10 sm:px-8 sm:pt-[220px] lg:px-8 lg:pt-[110px] xl:px-12 ' +
                        (wide ? 'max-w-[1600px]' : 'max-w-[1200px]')
                    }
                >
                    {children}
                </main>
            </div>

            {/* BOTTOM MOBILE NAV */}
            <nav className="fixed right-0 bottom-0 left-0 z-50 border-t border-white/10 bg-[#07577f] shadow-[0_-5px_25px_rgba(0,0,0,0.12)] lg:hidden">
                <div className="mx-auto flex h-[70px] w-full max-w-[900px] items-center px-1 sm:h-[76px] sm:px-3">
                    <div className="flex w-full items-center">
                        {/* DASHBOARD */}
                        <Link
                            href="/dashboard"
                            className={navBottom(isActive('/dashboard'))}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                            >
                                <rect x="3" y="3" width="7" height="7" rx="1" />
                                <rect
                                    x="14"
                                    y="3"
                                    width="7"
                                    height="7"
                                    rx="1"
                                />
                                <rect
                                    x="3"
                                    y="14"
                                    width="7"
                                    height="7"
                                    rx="1"
                                />
                                <rect
                                    x="14"
                                    y="14"
                                    width="7"
                                    height="7"
                                    rx="1"
                                />
                            </svg>

                            <span className="text-[9px] font-medium">
                                Dashboard
                            </span>
                        </Link>

                        {/* PASIEN */}
                        <Link
                            href="/pasiens"
                            className={navBottom(isActive('/pasiens'))}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                            >
                                <circle cx="12" cy="8" r="3.5" />
                                <path d="M5 20c.8-3.3 3.2-5 7-5s6.2 1.7 7 5" />
                            </svg>

                            <span className="text-[9px] font-medium">
                                Pasien
                            </span>
                        </Link>

                        {/* POLI */}
                        <Link
                            href="/polis"
                            className={navBottom(isActive('/polis'))}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
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

                            <span className="text-[9px] font-medium">Poli</span>
                        </Link>

                        {/* PENDAFTARAN */}
                        <Link
                            href="/pendaftarans"
                            className={navBottom(isActive('/pendaftarans'))}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                            >
                                <rect
                                    x="4"
                                    y="3"
                                    width="16"
                                    height="18"
                                    rx="2"
                                />
                                <path d="M8 7h8M8 11h8M8 15h5" />
                            </svg>

                            <span className="text-[9px] font-medium">
                                Pendaftaran
                            </span>
                        </Link>

                        {/* ANTREAN */}
                        <Link
                            href="/antrians"
                            className={navBottom(isActive('/antrians'))}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                            >
                                <circle cx="12" cy="12" r="8.5" />
                                <path d="M12 7v5l3 2" />
                            </svg>

                            <span className="text-[9px] font-medium">
                                Antrean
                            </span>
                        </Link>

                        {/* LAPORAN */}
                        <button
                            type="button"
                            className="flex h-full flex-1 flex-col items-center justify-center gap-1 px-1 text-white/55"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                            >
                                <path d="M4 19V5M4 19h17" />
                                <path d="m7 15 4-4 3 2 5-6" />
                            </svg>

                            <span className="text-[9px] font-medium">
                                Laporan
                            </span>
                        </button>
                    </div>
                </div>
            </nav>
        </div>
    );
}
