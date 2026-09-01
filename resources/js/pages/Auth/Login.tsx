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

            <div className="min-h-screen bg-[#eef4f8] flex items-center justify-center lg:p-8">
                <div
                    className="
                        w-full
                        min-h-screen
                        bg-white
                        overflow-hidden
                        lg:min-h-0
                        lg:w-[410px]
                        lg:rounded-[24px]
                        lg:shadow-[0_15px_50px_rgba(0,0,0,0.10)]
                    "
                >
                    {/* HEADER */}
                    <div
                        className="
                            relative
                            h-[222px]
                            bg-[#084e7a]
                            rounded-b-[50%]
                            lg:h-[225px]
                        "
                    >
                        <div className="absolute top-[34px] left-0 right-0 flex flex-col items-center">
                            <div className="relative flex items-center justify-center">
                                <div
                                    className="
                                        w-[70px]
                                        h-[60px]
                                        bg-white
                                        rounded-t-lg
                                        rounded-b-sm
                                        flex
                                        items-end
                                        justify-center
                                        pb-2
                                    "
                                >
                                    <div className="grid grid-cols-2 gap-[8px]">
                                        <div className="w-[11px] h-[13px] bg-[#084e7a]" />
                                        <div className="w-[11px] h-[13px] bg-[#084e7a]" />
                                        <div className="w-[11px] h-[13px] bg-[#084e7a]" />
                                        <div className="w-[11px] h-[13px] bg-[#084e7a]" />
                                    </div>
                                </div>

                                <div
                                    className="
                                        absolute
                                        -top-[14px]
                                        w-[35px]
                                        h-[35px]
                                        bg-white
                                        rounded-lg
                                        flex
                                        items-center
                                        justify-center
                                    "
                                >
                                    <div
                                        className="
                                            w-[27px]
                                            h-[27px]
                                            border-[3px]
                                            border-[#084e7a]
                                            rounded-md
                                            flex
                                            items-center
                                            justify-center
                                        "
                                    >
                                        <span className="text-[#084e7a] text-[24px] font-bold leading-none">
                                            +
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <h1 className="mt-[10px] text-white text-[21px] font-bold">
                                Rs Merdeka
                            </h1>
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
                                    className="block text-[13px] text-[#333] mb-[4px]"
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
                                    className="
                                        w-full
                                        h-[42px]
                                        px-[12px]
                                        rounded-[12px]
                                        bg-[#d9d9d9]
                                        text-[13px]
                                        text-gray-700
                                        placeholder:text-[#999]
                                        outline-none
                                        focus:bg-[#d5d5d5]
                                        focus:ring-2
                                        focus:ring-[#084e7a]/30
                                        transition
                                    "
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
                                    className="block text-[13px] text-[#333] mb-[4px]"
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
                                    className="
                                        w-full
                                        h-[42px]
                                        px-[12px]
                                        rounded-[12px]
                                        bg-[#d9d9d9]
                                        text-[13px]
                                        text-gray-700
                                        placeholder:text-[#999]
                                        outline-none
                                        focus:bg-[#d5d5d5]
                                        focus:ring-2
                                        focus:ring-[#084e7a]/30
                                        transition
                                    "
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
                                className="
                                    w-full
                                    h-[43px]
                                    rounded-[12px]
                                    bg-[#084e7a]
                                    text-white
                                    text-[13px]
                                    font-bold
                                    hover:bg-[#063f62]
                                    hover:shadow-md
                                    active:scale-[0.99]
                                    transition-all
                                    duration-200
                                    disabled:opacity-60
                                    disabled:cursor-not-allowed
                                "
                            >
                                {processing ? 'Logging in...' : 'Login'}
                            </button>
                        </form>

                        {/* FORGOT PASSWORD */}
                        <div className="flex justify-end mt-[14px]">
                            <Link
                                href="/forgot-password"
                                className="
                                    text-[#73a1bd]
                                    text-[12px]
                                    hover:text-[#084e7a]
                                    transition
                                "
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

