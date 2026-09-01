import React from "react";

export default function Dashboard() {
    const doctors = [
        {
            name: "Dr. Amanda",
            image: "/assets/dok1.png",
            schedule: "08:00 - 12:00",
        },
        {
            name: "Dr. Sarah",
            image: "/assets/dok2.png",
            schedule: "09:00 - 13:00",
        },
        {
            name: "Dr. Jessica",
            image: "/assets/dok3.png",
            schedule: "10:00 - 14:00",
        },
        {
            name: "Dr. Emily",
            image: "/assets/dok4.png",
            schedule: "13:00 - 17:00",
        },
    ];

    return (
        <div className="min-h-screen w-full bg-[#f7f9fb]">
            {/* =========================================================
                DESKTOP SIDEBAR
            ========================================================= */}
            <aside className="fixed left-0 top-0 z-50 hidden h-screen w-[250px] bg-[#07577f] text-white lg:flex lg:flex-col">
                {/* BRAND */}
                <div className="flex h-[86px] shrink-0 items-center border-b border-white/10 px-7">
                    <div>
                        <h1 className="text-[21px] font-bold tracking-tight">
                            Rs Merdeka
                        </h1>

                        <p className="mt-0.5 text-[11px] font-medium tracking-wide text-white/55">
                            Management System
                        </p>
                    </div>
                </div>

                {/* SIDEBAR MENU */}
                <div className="flex-1 overflow-y-auto px-4 py-5">
                    {/* MAIN */}
                    <div className="mb-6">
                        <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/40">
                            Main
                        </p>

                        <div className="space-y-1">
                            {/* Dashboard */}
                            <button
                                type="button"
                                className="flex w-full items-center gap-3 rounded-lg bg-white/15 px-3 py-2.5 text-left text-[13px] font-medium text-white"
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
                            </button>

                            {/* Monitoring */}
                            <button
                                type="button"
                                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[13px] font-medium text-white/60 transition hover:bg-white/10 hover:text-white"
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
                            </button>
                        </div>
                    </div>

                    {/* MASTER DATA */}
                    <div className="mb-6">
                        <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/40">
                            Master Data
                        </p>

                        <div className="space-y-1">
                            {/* Pasien */}
                            <button
                                type="button"
                                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[13px] font-medium text-white/60 transition hover:bg-white/10 hover:text-white"
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
                            </button>

                            {/* Poli */}
                            <button
                                type="button"
                                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[13px] font-medium text-white/60 transition hover:bg-white/10 hover:text-white"
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
                            </button>

                            {/* Dokter */}
                            <button
                                type="button"
                                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[13px] font-medium text-white/60 transition hover:bg-white/10 hover:text-white"
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
                                    <path d="M18 5v4M16 7h4" />
                                </svg>

                                <span>Dokter</span>
                            </button>

                            {/* Perawat */}
                            <button
                                type="button"
                                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[13px] font-medium text-white/60 transition hover:bg-white/10 hover:text-white"
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
                                    <circle cx="17" cy="9" r="2.5" />
                                    <path d="M3 20c.7-3.2 2.7-5 6-5s5.3 1.8 6 5" />
                                    <path d="M15 15c3.2-.1 5.1 1.5 5.8 4.5" />
                                </svg>

                                <span>Perawat</span>
                            </button>

                            {/* Obat */}
                            <button
                                type="button"
                                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[13px] font-medium text-white/60 transition hover:bg-white/10 hover:text-white"
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
                                        y="7"
                                        width="18"
                                        height="10"
                                        rx="5"
                                        transform="rotate(-45 12 12)"
                                    />
                                    <path d="m8.5 8.5 7 7" />
                                </svg>

                                <span>Obat</span>
                            </button>

                            {/* Ruangan */}
                            <button
                                type="button"
                                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[13px] font-medium text-white/60 transition hover:bg-white/10 hover:text-white"
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
                                    <path d="M2 21h20M8 7h2M14 7h2M8 11h2M14 11h2M8 15h2M14 15h2M10 21v-3h4v3" />
                                </svg>

                                <span>Ruangan</span>
                            </button>
                        </div>
                    </div>

                    {/* PELAYANAN */}
                    <div className="mb-6">
                        <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/40">
                            Pelayanan
                        </p>

                        <div className="space-y-1">
                            {/* Pendaftaran */}
                            <button
                                type="button"
                                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[13px] font-medium text-white/60 transition hover:bg-white/10 hover:text-white"
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
                            </button>

                            {/* Antrean */}
                            <button
                                type="button"
                                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[13px] font-medium text-white/60 transition hover:bg-white/10 hover:text-white"
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
                            </button>

                            {/* Pemeriksaan */}
                            <button
                                type="button"
                                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[13px] font-medium text-white/60 transition hover:bg-white/10 hover:text-white"
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
                            </button>

                            {/* Pembayaran */}
                            <button
                                type="button"
                                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[13px] font-medium text-white/60 transition hover:bg-white/10 hover:text-white"
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
                            </button>
                        </div>
                    </div>

                    {/* LAPORAN */}
                    <div className="mb-6">
                        <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/40">
                            Laporan
                        </p>

                        <div className="space-y-1">
                            {/* Laporan Pasien */}
                            <button
                                type="button"
                                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[13px] font-medium text-white/60 transition hover:bg-white/10 hover:text-white"
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
                                    <path d="M9 8h6M9 12h6M9 16h4" />
                                </svg>

                                <span>Laporan Pasien</span>
                            </button>

                            {/* Laporan Kunjungan */}
                            <button
                                type="button"
                                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[13px] font-medium text-white/60 transition hover:bg-white/10 hover:text-white"
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
                            <button
                                type="button"
                                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[13px] font-medium text-white/60 transition hover:bg-white/10 hover:text-white"
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

                                <span>Laporan Antrean</span>
                            </button>

                            {/* Laporan Pendapatan */}
                            <button
                                type="button"
                                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[13px] font-medium text-white/60 transition hover:bg-white/10 hover:text-white"
                            >
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
                </div>

                {/* SYSTEM */}
                <div className="shrink-0 border-t border-white/10 px-4 py-4">
                    <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/40">
                        System
                    </p>

                    <div className="space-y-1">
                        {/* Profile */}
                        <button
                            type="button"
                            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[13px] font-medium text-white/60 transition hover:bg-white/10 hover:text-white"
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
                        </button>

                        {/* Logout */}
                        <button
                            type="button"
                            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[13px] font-medium text-white/60 transition hover:bg-red-500/15 hover:text-red-200"
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

                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* =========================================================
                MOBILE TOP HEADER
            ========================================================= */}
            <header className="fixed left-0 right-0 top-0 z-40 overflow-hidden rounded-b-[22px] bg-[#07577f] px-5 py-6 text-white shadow-md sm:px-8 lg:hidden">
                {/* Decorative circles */}
                <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-white/5" />

                <div className="pointer-events-none absolute -bottom-32 right-20 h-64 w-64 rounded-full bg-white/5" />

                <div className="pointer-events-none absolute -right-40 top-10 h-80 w-80 rounded-full bg-white/[0.03]" />

                {/* Profile */}
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

                    {/* Notification */}
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

                        <span className="absolute right-2.5 top-2 h-2 w-2 rounded-full bg-red-400" />
                    </button>
                </div>

                {/* Search */}
                <div className="relative z-10 mt-5 flex h-11 items-center rounded-full bg-white px-4 text-gray-400">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="mr-3 h-[18px] w-[18px] shrink-0"
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
            </header>

            {/* =========================================================
                DESKTOP TOP NAVBAR
            ========================================================= */}
            <header className="fixed left-[250px] right-0 top-0 z-40 hidden border-b border-gray-100 bg-white lg:block">
                <div className="mx-auto max-w-[1440px] px-8 xl:px-12">
                    <div className="flex h-[86px] items-center justify-between">
                        {/* Profile */}
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

                        {/* Search + Notification */}
                        <div className="flex items-center gap-5">
                            <div className="flex h-10 w-[320px] items-center rounded-full border border-gray-200 bg-[#f7f9fb] px-4">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="mr-3 h-[17px] w-[17px] shrink-0 text-gray-400"
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

                            <button
                                type="button"
                                className="relative flex h-10 w-10 items-center justify-center rounded-full bg-[#f7f9fb] text-gray-500 transition hover:bg-gray-100"
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

                                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* =========================================================
                MAIN CONTENT
            ========================================================= */}
            <div className="min-h-screen lg:ml-[250px]">
                <main className="mx-auto max-w-[1200px] px-5 pb-10 pt-[205px] sm:px-8 sm:pt-[220px] lg:px-8 lg:pt-[110px] xl:px-12">
                    {/* =================================================
                        SERVICE
                    ================================================= */}
                    <section>
                        <div className="flex items-end justify-between">
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
                            {/* Pasien */}
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
                                        <circle cx="12" cy="8" r="3.5" />
                                        <path d="M5 20c.8-3.3 3.2-5 7-5s6.2 1.7 7 5" />
                                    </svg>
                                </div>

                                <div>
                                    <p className="text-sm font-semibold">
                                        Pasien
                                    </p>

                                    <p className="mt-0.5 text-[10px] text-white/60">
                                        Kelola pasien
                                    </p>
                                </div>
                            </button>

                            {/* Poli */}
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
                                    <p className="text-sm font-semibold">
                                        Poli
                                    </p>

                                    <p className="mt-0.5 text-[10px] text-white/60">
                                        Kelola poli
                                    </p>
                                </div>
                            </button>

                            {/* Antrean */}
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
                                            y="5"
                                            width="16"
                                            height="15"
                                            rx="2"
                                        />
                                        <path d="M8 3v4M16 3v4M4 9h16" />
                                    </svg>
                                </div>

                                <div>
                                    <p className="text-sm font-semibold">
                                        Antrean
                                    </p>

                                    <p className="mt-0.5 text-[10px] text-white/60">
                                        Kelola antrean
                                    </p>
                                </div>
                            </button>

                            {/* Pemeriksaan */}
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
                                    <p className="text-sm font-semibold">
                                        Pemeriksaan
                                    </p>

                                    <p className="mt-0.5 text-[10px] text-white/60">
                                        Pemeriksaan pasien
                                    </p>
                                </div>
                            </button>
                        </div>
                    </section>

                    {/* =================================================
                        DOCTOR
                    ================================================= */}
                    <section className="mt-8">
                        <div className="flex items-end justify-between">
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
                            {doctors.map((doctor) => (
                                <div
                                    key={doctor.name}
                                    className="overflow-hidden rounded-xl bg-white shadow-sm"
                                >
                                    <div className="h-[145px] overflow-hidden sm:h-[165px] lg:h-[210px]">
                                        <img
                                            src={doctor.image}
                                            alt={doctor.name}
                                            className="h-full w-full object-cover"
                                        />
                                    </div>

                                    <div className="bg-[#07577f] px-3 py-3 text-white">
                                        <p className="text-xs font-semibold sm:text-sm">
                                            {doctor.name}
                                        </p>

                                        <p className="mt-0.5 text-[10px] text-white/60">
                                            Dokter Umum
                                        </p>

                                        <div className="mt-2 flex items-center gap-1.5">
                                            <span className="h-1.5 w-1.5 rounded-full bg-green-400" />

                                            <span className="text-[9px] text-white/70">
                                                Tersedia hari ini
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* =================================================
                        JADWAL DOCTOR
                    ================================================= */}
                    <section className="mt-8">
                        <div className="flex items-end justify-between">
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
                            {doctors.map((doctor) => (
                                <div
                                    key={`${doctor.name}-schedule`}
                                    className="overflow-hidden rounded-xl bg-white shadow-sm"
                                >
                                    <div className="h-[145px] overflow-hidden sm:h-[165px] lg:h-[210px]">
                                        <img
                                            src={doctor.image}
                                            alt={doctor.name}
                                            className="h-full w-full object-cover"
                                        />
                                    </div>

                                    <div className="bg-[#07577f] px-3 py-3 text-white">
                                        <p className="text-xs font-semibold sm:text-sm">
                                            {doctor.name}
                                        </p>

                                        <p className="mt-0.5 text-[10px] text-white/60">
                                            Jam Praktik
                                        </p>

                                        <p className="mt-1 text-[11px] font-medium">
                                            {doctor.schedule}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* =================================================
                        INFORMASI
                    ================================================= */}
                    <section className="mt-8 rounded-2xl bg-[#f7f9fb]">
                        <div className="flex items-end justify-between">
                            <div>
                                <h2 className="text-lg font-bold text-gray-800 sm:text-xl">
                                    Informasi
                                </h2>

                                <p className="mt-1 text-xs text-gray-400 sm:text-sm">
                                    Informasi klinik
                                </p>
                            </div>
                        </div>

                        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                            {/* Jam Operasional */}
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
                                            <circle
                                                cx="12"
                                                cy="12"
                                                r="8.5"
                                            />
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

                            {/* Layanan */}
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
                                        <p className="text-xs text-gray-400">
                                            Layanan
                                        </p>

                                        <p className="mt-1 text-sm font-semibold text-gray-800">
                                            Layanan kesehatan
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Status Sistem */}
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
                </main>
            </div>

            {/* =========================================================
                MOBILE BOTTOM NAVIGATION
            ========================================================= */}
            <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-[#07577f] shadow-[0_-5px_25px_rgba(0,0,0,0.12)] lg:hidden">
                <div className="mx-auto flex h-[70px] w-full max-w-[900px] items-center justify-between px-1 sm:h-[76px] sm:px-3">
                    {/* Dashboard */}
                    <button
                        type="button"
                        className="flex h-full flex-1 flex-col items-center justify-center gap-1 text-white"
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

                        <span className="text-[9px] font-medium">
                            Dashboard
                        </span>
                    </button>

                    {/* Pasien */}
                    <button
                        type="button"
                        className="flex h-full flex-1 flex-col items-center justify-center gap-1 text-white/55 transition hover:text-white"
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
                    </button>

                    {/* Poli */}
                    <button
                        type="button"
                        className="flex h-full flex-1 flex-col items-center justify-center gap-1 text-white/55 transition hover:text-white"
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

                        <span className="text-[9px] font-medium">
                            Poli
                        </span>
                    </button>

                    {/* Pendaftaran */}
                    <button
                        type="button"
                        className="flex h-full flex-1 flex-col items-center justify-center gap-1 text-white/55 transition hover:text-white"
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
                    </button>

                    {/* Antrean */}
                    <button
                        type="button"
                        className="flex h-full flex-1 flex-col items-center justify-center gap-1 text-white/55 transition hover:text-white"
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
                    </button>

                    {/* Laporan */}
                    <button
                        type="button"
                        className="flex h-full flex-1 flex-col items-center justify-center gap-1 text-white/55 transition hover:text-white"
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
            </nav>
        </div>
    );
}
