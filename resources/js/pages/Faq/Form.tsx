import { Link } from '@inertiajs/react';
import { useState, type FormEvent } from 'react';
import { type Faq, type FaqPayload } from '@/api/faq';

interface FaqFormProps {
    initial?: Faq | null;
    processing: boolean;
    errors?: Record<string, string | undefined> & {
        general?: string;
    };
    onSubmit: (payload: FaqPayload) => void;
}

const inputClass =
    'w-full h-[42px] px-[12px] rounded-[12px] bg-[#d9d9d9] text-[13px] text-gray-700 placeholder:text-[#999] outline-none focus:bg-[#d5d5d5] focus:ring-2 focus:ring-[#084e7a]/30 transition';

const labelClass = 'block text-[13px] text-[#333] mb-[4px]';

export default function FaqForm({
    initial,
    processing,
    errors = {},
    onSubmit,
}: FaqFormProps) {
    const [question, setQuestion] = useState(initial?.question ?? '');
    const [answer, setAnswer] = useState(initial?.answer ?? '');
    const [sortOrder, setSortOrder] = useState(
        initial?.sort_order?.toString() ?? '0',
    );
    const [isActive, setIsActive] = useState(initial?.is_active ?? true);

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        onSubmit({
            question: question.trim(),
            answer: answer.trim(),
            sort_order: Number(sortOrder),
            is_active: isActive,
        });
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="mt-4 rounded-xl bg-white p-5 shadow-sm sm:p-6"
        >
            {errors.general && (
                <div className="mb-4 rounded-[10px] bg-red-50 px-3 py-2 text-[12px] text-red-500">
                    {errors.general}
                </div>
            )}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* PERTANYAAN */}
                <div className="sm:col-span-2">
                    <label htmlFor="question" className={labelClass}>
                        Pertanyaan
                    </label>

                    <input
                        id="question"
                        value={question}
                        onChange={(event) => setQuestion(event.target.value)}
                        placeholder="Tuliskan pertanyaan yang sering diajukan..."
                        className={inputClass}
                    />

                    {errors.question && (
                        <p className="mt-1 text-[11px] text-red-500">
                            {errors.question}
                        </p>
                    )}
                </div>

                {/* JAWABAN */}
                <div className="sm:col-span-2">
                    <label htmlFor="answer" className={labelClass}>
                        Jawaban
                    </label>

                    <textarea
                        id="answer"
                        value={answer}
                        onChange={(event) => setAnswer(event.target.value)}
                        rows={5}
                        placeholder="Tuliskan jawaban dari pertanyaan tersebut..."
                        className="w-full rounded-[12px] bg-[#d9d9d9] px-[12px] py-[10px] text-[13px] text-gray-700 transition outline-none placeholder:text-[#999] focus:bg-[#d5d5d5] focus:ring-2 focus:ring-[#084e7a]/30"
                    />

                    {errors.answer && (
                        <p className="mt-1 text-[11px] text-red-500">
                            {errors.answer}
                        </p>
                    )}
                </div>

                {/* URUTAN */}
                <div>
                    <label htmlFor="sort_order" className={labelClass}>
                        Urutan
                    </label>

                    <input
                        id="sort_order"
                        type="number"
                        min={0}
                        value={sortOrder}
                        onChange={(event) => setSortOrder(event.target.value)}
                        className={inputClass}
                    />

                    {errors.sort_order && (
                        <p className="mt-1 text-[11px] text-red-500">
                            {errors.sort_order}
                        </p>
                    )}
                </div>

                {/* STATUS */}
                <div className="flex items-end pb-[10px]">
                    <label className="flex cursor-pointer items-center gap-2 text-[13px] text-[#333]">
                        <input
                            type="checkbox"
                            checked={isActive}
                            onChange={(event) =>
                                setIsActive(event.target.checked)
                            }
                            className="h-4 w-4 accent-[#084e7a]"
                        />

                        <span>Tampilkan di publik</span>
                    </label>

                    {errors.is_active && (
                        <p className="ml-1 text-[11px] text-red-500">
                            {errors.is_active}
                        </p>
                    )}
                </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
                <Link
                    href={initial ? `/faqs/${initial.id}` : '/faqs'}
                    className="h-[43px] rounded-[12px] bg-[#d9d9d9] px-5 text-[13px] font-bold text-gray-600 transition hover:bg-[#c9c9c9]"
                >
                    Batal
                </Link>

                <button
                    type="submit"
                    disabled={processing}
                    className="h-[43px] rounded-[12px] bg-[#084e7a] px-6 text-[13px] font-bold text-white transition hover:bg-[#063f62] hover:shadow-md active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {processing
                        ? 'Menyimpan...'
                        : initial
                          ? 'Simpan Perubahan'
                          : 'Simpan FAQ'}
                </button>
            </div>
        </form>
    );
}
