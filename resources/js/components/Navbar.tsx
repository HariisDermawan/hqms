import { Link } from '@inertiajs/react';
import { register } from '@/routes';
import { useEffect, useRef, useState } from 'react';

interface MenuItem {
    title: string;
    description: string;
    href: string;
    icon: React.ReactNode;
}

const profileItems: MenuItem[] = [
    {
        title: 'Direktur',
        description: 'Informasi pimpinan rumah sakit',
        href: '/profil/direktur',
        icon: <DirectorIcon />,
    },
    {
        title: 'Visi & Misi',
        description: 'Visi dan misi Rs Merdeka',
        href: '/profil/visi-misi',
        icon: <VisionIcon />,
    },
    {
        title: 'Sejarah',
        description: 'Sejarah dan perkembangan rumah sakit',
        href: '/profil/sejarah',
        icon: <HistoryIcon />,
    },
];

const serviceItems: MenuItem[] = [
    {
        title: 'Dokter',
        description: 'Cari dokter spesialis',
        href: '/dokters',
        icon: <DoctorIcon />,
    },
    {
        title: 'Poliklinik',
        description: 'Layanan poliklinik',
        href: '/poliklinik',
        icon: <ClinicIcon />,
    },
    {
        title: 'IGD / Emergency',
        description: 'Layanan darurat 24 jam',
        href: '/emergency',
        icon: <EmergencyIcon />,
    },
    {
        title: 'Fasilitas',
        description: 'Fasilitas rumah sakit',
        href: '/fasilitas',
        icon: <BuildingIcon />,
    },
    {
        title: 'Jadwal Dokter',
        description: 'Lihat jadwal praktik',
        href: '/jadwal-dokter',
        icon: <CalendarIcon />,
    },
];

const eventItems: MenuItem[] = [
    {
        title: 'Galeri',
        description: 'Foto dan dokumentasi',
        href: '/informasi/galeri',
        icon: <GalleryIcon />,
    },
    {
        title: 'Artikel Kesehatan',
        description: 'Informasi kesehatan',
        href: '/informasi/artikel',
        icon: <ArticleIcon />,
    },
    {
        title: 'Tips Kesehatan',
        description: 'Tips hidup sehat',
        href: '/informasi/tips-kesehatan',
        icon: <HeartIcon />,
    },
];

