import { Link } from '@inertiajs/react';
import { register } from '@/routes';
import { useState } from 'react';

function MenuIcon() {
    return (
        <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" >
            <path d="M4 6H20" />
            <path d="M4 12H20" />
            <path d="M4 18H20" />
        </svg>
    );
}

function CloseIcon() {
    return (
        <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" >
            <path d="M6 6L18 18" />
            <path d="M18 6L6 18" />
        </svg>
    );
}
interface NavLink {
    label: string;
    href: string;
}

const navLinks: NavLink[] = [
    { label: 'Beranda', href: '/' },
    { label: 'Cari Dokter', href: '/jadwal-dokter' },
    { label: 'Fasilitas & Layanan', href: '/layanan' },
    { label: 'Berita', href: '/berita' },
    { label: 'Kontak Kami', href: '/kontak' },
];

export default function Navbar() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const closeMobile = () => setMobileOpen(false);

    return (
        <header className="fixed top-0 right-0 left-0 z-50 px-3 pt-3 sm:px-4 lg:px-6">
            <nav className="mx-auto flex h-[68px] w-full max-w-7xl items-center justify-between rounded-2xl border border-t-2 border-[#075985]/10 border-t-[#075985] bg-white/95 px-4 shadow-[0_8px_30px_rgba(0,0,0,0.08)] backdrop-blur-md sm:px-5 lg:px-8">
                <Link href="/" onClick={closeMobile} className="flex shrink-0 items-center gap-2 text-[#075985]" >
                    <img src="/assets/LG1.png" alt="Rs Merdeka" className="h-20 w-auto object-contain sm:h-19" />
                </Link>
                <div className="hidden items-center gap-5 lg:flex">
                    {navLinks.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="text-[13px] font-semibold text-gray-800 transition hover:text-[#075985]"
                        >
                            {item.label}
                        </Link>
                    ))}
                </div>
                <div className="flex items-center justify-center gap-3">
                    <Link
                        href={register()}
                        className="hidden rounded-full bg-[#075985] px-7 py-2.5 text-[12px] font-bold text-white transition hover:bg-[#064e73] hover:shadow-md lg:block"
                    >
                        Buat Janji Tamu
                    </Link>

                    <Link
                        href={register()}
                        className="hidden rounded-full bg-[#075985] px-7 py-2.5 text-[12px] font-bold text-white transition hover:bg-[#064e73] hover:shadow-md lg:block"
                    >
                        Masuk / Daftar
                    </Link>
                </div>
                <button
                    type="button"
                    onClick={() => setMobileOpen((value) => !value)}
                    className="flex h-10 w-10 items-center justify-center rounded-xl text-[#075985] transition hover:bg-gray-100 lg:hidden"
                    aria-label={mobileOpen ? 'Tutup menu' : 'Buka menu'}
                >
                    {mobileOpen ? <CloseIcon /> : <MenuIcon />}
                </button>
            </nav>

            {mobileOpen && (
                <div className="mx-auto mt-2 w-full max-w-7xl overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-[0_12px_35px_rgba(0,0,0,0.10)] lg:hidden">
                    <div className="max-h-[calc(100vh-100px)] overflow-y-auto px-4 py-4 sm:px-5">
                        {navLinks.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={closeMobile}
                                className="flex items-center rounded-xl border-b border-gray-100 px-3 py-3 text-sm font-semibold text-gray-800 transition hover:bg-gray-50 hover:text-[#075985]"
                            >
                                {item.label}
                            </Link>
                        ))}

                        <div className="mt-3 border-t border-gray-100 pt-4">
                            <Link
                                href={register()}
                                onClick={closeMobile}
                                className="block w-full rounded-full bg-[#075985] py-3 text-center text-sm font-bold text-white transition hover:bg-[#064e73]"
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
