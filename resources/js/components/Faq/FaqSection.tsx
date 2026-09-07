import { getKioskFaqs } from '@/api/kiosk';
import { useEffect, useState } from 'react';

export default function FaqSection() {
    const [faqs, setFaqs] = useState<
        { id: number; question: string; answer: string }[]
    >([]);
    const [loading, setLoading] = useState(true);
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    useEffect(() => {
        let active = true;

        const load = async () => {
            try {
                const response = await getKioskFaqs();

                if (!active) {
                    return;
                }

                setFaqs(
                    (response.data?.items ?? []).map((faq) => ({
                        id: faq.id,
                        question: faq.question,
                        answer: faq.answer,
                    })),
                );
            } catch {
                if (active) {
                    setFaqs([]);
                }
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        };

        void load();

        return () => {
            active = false;
        };
    }, []);

    return (
        <section className="bg-[#f8fafc] py-16 sm:py-20">
            <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 md:px-10 lg:px-14">
                <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
                    <div className="relative hidden overflow-hidden rounded-3xl shadow-lg lg:block">
                        <img
                            src="/banner/hero.png"
                            alt="FAQ Rumah Sakit Medika HRS"
                            className="h-full w-full object-cover"
                        />
                    </div>

                    <div>
                        <div className="mb-6 sm:mb-8">
                            <span className="text-xs font-bold tracking-widest text-[#0284c7] uppercase">
                                FAQ
                            </span>

                            <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-[#075985] sm:text-3xl">
                                Pertanyaan yang Sering Diajukan
                            </h2>

                            <p className="mt-1 text-sm text-slate-500 sm:text-base">
                                Temukan jawaban atas pertanyaan seputar layanan
                                rumah sakit
                            </p>
                        </div>

                        {loading ? (
                            <div className="space-y-4">
                                {Array.from({ length: 4 }).map((_, index) => (
                                    <div
                                        key={index}
                                        className="h-[72px] animate-pulse rounded-2xl bg-slate-200/70"
                                    />
                                ))}
                            </div>
                        ) : faqs.length === 0 ? (
                            <p className="py-12 text-center text-sm text-slate-500">
                                Belum ada FAQ untuk ditampilkan.
                            </p>
                        ) : (
                            <div className="space-y-3">
                                {faqs.map((faq, index) => {
                                    const isOpen = openIndex === index;

                                    return (
                                        <div
                                            key={faq.id}
                                            className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:border-[#0284c7]/40"
                                        >
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setOpenIndex(
                                                        isOpen ? null : index,
                                                    )
                                                }
                                                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition hover:bg-slate-50"
                                                aria-expanded={isOpen}
                                            >
                                                <span className="text-sm leading-snug font-semibold text-slate-800 sm:text-base">
                                                    {faq.question}
                                                </span>

                                                <span
                                                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-slate-200 text-slate-400 transition ${
                                                        isOpen
                                                            ? 'rotate-45 border-[#0284c7] bg-[#0284c7] text-white'
                                                            : ''
                                                    }`}
                                                >
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className="h-3.5 w-3.5"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2.5"
                                                    >
                                                        <path d="M12 5v14M5 12h14" />
                                                    </svg>
                                                </span>
                                            </button>

                                            {isOpen && (
                                                <div className="border-t border-slate-100 px-5 py-4 text-sm leading-relaxed whitespace-pre-line text-slate-500">
                                                    {faq.answer}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