export default function Navbar() {
    const [mobileOpen, setMobileOpen] = useState(false);

    const [profileOpen, setProfileOpen] = useState(false);
    const [serviceOpen, setServiceOpen] = useState(false);
    const [eventOpen, setEventOpen] = useState(false);

    const desktopMenuRef = useRef<HTMLDivElement>(null);

    /*
    |--------------------------------------------------------------------------
    | CLOSE DESKTOP DROPDOWN WHEN CLICKING OUTSIDE
    |--------------------------------------------------------------------------
    */
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (mobileOpen) {
                return;
            }

            if (
                desktopMenuRef.current &&
                !desktopMenuRef.current.contains(event.target as Node)
            ) {
                setProfileOpen(false);
                setServiceOpen(false);
                setEventOpen(false);
            }
        };

        document.addEventListener('click', handleClickOutside);

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [mobileOpen]);

    /*
    |--------------------------------------------------------------------------
    | CLOSE MOBILE
    |--------------------------------------------------------------------------
    */
    const closeMobile = () => {
        setMobileOpen(false);
        setProfileOpen(false);
        setServiceOpen(false);
        setEventOpen(false);
    };

    /*
    |--------------------------------------------------------------------------
    | TOGGLE PROFILE
    |--------------------------------------------------------------------------
    */
    const toggleProfile = (
        event?: React.MouseEvent<HTMLButtonElement>,
    ) => {
        event?.stopPropagation();

        setProfileOpen((value) => !value);
        setServiceOpen(false);
        setEventOpen(false);
    };

    /*
    |--------------------------------------------------------------------------
    | TOGGLE SERVICE
    |--------------------------------------------------------------------------
    */
    const toggleService = (
        event?: React.MouseEvent<HTMLButtonElement>,
    ) => {
        event?.stopPropagation();

        setServiceOpen((value) => !value);
        setProfileOpen(false);
        setEventOpen(false);
    };

    /*
    |--------------------------------------------------------------------------
    | TOGGLE EVENT
    |--------------------------------------------------------------------------
    */
    const toggleEvent = (
        event?: React.MouseEvent<HTMLButtonElement>,
    ) => {
        event?.stopPropagation();

        setEventOpen((value) => !value);
        setProfileOpen(false);
        setServiceOpen(false);
    };

    return (
        <header className="fixed left-0 right-0 top-0 z-50 px-3 pt-3 sm:px-4 lg:px-6">
            <nav
                ref={desktopMenuRef}
                className="
                    mx-auto
                    flex
                    h-[68px]
                    w-full
                    max-w-7xl
                    items-center
                    justify-between
                    rounded-2xl
                    border
                    border-[#075985]/10
                    border-t-2
                    border-t-[#075985]
                    bg-white/95
                    px-4
                    shadow-[0_8px_30px_rgba(0,0,0,0.08)]
                    backdrop-blur-md
                    sm:px-5
                    lg:px-8
                "
            >
                {/* =====================================================
                    LOGO
                ====================================================== */}
                <Link
                    href="/"
                    onClick={closeMobile}
                    className="flex shrink-0 items-center gap-2 text-[#075985]"
                >
                    <HospitalIcon />

                    <span className="text-base font-bold tracking-tight sm:text-lg">
                        Rs Merdeka
                    </span>
                </Link>

                {/* =====================================================
                    DESKTOP MENU
                ====================================================== */}
                <div className="hidden items-center gap-6 lg:flex">

                    {/* BERANDA */}
                    <Link
                        href="/"
                        onClick={() => {
                            setProfileOpen(false);
                            setServiceOpen(false);
                            setEventOpen(false);
                        }}
                        className="
                            text-[13px]
                            font-semibold
                            text-gray-800
                            transition
                            hover:text-[#075985]
                        "
                    >
                        Beranda
                    </Link>

                    {/* =================================================
                        PROFIL
                    ================================================== */}
                    <div className="relative">
                        <button
                            type="button"
                            onClick={toggleProfile}
                            className={`
                                flex
                                items-center
                                gap-1.5
                                text-[13px]
                                font-semibold
                                transition
                                ${profileOpen
                                    ? 'text-[#075985]'
                                    : 'text-gray-800 hover:text-[#075985]'
                                }
                            `}
                        >
                            Profil

                            <ChevronIcon open={profileOpen} />
                        </button>

                        {profileOpen && (
                            <DesktopDropdown items={profileItems} />
                        )}
                    </div>

                    {/* =================================================
                        LAYANAN KESEHATAN
                    ================================================== */}
                    <div className="relative">
                        <button
                            type="button"
                            onClick={toggleService}
                            className={`
                                flex
                                items-center
                                gap-1.5
                                text-[13px]
                                font-semibold
                                transition
                                ${serviceOpen
                                    ? 'text-[#075985]'
                                    : 'text-gray-800 hover:text-[#075985]'
                                }
                            `}
                        >
                            Layanan Kesehatan

                            <ChevronIcon open={serviceOpen} />
                        </button>

                        {serviceOpen && (
                            <DesktopDropdown items={serviceItems} />
                        )}
                    </div>

                    {/* =================================================
                        INFORMASI
                    ================================================== */}
                    <div className="relative">
                        <button
                            type="button"
                            onClick={toggleEvent}
                            className={`
                                flex
                                items-center
                                gap-1.5
                                text-[13px]
                                font-semibold
                                transition
                                ${eventOpen
                                    ? 'text-[#075985]'
                                    : 'text-gray-800 hover:text-[#075985]'
                                }
                            `}
                        >
                            Informasi

                            <ChevronIcon open={eventOpen} />
                        </button>

                        {eventOpen && (
                            <DesktopDropdown items={eventItems} />
                        )}
                    </div>

                    {/* KONTAK */}
                    <Link
                        href="/contact"
                        onClick={() => {
                            setProfileOpen(false);
                            setServiceOpen(false);
                            setEventOpen(false);
                        }}
                        className="
                            text-[13px]
                            font-semibold
                            text-gray-800
                            transition
                            hover:text-[#075985]
                        "
                    >
                        Kontak Kami
                    </Link>
                </div>

                {/* =====================================================
                    REGISTER DESKTOP
                ====================================================== */}
                <Link
                    href={register()}
                    className="
                        hidden
                        rounded-full
                        bg-[#075985]
                        px-7
                        py-2.5
                        text-[12px]
                        font-bold
                        text-white
                        transition
                        hover:bg-[#064e73]
                        hover:shadow-md
                        lg:block
                    "
                >
                    Registrasi
                </Link>

                {/* =====================================================
                    MOBILE BUTTON
                ====================================================== */}
                <button
                    type="button"
                    onClick={() => {
                        setMobileOpen((value) => !value);
                        setProfileOpen(false);
                        setServiceOpen(false);
                        setEventOpen(false);
                    }}
                    className="
                        flex
                        h-10
                        w-10
                        items-center
                        justify-center
                        rounded-xl
                        text-[#075985]
                        transition
                        hover:bg-gray-100
                        lg:hidden
                    "
                    aria-label={
                        mobileOpen ? 'Tutup menu' : 'Buka menu'
                    }
                >
                    {mobileOpen ? <CloseIcon /> : <MenuIcon />}
                </button>
            </nav>

            {/* =========================================================
                MOBILE MENU
            ========================================================== */}
            {mobileOpen && (
                <div
                    className="
                        mx-auto
                        mt-2
                        w-full
                        max-w-7xl
                        overflow-hidden
                        rounded-2xl
                        border
                        border-gray-100
                        bg-white
                        shadow-[0_12px_35px_rgba(0,0,0,0.10)]
                        lg:hidden
                    "
                >
                    <div className="max-h-[calc(100vh-100px)] overflow-y-auto px-4 py-4 sm:px-5">

                        {/* HOME */}
                        <Link
                            href="/"
                            onClick={closeMobile}
                            className="
                                flex
                                items-center
                                rounded-xl
                                px-3
                                py-3
                                text-sm
                                font-semibold
                                text-gray-800
                                transition
                                hover:bg-gray-50
                                hover:text-[#075985]
                            "
                        >
                            Beranda
                        </Link>

                        {/* =================================================
                            PROFIL MOBILE
                        ================================================== */}
                        <div className="border-b border-gray-100">
                            <button
                                type="button"
                                onClick={toggleProfile}
                                className="
                                    flex
                                    w-full
                                    items-center
                                    justify-between
                                    rounded-xl
                                    px-3
                                    py-3
                                    text-sm
                                    font-semibold
                                    text-gray-800
                                    transition
                                    hover:bg-gray-50
                                "
                            >
                                <span>Profil</span>

                                <ChevronIcon open={profileOpen} />
                            </button>

                            {profileOpen && (
                                <div className="mb-3 mt-1 space-y-1 rounded-xl bg-gray-50 p-2">
                                    {profileItems.map((item) => (
                                        <MobileMenuItem
                                            key={item.title}
                                            item={item}
                                            onClick={closeMobile}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* =================================================
                            SERVICE MOBILE
                        ================================================== */}
                        <div className="border-b border-gray-100">
                            <button
                                type="button"
                                onClick={toggleService}
                                className="
                                    flex
                                    w-full
                                    items-center
                                    justify-between
                                    rounded-xl
                                    px-3
                                    py-3
                                    text-sm
                                    font-semibold
                                    text-gray-800
                                    transition
                                    hover:bg-gray-50
                                "
                            >
                                <span>Layanan Kesehatan</span>

                                <ChevronIcon open={serviceOpen} />
                            </button>

                            {serviceOpen && (
                                <div className="mb-3 mt-1 space-y-1 rounded-xl bg-gray-50 p-2">
                                    {serviceItems.map((item) => (
                                        <MobileMenuItem
                                            key={item.title}
                                            item={item}
                                            onClick={closeMobile}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* =================================================
                            INFORMASI MOBILE
                        ================================================== */}
                        <div className="border-b border-gray-100">
                            <button
                                type="button"
                                onClick={toggleEvent}
                                className="
                                    flex
                                    w-full
                                    items-center
                                    justify-between
                                    rounded-xl
                                    px-3
                                    py-3
                                    text-sm
                                    font-semibold
                                    text-gray-800
                                    transition
                                    hover:bg-gray-50
                                "
                            >
                                <span>Informasi</span>

                                <ChevronIcon open={eventOpen} />
                            </button>

                            {eventOpen && (
                                <div className="mb-3 mt-1 space-y-1 rounded-xl bg-gray-50 p-2">
                                    {eventItems.map((item) => (
                                        <MobileMenuItem
                                            key={item.title}
                                            item={item}
                                            onClick={closeMobile}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                        {/* CONTACT */}
                        <Link
                            href="/contact"
                            onClick={closeMobile}
                            className="
                                flex
                                items-center
                                rounded-xl
                                px-3
                                py-3
                                text-sm
                                font-semibold
                                text-gray-800
                                transition
                                hover:bg-gray-50
                                hover:text-[#075985]
                            "
                        >
                            Kontak Kami
                        </Link>

                        {/* REGISTER */}
                        <div className="mt-3 border-t border-gray-100 pt-4">
                            <Link
                                href={register()}
                                onClick={closeMobile}
                                className="
                                    block
                                    w-full
                                    rounded-full
                                    bg-[#075985]
                                    py-3
                                    text-center
                                    text-sm
                                    font-bold
                                    text-white
                                    transition
                                    hover:bg-[#064e73]
                                "
                            >
                                Registrasi
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}

/* =========================================================================
   DESKTOP DROPDOWN
========================================================================= */

function DesktopDropdown({
    items,
}: {
    items: MenuItem[];
}) {
    return (
        <div
            className="
                absolute
                left-1/2
                top-full
                mt-4
                w-[300px]
                -translate-x-1/2
                rounded-2xl
                border
                border-gray-100
                bg-white
                p-2
                shadow-xl
            "
        >
            <div className="space-y-1">
                {items.map((item) => (
                    <Link
                        key={item.title}
                        href={item.href}
                        className="
                            group
                            flex
                            items-center
                            gap-3
                            rounded-xl
                            p-3
                            transition
                            hover:bg-[#075985]/5
                        "
                    >
                        <div
                            className="
                                flex
                                h-10
                                w-10
                                shrink-0
                                items-center
                                justify-center
                                rounded-xl
                                bg-[#075985]/10
                                text-[#075985]
                                transition
                                group-hover:bg-[#075985]
                                group-hover:text-white
                            "
                        >
                            {item.icon}
                        </div>

                        <div className="min-w-0 flex-1">
                            <div
                                className="
                                    text-sm
                                    font-semibold
                                    text-gray-800
                                    group-hover:text-[#075985]
                                "
                            >
                                {item.title}
                            </div>

                            <div
                                className="
                                    mt-0.5
                                    truncate
                                    text-[11px]
                                    text-gray-500
                                "
                            >
                                {item.description}
                            </div>
                        </div>

                        <ArrowIcon />
                    </Link>
                ))}
            </div>
        </div>
    );
}

/* =========================================================================
   MOBILE MENU ITEM
========================================================================= */

function MobileMenuItem({
    item,
    onClick,
}: {
    item: MenuItem;
    onClick: () => void;
}) {
    return (
        <Link
            href={item.href}
            onClick={onClick}
            className="
                group
                flex
                items-center
                gap-3
                rounded-xl
                p-2.5
                transition
                active:bg-white
                hover:bg-white
            "
        >
            <div
                className="
                    flex
                    h-10
                    w-10
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    bg-white
                    text-[#075985]
                    shadow-sm
                    ring-1
                    ring-gray-100
                    transition
                    group-hover:bg-[#075985]
                    group-hover:text-white
                "
            >
                {item.icon}
            </div>

            <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold text-gray-800">
                    {item.title}
                </div>

                <div className="truncate text-[11px] leading-4 text-gray-500">
                    {item.description}
                </div>
            </div>

            <ArrowIcon />
        </Link>
    );
}

/* =========================================================================
   ICONS
========================================================================= */

function HospitalIcon() {
    return (
        <svg
            width="30"
            height="30"
            viewBox="0 0 32 32"
            fill="none"
        >
            <path
                d="M8 3H20V8H25V13H30V29H3V13H8V3Z"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinejoin="round"
            />
            <path
                d="M14 3V9M11 6H17"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
            />
            <path
                d="M9 17V20M7.5 18.5H10.5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
            />
            <path
                d="M21 17V20M19.5 18.5H22.5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
            />
            <path
                d="M12 29V23H20V29"
                stroke="currentColor"
                strokeWidth="2"
            />
        </svg>
    );
}

function MenuIcon() {
    return (
        <svg
            className="h-7 w-7"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
        >
            <path d="M4 6H20" />
            <path d="M4 12H20" />
            <path d="M4 18H20" />
        </svg>
    );
}

function CloseIcon() {
    return (
        <svg
            className="h-7 w-7"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
        >
            <path d="M6 6L18 18" />
            <path d="M18 6L6 18" />
        </svg>
    );
}

function ChevronIcon({ open }: { open: boolean }) {
    return (
        <svg
            className={`h-4 w-4 transition-transform duration-200 ${open ? 'rotate-180' : ''
                }`}
            viewBox="0 0 20 20"
            fill="currentColor"
        >
            <path
                fillRule="evenodd"
                d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                clipRule="evenodd"
            />
        </svg>
    );
}

function ArrowIcon() {
    return (
        <svg
            className="
                h-4
                w-4
                shrink-0
                text-gray-300
                transition
                group-hover:translate-x-0.5
                group-hover:text-[#075985]
            "
            viewBox="0 0 20 20"
            fill="currentColor"
        >
            <path
                fillRule="evenodd"
                d="M7.21 14.77a.75.75 0 01.02-1.06L10.94 10 7.23 6.29a.75.75 0 111.06-1.06l4.24 4.24a.75.75 0 010 1.06l-4.24 4.24a.75.75 0 01-1.06-.02z"
                clipRule="evenodd"
            />
        </svg>
    );
}

/* =========================================================================
   PROFILE ICONS
========================================================================= */

function DirectorIcon() {
    return (
        <svg
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="12" cy="7" r="3" />
            <path d="M5 21v-2a7 7 0 0114 0v2" />
            <path d="M8 21h8" />
        </svg>
    );
}

function VisionIcon() {
    return (
        <svg
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12z" />
            <circle cx="12" cy="12" r="3" />
        </svg>
    );
}

function HistoryIcon() {
    return (
        <svg
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M3 12a9 9 0 109-9 9.3 9.3 0 00-6.36 2.64L3 8" />
            <path d="M3 3v5h5" />
            <path d="M12 7v5l3 2" />
        </svg>
    );
}

/* =========================================================================
   SERVICE ICONS
========================================================================= */

function DoctorIcon() {
    return (
        <svg
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
        >
            <circle cx="12" cy="7" r="3" />
            <path d="M5 21v-2a7 7 0 0114 0v2" />
            <path d="M19 4v4M17 6h4" />
        </svg>
    );
}

function ClinicIcon() {
    return (
        <svg
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
        >
            <rect x="4" y="4" width="16" height="16" rx="2" />
            <path d="M12 8v8M8 12h8" />
        </svg>
    );
}

function EmergencyIcon() {
    return (
        <svg
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
        >
            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4" />
            <circle cx="12" cy="12" r="5" />
            <path d="M12 9v6M9 12h6" />
        </svg>
    );
}

function BuildingIcon() {
    return (
        <svg
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
        >
            <path d="M4 21V5a2 2 0 012-2h12a2 2 0 012 2v16" />
            <path d="M8 7h2M14 7h2M8 11h2M14 11h2M8 15h2M14 15h2M10 21v-3h4v3" />
        </svg>
    );
}

function CalendarIcon() {
    return (
        <svg
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
        >
            <rect x="3" y="5" width="18" height="16" rx="2" />
            <path d="M16 3v4M8 3v4M3 10h18" />
            <path d="M8 14h2M14 14h2M8 17h2" />
        </svg>
    );
}

/* =========================================================================
   INFORMATION ICONS
========================================================================= */

function NewsIcon() {
    return (
        <svg
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
        >
            <path d="M4 4h16v16H4z" />
            <path d="M8 8h8M8 12h8M8 16h5" />
        </svg>
    );
}

function EventIcon() {
    return (
        <svg
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
        >
            <rect x="3" y="5" width="18" height="16" rx="2" />
            <path d="M16 3v4M8 3v4M3 10h18" />
            <circle cx="12" cy="15" r="2" />
        </svg>
    );
}

function GalleryIcon() {
    return (
        <svg
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
        >
            <rect x="3" y="4" width="18" height="16" rx="2" />
            <circle cx="8.5" cy="9" r="1.5" />
            <path d="M21 16l-5-5-6 6-2-2-5 5" />
        </svg>
    );
}

function ArticleIcon() {
    return (
        <svg
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
        >
            <path d="M5 4h14v16H5z" />
            <path d="M8 8h8M8 12h8M8 16h5" />
        </svg>
    );
}

function HeartIcon() {
    return (
        <svg
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
        >
            <path d="M20.8 8.6c0 5.4-8.8 10.4-8.8 10.4S3.2 14 3.2 8.6A4.6 4.6 0 017.8 4c1.7 0 3.3.9 4.2 2.3A4.9 4.9 0 0116.2 4a4.6 4.6 0 014.6 4.6z" />
        </svg>
    );
}
