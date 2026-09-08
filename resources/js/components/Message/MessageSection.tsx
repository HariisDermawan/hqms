import { postKioskMessage } from '@/api/kiosk';
import { useState, type FormEvent } from 'react';

interface FormValues {
    name: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
}

const initialValues: FormValues = {
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
};

export default function MessageSection() {
    const [values, setValues] = useState<FormValues>(initialValues);
    const [errors, setErrors] = useState<
        Partial<Record<keyof FormValues, string>>
    >({});
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [failed, setFailed] = useState('');

    const handleChange = (field: keyof FormValues, value: string) => {
        setValues((prev) => ({ ...prev, [field]: value }));
        setErrors((prev) => ({ ...prev, [field]: undefined }));
    };

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();

        setSubmitting(true);
        setFailed('');

        try {
            const response = await postKioskMessage({
                name: values.name,
                email: values.email,
                phone: values.phone || null,
                subject: values.subject || null,
                message: values.message,
            });

            if (response.data?.message) {
                setSuccess(true);
                setValues(initialValues);
            }
        } catch (error) {
            const payload = error as {
                response?: {
                    data?: {
                        errors?: Partial<Record<keyof FormValues, string[]>>;
                        message?: string;
                    };
                };
            };

            if (payload.response?.data?.errors) {
                setErrors(
                    Object.fromEntries(
                        Object.entries(payload.response.data.errors).map(
                            ([key, messages]) => [key, (messages ?? [])[0]],
                        ),
                    ) as Partial<Record<keyof FormValues, string>>,
                );
            } else {
                setFailed(
                    payload.response?.data?.message ??
                        'Terjadi kesalahan. Coba lagi nanti.',
                );
            }
        } finally {
            setSubmitting(false);
        }
    };

    const inputClass = (hasError: boolean) =>
        `w-full rounded-xl border bg-white px-4 py-3 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 ${
            hasError
                ? 'border-red-300 focus:border-red-400 focus:ring-red-100'
                : 'border-slate-200 focus:border-[#0284c7] focus:ring-[#0284c7]/10'
        }`;

    return (
        <section className="relative overflow-hidden bg-[#0a3d5c] py-16 sm:py-20">
            <div
                className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: "url('/banner/bn1.png')" }}
            />

            <div className="absolute inset-0 z-[1] bg-gradient-to-r from-[#0a3d5c]/95 via-[#0a3d5c]/90 to-[#0a3d5c]/80" />

            <div className="relative z-10 mx-auto w-full max-w-7xl px-5 sm:px-8 md:px-10 lg:px-14">
                <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
                    <div className="hidden lg:block">
                        <img
                            src="/banner/hero.png"
                            alt="RS Medika HRS"
                            className="h-[560px] w-full rounded-3xl object-cover shadow-2xl ring-1 ring-white/20"
                        />
                    </div>

                    <div className="rounded-3xl bg-white p-8 shadow-xl sm:p-10">
                        <div className="mb-8">
                            <span className="text-xs font-bold tracking-widest text-[#0284c7] uppercase">
                                Pesan
                            </span>

                            <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-[#075985] sm:text-3xl">
                                Kirim Pesan untuk Kami
                            </h2>

                            <p className="mt-1 text-sm text-slate-500 sm:text-base">
                                Masukan, saran, atau pertanyaan Anda sangat
                                berarti
                            </p>
                        </div>
                        {success ? (
                            <div className="flex flex-col items-center py-8 text-center">
                                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-7 w-7"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                    >
                                        <path d="M20 6L9 17l-5-5" />
                                    </svg>
                                </div>

                                <h3 className="mt-4 text-lg font-bold text-slate-800">
                                    Pesan Terkirim
                                </h3>

                                <p className="mt-1 text-sm text-slate-500">
                                    Terima kasih! Pesan Anda sudah kami terima
                                    dan akan segera kami balas.
                                </p>

                                <button
                                    type="button"
                                    onClick={() => setSuccess(false)}
                                    className="mt-6 rounded-xl bg-[#0284c7] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#075985]"
                                >
                                    Kirim Pesan Lain
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} noValidate>
                                <div className="grid gap-5 sm:grid-cols-2">
                                    <div>
                                        <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                            Nama Lengkap
                                        </label>

                                        <input
                                            type="text"
                                            value={values.name}
                                            onChange={(event) =>
                                                handleChange(
                                                    'name',
                                                    event.target.value,
                                                )
                                            }
                                            className={inputClass(
                                                Boolean(errors.name),
                                            )}
                                            placeholder="Nama Anda"
                                        />

                                        {errors.name && (
                                            <p className="mt-1 text-xs text-red-500">
                                                {errors.name}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                            Email
                                        </label>

                                        <input
                                            type="email"
                                            value={values.email}
                                            onChange={(event) =>
                                                handleChange(
                                                    'email',
                                                    event.target.value,
                                                )
                                            }
                                            className={inputClass(
                                                Boolean(errors.email),
                                            )}
                                            placeholder="email@contoh.com"
                                        />

                                        {errors.email && (
                                            <p className="mt-1 text-xs text-red-500">
                                                {errors.email}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                            No. HP{' '}
                                            <span className="text-slate-400">
                                                (opsional)
                                            </span>
                                        </label>

                                        <input
                                            type="text"
                                            value={values.phone}
                                            onChange={(event) =>
                                                handleChange(
                                                    'phone',
                                                    event.target.value,
                                                )
                                            }
                                            className={inputClass(
                                                Boolean(errors.phone),
                                            )}
                                            placeholder="08xxxxxxxxxx"
                                        />

                                        {errors.phone && (
                                            <p className="mt-1 text-xs text-red-500">
                                                {errors.phone}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                            Subjek{' '}
                                            <span className="text-slate-400">
                                                (opsional)
                                            </span>
                                        </label>

                                        <input
                                            type="text"
                                            value={values.subject}
                                            onChange={(event) =>
                                                handleChange(
                                                    'subject',
                                                    event.target.value,
                                                )
                                            }
                                            className={inputClass(
                                                Boolean(errors.subject),
                                            )}
                                            placeholder="Perihal pesan"
                                        />

                                        {errors.subject && (
                                            <p className="mt-1 text-xs text-red-500">
                                                {errors.subject}
                                            </p>
                                        )}
                                    </div>

                                    <div className="sm:col-span-2">
                                        <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                            Isi Pesan
                                        </label>

                                        <textarea
                                            rows={5}
                                            value={values.message}
                                            onChange={(event) =>
                                                handleChange(
                                                    'message',
                                                    event.target.value,
                                                )
                                            }
                                            className={inputClass(
                                                Boolean(errors.message),
                                            )}
                                            placeholder="Tulis pesan Anda di sini..."
                                        />

                                        {errors.message && (
                                            <p className="mt-1 text-xs text-red-500">
                                                {errors.message}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {failed && (
                                    <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                                        {failed}
                                    </p>
                                )}

                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="mt-6 w-full rounded-xl bg-[#0284c7] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#075985] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                                >
                                    {submitting ? 'Mengirim...' : 'Kirim Pesan'}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
