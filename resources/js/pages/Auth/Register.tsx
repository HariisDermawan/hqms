import { Head, Link } from '@inertiajs/react';
import { useState, type FormEvent } from 'react';
import { register } from '@/api/auth';

export default function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [processing, setProcessing] = useState(false);

    const [errors, setErrors] = useState<{
        name?: string;
        email?: string;
        password?: string;
        password_confirmation?: string;
        general?: string;
    }>({});

    const handleRegister = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        setProcessing(true);
        setErrors({});

        try {
            await register({
                name,
                email,
                password,
                password_confirmation: passwordConfirmation,
            });

            window.location.href = '/login';
        } catch (error: any) {
            if (error.response?.status === 422) {
                setErrors({
                    name: error.response.data?.errors?.name?.[0],
                    email: error.response.data?.errors?.email?.[0],
                    password: error.response.data?.errors?.password?.[0],
                    password_confirmation:
                        error.response.data?.errors?.password?.[0],
                    general: error.response.data?.message,
                });
            } else {
                setErrors({
                    general: 'Terjadi kesalahan saat mendaftar.',
                });
            }
        } finally {
            setProcessing(false);
        }
    };

    return (
        <>
            <Head title="Register" />

            <div className="flex min-h-screen items-center justify-center bg-[#eef4f8] lg:p-8">
                <div className="min-h-screen w-full overflow-hidden bg-white lg:min-h-0 lg:w-[410px] lg:rounded-[24px] lg:shadow-[0_15px_50px_rgba(0,0,0,0.10)]">
                    {/* HEADER */}
                    <div className="relative h-[222px] rounded-b-[50%] bg-[#084e7a] lg:h-[225px]">
                        <div className="absolute top-[34px] right-0 left-0 flex flex-col items-center">
                            <div className="relative flex items-center justify-center">
                                <div className="flex h-[60px] w-[70px] items-end justify-center rounded-t-lg rounded-b-sm bg-white pb-2">
                                    <div className="grid grid-cols-2 gap-[8px]">
                                        <div className="h-[13px] w-[11px] bg-[#084e7a]" />
                                        <div className="h-[13px] w-[11px] bg-[#084e7a]" />
                                        <div className="h-[13px] w-[11px] bg-[#084e7a]" />
                                        <div className="h-[13px] w-[11px] bg-[#084e7a]" />
                                    </div>
                                </div>

                                <div className="absolute -top-[14px] flex h-[35px] w-[35px] items-center justify-center rounded-lg bg-white">
                                    <div className="flex h-[27px] w-[27px] items-center justify-center rounded-md border-[3px] border-[#084e7a]">
                                        <span className="text-[24px] leading-none font-bold text-[#084e7a]">
                                            +
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <h1 className="mt-[10px] text-[21px] font-bold text-white">
                                Rs Merdeka
                            </h1>
                        </div>
                    </div>

                    {/* FORM */}
                    <div className="px-[36px] pt-[34px] pb-[40px]">
                        <form onSubmit={handleRegister}>
                            {errors.general && (
                                <div className="mb-[15px] rounded-[10px] bg-red-50 px-3 py-2 text-[12px] text-red-500">
                                    {errors.general}
                                </div>
                            )}

                            {/* NAMA */}
                            <div className="mb-[10px]">
                                <label
                                    htmlFor="name"
                                    className="mb-[4px] block text-[13px] text-[#333]"
                                >
                                    Nama
                                </label>

                                <input
                                    id="name"
                                    type="text"
                                    value={name}
                                    onChange={(event) =>
                                        setName(event.target.value)
                                    }
                                    placeholder="Masukan Nama"
                                    autoComplete="name"
                                    className="h-[42px] w-full rounded-[12px] bg-[#d9d9d9] px-[12px] text-[13px] text-gray-700 transition outline-none placeholder:text-[#999] focus:bg-[#d5d5d5] focus:ring-2 focus:ring-[#084e7a]/30"
                                />

                                {errors.name && (
                                    <p className="mt-1 text-[11px] text-red-500">
                                        {errors.name}
                                    </p>
                                )}
                            </div>

                            {/* EMAIL */}
                            <div className="mb-[10px]">
                                <label
                                    htmlFor="email"
                                    className="mb-[4px] block text-[13px] text-[#333]"
                                >
                                    Email
                                </label>

                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(event) =>
                                        setEmail(event.target.value)
                                    }
                                    placeholder="Masukan Email"
                                    autoComplete="email"
                                    className="h-[42px] w-full rounded-[12px] bg-[#d9d9d9] px-[12px] text-[13px] text-gray-700 transition outline-none placeholder:text-[#999] focus:bg-[#d5d5d5] focus:ring-2 focus:ring-[#084e7a]/30"
                                />

                                {errors.email && (
                                    <p className="mt-1 text-[11px] text-red-500">
                                        {errors.email}
                                    </p>
                                )}
                            </div>

                            {/* PASSWORD */}
                            <div className="mb-[10px]">
                                <label
                                    htmlFor="password"
                                    className="mb-[4px] block text-[13px] text-[#333]"
                                >
                                    Password
                                </label>

                                <input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(event) =>
                                        setPassword(event.target.value)
                                    }
                                    placeholder="Masukan Password"
                                    autoComplete="new-password"
                                    className="h-[42px] w-full rounded-[12px] bg-[#d9d9d9] px-[12px] text-[13px] text-gray-700 transition outline-none placeholder:text-[#999] focus:bg-[#d5d5d5] focus:ring-2 focus:ring-[#084e7a]/30"
                                />

                                {errors.password && (
                                    <p className="mt-1 text-[11px] text-red-500">
                                        {errors.password}
                                    </p>
                                )}
                            </div>

                            {/* KONFIRMASI PASSWORD */}
                            <div className="mb-[30px]">
                                <label
                                    htmlFor="password_confirmation"
                                    className="mb-[4px] block text-[13px] text-[#333]"
                                >
                                    Konfirmasi Password
                                </label>

                                <input
                                    id="password_confirmation"
                                    type="password"
                                    value={passwordConfirmation}
                                    onChange={(event) =>
                                        setPasswordConfirmation(
                                            event.target.value,
                                        )
                                    }
                                    placeholder="Ulangi Password"
                                    autoComplete="new-password"
                                    className="h-[42px] w-full rounded-[12px] bg-[#d9d9d9] px-[12px] text-[13px] text-gray-700 transition outline-none placeholder:text-[#999] focus:bg-[#d5d5d5] focus:ring-2 focus:ring-[#084e7a]/30"
                                />

                                {errors.password_confirmation && (
                                    <p className="mt-1 text-[11px] text-red-500">
                                        {errors.password_confirmation}
                                    </p>
                                )}
                            </div>

                            {/* REGISTER */}
                            <button
                                type="submit"
                                disabled={processing}
                                className="h-[43px] w-full rounded-[12px] bg-[#084e7a] text-[13px] font-bold text-white transition-all duration-200 hover:bg-[#063f62] hover:shadow-md active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {processing ? 'Registering...' : 'Register'}
                            </button>
                        </form>

                        {/* LOGIN */}
                        <div className="mt-[14px] flex justify-center">
                            <p className="text-[12px] text-gray-500">
                                Sudah punya akun?{' '}
                                <Link
                                    href="/login"
                                    className="font-medium text-[#73a1bd] transition hover:text-[#084e7a]"
                                >
                                    Login
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
