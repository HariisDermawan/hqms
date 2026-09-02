import { Head } from '@inertiajs/react';
import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { me, updatePassword, updateProfile, type User } from '@/api/auth';
import AppLayout from '@/Layouts/AppLayout';

const inputClass =
    'w-full h-[42px] px-[12px] rounded-[12px] bg-[#d9d9d9] text-[13px] text-gray-700 placeholder:text-[#999] outline-none focus:bg-[#d5d5d5] focus:ring-2 focus:ring-[#084e7a]/30 transition';

const labelClass = 'block text-[13px] text-[#333] mb-[4px]';

const formatDate = (value: string | null): string => {
    if (!value) {
        return '—';
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return '—';
    }

    return date.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    });
};

const getInitials = (name: string): string =>
    name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part.charAt(0).toUpperCase())
        .join('');

export default function ProfileIndex() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [profileProcessing, setProfileProcessing] = useState(false);
    const [profileErrors, setProfileErrors] = useState<Record<string, string>>(
        {},
    );
    const [profileMessage, setProfileMessage] = useState('');

    const [currentPassword, setCurrentPassword] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [passwordProcessing, setPasswordProcessing] = useState(false);
    const [passwordErrors, setPasswordErrors] = useState<
        Record<string, string>
    >({});
    const [passwordMessage, setPasswordMessage] = useState('');

    const loadUser = useCallback(async (): Promise<void> => {
        try {
            const response = await me();

            const loaded = response.data?.user ?? null;

            setUser(loaded);
            setName(loaded?.name ?? '');
            setEmail(loaded?.email ?? '');
        } catch (error: any) {
            console.error('Gagal memuat profil', error);

            if (error.response?.status === 401) {
                window.location.href = '/login';
            }
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void loadUser();
    }, [loadUser]);

    const handleProfileSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        setProfileProcessing(true);
        setProfileErrors({});
        setProfileMessage('');

        try {
            const response = await updateProfile({ name, email });

            setUser(response.data?.user ?? null);
            setProfileMessage('Profil berhasil diperbarui.');
        } catch (error: any) {
            console.error('Gagal memperbarui profil', error);

            if (error.response?.status === 422) {
                setProfileErrors({
                    general: error.response.data?.message,
                    ...error.response.data?.errors,
                });

                return;
            }

            if (error.response?.status === 401) {
                window.location.href = '/login';
                return;
            }

            setProfileErrors({
                general:
                    error.response?.data?.message ||
                    'Gagal memperbarui profil.',
            });
        } finally {
            setProfileProcessing(false);
        }
    };

    const handlePasswordSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        setPasswordProcessing(true);
        setPasswordErrors({});
        setPasswordMessage('');

        try {
            await updatePassword({
                current_password: currentPassword,
                password,
                password_confirmation: passwordConfirmation,
            });

            setCurrentPassword('');
            setPassword('');
            setPasswordConfirmation('');
            setPasswordMessage('Kata sandi berhasil diperbarui.');
        } catch (error: any) {
            console.error('Gagal memperbarui kata sandi', error);

            if (error.response?.status === 422) {
                setPasswordErrors({
                    general: error.response.data?.message,
                    ...error.response.data?.errors,
                });

                return;
            }

            if (error.response?.status === 401) {
                window.location.href = '/login';
                return;
            }

            setPasswordErrors({
                general:
                    error.response?.data?.message ||
                    'Gagal memperbarui kata sandi.',
            });
        } finally {
            setPasswordProcessing(false);
        }
    };

    return (
        <>
            <Head title="Profile" />

            <AppLayout wide>
                <div>
                    <h2 className="text-lg font-bold text-gray-800 sm:text-xl">
                        Profile
                    </h2>

                    <p className="mt-1 text-xs text-gray-400 sm:text-sm">
                        Kelola informasi akun Anda
                    </p>
                </div>

                {loading ? (
                    <div className="mt-4 rounded-xl bg-white p-10 text-center text-sm text-gray-400 shadow-sm">
                        Memuat data profil...
                    </div>
                ) : (
                    <div className="mt-4 grid gap-4 lg:grid-cols-5">
                        {/* SUMMARY */}
                        <div className="lg:col-span-2">
                            <div className="rounded-xl bg-white p-6 shadow-sm">
                                <div className="flex flex-col items-center text-center">
                                    <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#07577f]/10">
                                        <span className="text-3xl font-bold text-[#07577f]">
                                            {user
                                                ? getInitials(user.name) || '?'
                                                : '?'}
                                        </span>
                                    </div>

                                    <h3 className="mt-4 text-lg font-bold text-gray-800">
                                        {user?.name ?? '-'}
                                    </h3>

                                    <p className="text-[13px] text-gray-500">
                                        {user?.email ?? '-'}
                                    </p>

                                    {user?.roles?.length ? (
                                        <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
                                            {user.roles.map((role) => (
                                                <span
                                                    key={role}
                                                    className="rounded-md bg-[#07577f]/10 px-2 py-0.5 text-[11px] font-bold text-[#07577f]"
                                                >
                                                    {role}
                                                </span>
                                            ))}
                                        </div>
                                    ) : (
                                        <span className="mt-3 rounded-md bg-gray-100 px-2 py-0.5 text-[11px] font-bold text-gray-500">
                                            — Role —
                                        </span>
                                    )}
                                </div>

                                <div className="mt-6 border-t border-gray-100 pt-5">
                                    <p className="text-[11px] font-semibold tracking-[0.14em] text-gray-400 uppercase">
                                        Terdaftar
                                    </p>

                                    <p className="mt-1 text-[13px] font-semibold text-gray-700">
                                        {formatDate(user?.created_at ?? null)}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* FORMS */}
                        <div className="lg:col-span-3">
                            {/* UPDATE PROFILE */}
                            <form
                                onSubmit={handleProfileSubmit}
                                className="rounded-xl bg-white p-5 shadow-sm sm:p-6"
                            >
                                <h3 className="text-[13px] font-bold text-gray-800">
                                    Informasi Akun
                                </h3>

                                {profileMessage && (
                                    <div className="mt-4 rounded-[10px] bg-green-50 px-3 py-2 text-[12px] text-green-600">
                                        {profileMessage}
                                    </div>
                                )}

                                {profileErrors.general && (
                                    <div className="mt-4 rounded-[10px] bg-red-50 px-3 py-2 text-[12px] text-red-500">
                                        {profileErrors.general}
                                    </div>
                                )}

                                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div>
                                        <label
                                            htmlFor="name"
                                            className={labelClass}
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
                                            className={inputClass}
                                        />

                                        {profileErrors.name && (
                                            <p className="mt-1 text-[11px] text-red-500">
                                                {profileErrors.name}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="email"
                                            className={labelClass}
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
                                            className={inputClass}
                                        />

                                        {profileErrors.email && (
                                            <p className="mt-1 text-[11px] text-red-500">
                                                {profileErrors.email}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="mt-6 flex items-center justify-end gap-3">
                                    <button
                                        type="submit"
                                        disabled={profileProcessing}
                                        className="h-[43px] rounded-[12px] bg-[#084e7a] px-6 text-[13px] font-bold text-white transition hover:bg-[#063f62] hover:shadow-md active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        {profileProcessing
                                            ? 'Menyimpan...'
                                            : 'Simpan Profil'}
                                    </button>
                                </div>
                            </form>

                            {/* UPDATE PASSWORD */}
                            <form
                                onSubmit={handlePasswordSubmit}
                                className="mt-4 rounded-xl bg-white p-5 shadow-sm sm:p-6"
                            >
                                <h3 className="text-[13px] font-bold text-gray-800">
                                    Ubah Kata Sandi
                                </h3>

                                {passwordMessage && (
                                    <div className="mt-4 rounded-[10px] bg-green-50 px-3 py-2 text-[12px] text-green-600">
                                        {passwordMessage}
                                    </div>
                                )}

                                {passwordErrors.general && (
                                    <div className="mt-4 rounded-[10px] bg-red-50 px-3 py-2 text-[12px] text-red-500">
                                        {passwordErrors.general}
                                    </div>
                                )}

                                <div className="mt-4 grid grid-cols-1 gap-4">
                                    <div>
                                        <label
                                            htmlFor="current_password"
                                            className={labelClass}
                                        >
                                            Kata sandi saat ini
                                        </label>

                                        <input
                                            id="current_password"
                                            type="password"
                                            value={currentPassword}
                                            onChange={(event) =>
                                                setCurrentPassword(
                                                    event.target.value,
                                                )
                                            }
                                            className={inputClass}
                                        />

                                        {passwordErrors.current_password && (
                                            <p className="mt-1 text-[11px] text-red-500">
                                                {
                                                    passwordErrors.current_password
                                                }
                                            </p>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        <div>
                                            <label
                                                htmlFor="password"
                                                className={labelClass}
                                            >
                                                Kata sandi baru
                                            </label>

                                            <input
                                                id="password"
                                                type="password"
                                                value={password}
                                                onChange={(event) =>
                                                    setPassword(
                                                        event.target.value,
                                                    )
                                                }
                                                className={inputClass}
                                            />

                                            {passwordErrors.password && (
                                                <p className="mt-1 text-[11px] text-red-500">
                                                    {passwordErrors.password}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <label
                                                htmlFor="password_confirmation"
                                                className={labelClass}
                                            >
                                                Ulangi kata sandi
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
                                                className={inputClass}
                                            />

                                            {passwordErrors.password_confirmation && (
                                                <p className="mt-1 text-[11px] text-red-500">
                                                    {
                                                        passwordErrors.password_confirmation
                                                    }
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 flex items-center justify-end gap-3">
                                    <button
                                        type="submit"
                                        disabled={passwordProcessing}
                                        className="h-[43px] rounded-[12px] bg-[#084e7a] px-6 text-[13px] font-bold text-white transition hover:bg-[#063f62] hover:shadow-md active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        {passwordProcessing
                                            ? 'Menyimpan...'
                                            : 'Ubah Kata Sandi'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </AppLayout>
        </>
    );
}
