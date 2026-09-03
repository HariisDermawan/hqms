import { Head, Link } from '@inertiajs/react';
import { useState, type FormEvent } from 'react';
import { login } from '@/api/auth';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [processing, setProcessing] = useState(false);

    const [errors, setErrors] = useState<{
        email?: string;
        password?: string;
        general?: string;
    }>({});

    const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        setProcessing(true);
        setErrors({});

        try {
            await login({
                email,
                password,
            });

            window.location.href = '/dashboard';
        } catch (error: any) {
            if (error.response?.status === 422) {
                setErrors({
                    email: error.response.data?.errors?.email?.[0],
                    password: error.response.data?.errors?.password?.[0],
                    general: error.response.data?.message,
                });
            } else if (error.response?.status === 401) {
                setErrors({
                    general:
                        error.response.data?.message ??
                        'Email atau password salah.',
                });
            } else {
                setErrors({
                    general: 'Terjadi kesalahan saat login.',
                });
            }
        } finally {
            setProcessing(false);
        }
    };

    return (
        <>
            <Head title="Login" />

            <div className="flex min-h-screen items-center justify-center bg-[#eef4f8] lg:p-8">
                <div className="min-h-screen w-full overflow-hidden bg-white lg:min-h-0 lg:w-[410px] lg:rounded-[24px] lg:shadow-[0_15px_50px_rgba(0,0,0,0.10)]">
                    {/* HEADER */}
                    <div className="relative h-[222px] rounded-b-[50%] bg-[#084e7a] lg:h-[225px]">
                        <div className="absolute top-[34px] right-0 left-0 flex flex-col items-center">
                            <img
                                src="/assets/rs.png"
                                alt="Rs Merdeka"
                                className="h-[130px] w-[130px] object-contain"
                            />
                        </div>
                    </div>
                    {/* FORM */}
                    <div className="px-[36px] pt-[39px] pb-[40px]">
                        <form onSubmit={handleLogin}>
                            {errors.general && (
                                <div className="mb-[15px] rounded-[10px] bg-red-50 px-3 py-2 text-[12px] text-red-500">
                                    {errors.general}
                                </div>
                            )}

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
                            <div className="mb-[30px]">
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
                                    autoComplete="current-password"
                                    className="h-[42px] w-full rounded-[12px] bg-[#d9d9d9] px-[12px] text-[13px] text-gray-700 transition outline-none placeholder:text-[#999] focus:bg-[#d5d5d5] focus:ring-2 focus:ring-[#084e7a]/30"
                                />

                                {errors.password && (
                                    <p className="mt-1 text-[11px] text-red-500">
                                        {errors.password}
                                    </p>
                                )}
                            </div>

                            {/* LOGIN */}
                            <button
                                type="submit"
                                disabled={processing}
                                className="h-[43px] w-full rounded-[12px] bg-[#084e7a] text-[13px] font-bold text-white transition-all duration-200 hover:bg-[#063f62] hover:shadow-md active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {processing ? 'Logging in...' : 'Login'}
                            </button>
                        </form>

                        {/* FORGOT PASSWORD */}
                        <div className="mt-[14px] flex justify-end">
                            <Link
                                href="/forgot-password"
                                className="text-[12px] text-[#73a1bd] transition hover:text-[#084e7a]"
                            >
                                Forgot Password
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
