import { Link, type InertiaLinkProps } from '@inertiajs/react';

function FooterLink({
    href,
    children,
    ...props
}: { href: string } & Omit<InertiaLinkProps, 'href'>) {
    return (
        <Link
            href={href}
            {...props}
            className="text-sm text-sky-100/90 transition hover:text-white"
        >
            {children}
        </Link>
    );
}

const navLinks = [
    { label: 'Beranda', href: '/' },
    { label: 'Cari Dokter', href: '/cari-dokter' },
    { label: 'Fasilitas & Layanan', href: '/layanan' },
    { label: 'Berita', href: '/berita' },
    { label: 'Kontak Kami', href: '/kontak' },
];

const serviceLinks = [
    { label: 'Ambil Nomor Antrean', href: '/ticket' },
    { label: 'Antrean Berjalan', href: '/antrians-ticker' },
    { label: 'Buat Janji Tamu', href: '/register' },
    { label: 'Absen Karyawan', href: '/absen-karyawan' },
    { label: 'Masuk / Daftar', href: '/login' },
];

const contactItems = [
    {
        label: 'Jl. Raya Merdeka No. 88, Kota Malang, Jawa Timur',
        icon: (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="h-4 w-4 shrink-0 text-sky-300"
            >
                <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0z" />
                <circle cx="12" cy="10" r="3" />
            </svg>
        ),
    },
    {
        label: '(0341) 555-888',
        icon: (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="h-4 w-4 shrink-0 text-sky-300"
            >
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
        ),
    },
    {
        label: 'info@rsmedikahrs.id',
        icon: (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="h-4 w-4 shrink-0 text-sky-300"
            >
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="m22 7-10 6L2 7" />
            </svg>
        ),
    },
    {
        label: '24 Jam setiap hari',
        icon: (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="h-4 w-4 shrink-0 text-sky-300"
            >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
            </svg>
        ),
    },
];

export default function Footer() {
    return (
        <footer className="bg-[#0a3d5c] pt-16">
            <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 md:px-10 lg:px-14">
                <div className="grid gap-10 pb-12 md:grid-cols-2 lg:grid-cols-12 lg:gap-8">
                    <div className="lg:col-span-4">
                        <Link href="/" className="inline-block">
                            <img
                                src="/assets/LG1.png"
                                alt="Rumah Sakit Medika HRS"
                                className="h-16 w-auto object-contain"
                            />
                        </Link>

                        <p className="mt-4 max-w-sm text-sm leading-relaxed text-sky-100/90">
                            Rumah sakit dengan layanan kesehatan yang mudah
                            diakses. Pendaftaran online, jadwal dokter, dan info
                            fasilitas dalam satu genggaman.
                        </p>

                        <div className="mt-6 flex flex-wrap gap-3">
                            <Link
                                href="/ticket"
                                className="rounded-full bg-[#0284c7] px-6 py-2.5 text-xs font-bold text-white transition hover:bg-[#0369a1]"
                            >
                                Ambil Nomor Antrean
                            </Link>

                            <Link
                                href="/register"
                                className="rounded-full border border-sky-300/40 bg-white/5 px-6 py-2.5 text-xs font-bold text-white transition hover:bg-white/10"
                            >
                                Buat Janji Tamu
                            </Link>
                        </div>
                    </div>

                    <div className="lg:col-span-2">
                        <h3 className="text-sm font-bold tracking-wide text-white uppercase">
                            Navigasi
                        </h3>

                        <ul className="mt-4 space-y-2.5">
                            {navLinks.map((item) => (
                                <li key={item.href}>
                                    <FooterLink href={item.href}>
                                        {item.label}
                                    </FooterLink>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="lg:col-span-3">
                        <h3 className="text-sm font-bold tracking-wide text-white uppercase">
                            Layanan Online
                        </h3>

                        <ul className="mt-4 space-y-2.5">
                            {serviceLinks.map((item) => (
                                <li key={item.href}>
                                    <FooterLink href={item.href}>
                                        {item.label}
                                    </FooterLink>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="lg:col-span-3">
                        <h3 className="text-sm font-bold tracking-wide text-white uppercase">
                            Hubungi Kami
                        </h3>

                        <ul className="mt-4 space-y-3">
                            {contactItems.map((item) => (
                                <li
                                    key={item.label}
                                    className="flex items-start gap-2.5 text-sm text-sky-100/90"
                                >
                                    {item.icon}
                                    <span>{item.label}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="flex flex-col items-center justify-between gap-3 border-t border-white/10 py-6 sm:flex-row">
                    <p className="text-xs text-sky-100/70">
                        © {new Date().getFullYear()} Rumah Sakit Medika HRS. Hak
                        cipta dilindungi.
                    </p>

                    <p className="text-xs text-sky-100/70">
                        Dibuat dengan <span className="text-[#fb7185]">♥</span>{' '}
                        untuk kesehatan Anda
                    </p>
                </div>
            </div>
        </footer>
    );
}
