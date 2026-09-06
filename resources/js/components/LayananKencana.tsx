const BENEFITS = [
    {
        title: 'Ruang Eksekutif Premium',
        description:
            'Kamar perawatan eksklusif dengan fasilitas dan kenyamanan kelas satu.',
        icon: (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-9 w-9"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <path d="M2 22h20" />
                <path d="M4 22V8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v14" />
                <path d="M9 22v-4h6v4" />
                <path d="M12 6V2M10 4h4" />
            </svg>
        ),
    },
    {
        title: 'Konsultasi Prioritas',
        description:
            'Antrean khusus dan jadwal konsultasi yang menyesuaikan kebutuhan Anda.',
        icon: (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-9 w-9"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <path d="M16 2v4M8 2v4M3 10h18" />
                <path d="M9 16l2 2 4-4" />
            </svg>
        ),
    },
    {
        title: 'Pendampingan Pribadi',
        description:
            'Pendamping medis khusus mendampingi perawatan Anda dari awal hingga selesai.',
        icon: (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-9 w-9"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
            </svg>
        ),
    },
    {
        title: 'Fasilitas Lengkap',
        description:
            'Akses laboratorium, radiologi, dan pemeriksaan penunjang secara cepat.',
        icon: (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-9 w-9"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6 6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3" />
                <path d="M8 15v1a6 6 0 0 0 6 6 6 6 0 0 0 6-6v-4" />
                <circle cx="20" cy="10" r="2" />
            </svg>
        ),
    },
];

export default function LayananKencana() {
    return (
        <section className="relative min-h-screen w-full overflow-hidden bg-[#075985]">
            <div
                className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: "url('/banner/bn1.png')" }}
            />
            <div className="absolute inset-0 z-[1] bg-gradient-to-r from-[#075985]/95 via-[#075985]/85 to-[#0284c7]/55" />

            <div className="pointer-events-none absolute right-[-40px] bottom-0 z-[2] h-[78%] w-[82%] sm:bottom-[-60px] sm:h-[78%] sm:w-[76%] md:bottom-[-20px] md:h-[74%] md:w-[54%] lg:bottom-[-10px] lg:h-[86%] lg:w-[52%] xl:bottom-0 xl:h-[90%] xl:w-[50%]">
                <img
                    src="/banner/hero.png"
                    alt="Doctor"
                    className="absolute right-0 bottom-0 h-full w-auto max-w-none object-contain object-bottom sm:right-[-25px] md:right-[-15px] lg:right-[-10px] xl:right-0"
                />
            </div>

            <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl items-center px-5 pt-[105px] pb-28 sm:px-8 sm:pt-[115px] sm:pb-24 md:px-10 md:pt-[100px] md:pb-16 lg:px-14 lg:pt-[100px]">
                <div className="mr-auto w-full max-w-[540px] lg:max-w-[600px]">
                    <p className="text-xs font-bold tracking-widest text-[#7dd3fc] uppercase">
                        Layanan Eksekutif
                    </p>
                    <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                        Layanan Eksekutif Kencana
                    </h2>

                    <p className="mt-4 max-w-[580px] text-sm leading-6 text-white/90 sm:text-base">
                        Nikmati pengalaman berobat yang istimewa dengan
                        pelayanan eksekutif berkelas, didukung tenaga medis
                        profesional dan fasilitas premium yang telah disesuaikan
                        untuk kenyamanan maksimal Anda.
                    </p>

                    <div className="mt-10 grid grid-cols-1 gap-x-8 gap-y-8 sm:grid-cols-2">
                        {BENEFITS.map((benefit) => (
                            <div
                                key={benefit.title}
                                className="flex items-start gap-4"
                            >
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-[#7dd3fc]">
                                    {benefit.icon}
                                </div>
                                <div>
                                    <h3 className="text-base leading-tight font-bold text-white sm:text-lg">
                                        {benefit.title}
                                    </h3>
                                    <p className="mt-1 max-w-[240px] text-xs leading-5 text-white/80 sm:text-sm sm:leading-6">
                                        {benefit.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
