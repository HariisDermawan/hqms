import { Head } from '@inertiajs/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { scanAttendance, type AttendanceScanResult } from '@/api/attendance';

type FeedbackKind =
    | 'success'
    | 'complete'
    | 'duplicate'
    | 'not_found'
    | 'error';

interface Feedback {
    kind: FeedbackKind;
    result?: AttendanceScanResult;
    message: string;
}

const AUTO_DISMISS_MS = 5_000;

const ACTIONS: Record<'in' | 'out', { title: string; subtitle: string }> = {
    in: { title: 'Check-in Berhasil', subtitle: 'Selamat bekerja' },
    out: {
        title: 'Check-out Berhasil',
        subtitle: 'Terima kasih, sampai jumpa',
    },
};

const formatTime = (value?: string | null): string =>
    value ? value.slice(0, 5) : '--:--';

export default function AbsenKaryawan() {
    const [clock, setClock] = useState(() => new Date());
    const [feedback, setFeedback] = useState<Feedback | null>(null);
    const [scanning, setScanning] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const dismissTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const keepFocus = useCallback(() => {
        inputRef.current?.focus();
    }, []);

    useEffect(() => {
        const clockInterval = window.setInterval(() => {
            setClock(new Date());
        }, 1_000);

        return () => window.clearInterval(clockInterval);
    }, []);

    useEffect(() => {
        keepFocus();

        const refocus = () => setTimeout(keepFocus, 50);

        window.addEventListener('focus', refocus);

        return () => {
            window.removeEventListener('focus', refocus);
        };
    }, [keepFocus]);

    useEffect(() => {
        return () => {
            if (dismissTimerRef.current) {
                clearTimeout(dismissTimerRef.current);
            }
        };
    }, []);

    const showFeedback = useCallback(
        (next: Feedback) => {
            setFeedback(next);

            if (dismissTimerRef.current) {
                clearTimeout(dismissTimerRef.current);
            }

            dismissTimerRef.current = setTimeout(() => {
                setFeedback(null);
                keepFocus();
            }, AUTO_DISMISS_MS);
        },
        [keepFocus],
    );

    const runScan = useCallback(
        async (raw: string) => {
            const rfid = raw.trim();

            if (!rfid || scanning) {
                return;
            }

            setScanning(true);

            try {
                const response = await scanAttendance(rfid);

                if (response.data && response.data.action !== 'error') {
                    const result = response.data as AttendanceScanResult;

                    showFeedback({
                        kind:
                            result.action === 'complete'
                                ? 'complete'
                                : 'success',
                        result,
                        message:
                            result.action === 'complete'
                                ? 'Check-in dan check-out Anda sudah tercatat hari ini'
                                : response.message,
                    });

                    return;
                }

                const reason =
                    response.data && 'reason' in response.data
                        ? response.data.reason
                        : undefined;

                const kind =
                    reason === 'duplicate'
                        ? 'duplicate'
                        : reason === 'not_found'
                          ? 'not_found'
                          : 'error';

                showFeedback({
                    kind,
                    message: response.message || 'Gagal memproses kartu.',
                });
            } catch (error: any) {
                console.error('Gagal scan presensi', error);

                const data = error.response?.data as
                    | { message?: string; data?: { reason?: string } }
                    | undefined;

                const reason = data?.data?.reason;

                const kind =
                    reason === 'duplicate'
                        ? 'duplicate'
                        : reason === 'not_found'
                          ? 'not_found'
                          : 'error';

                showFeedback({
                    kind,
                    message:
                        data?.message ||
                        error.response?.data?.message ||
                        'Gagal scan kartu.',
                });
            } finally {
                setScanning(false);
                keepFocus();
            }
        },
        [scanning, keepFocus, showFeedback],
    );

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            void runScan(event.currentTarget.value);
            event.currentTarget.value = '';
        }
    };

    const isSuccess = feedback?.kind === 'success';

    const action =
        feedback?.kind === 'success' && feedback.result
            ? ACTIONS[feedback.result.action as 'in' | 'out']
            : null;

    const title =
        isSuccess && action
            ? action.title
            : feedback?.kind === 'complete'
              ? 'Sudah Absen Hari Ini'
              : feedback?.kind === 'duplicate'
                ? 'RFID Duplikat'
                : feedback?.kind === 'not_found'
                  ? 'Kartu Tidak Terdaftar'
                  : 'Gagal';

    const subtitle =
        isSuccess && feedback?.result
            ? (action?.subtitle ?? '')
            : (feedback?.message ?? '');

    return (
        <>
            <Head title="Absen Karyawan" />

            <div
                className="flex h-screen flex-col bg-slate-100 text-slate-900"
                onMouseMove={keepFocus}
            >
                {/* TOP BAR: LOGO + CLOCK */}
                <div className="flex shrink-0 items-center justify-between px-6 pt-5">
                    <div className="flex items-center">
                        <img
                            src="/assets/LG2.png"
                            alt="Logo RS Merdeka"
                            className="h-14 w-auto object-contain"
                        />
                    </div>

                    <div className="text-right">
                        <p className="text-2xl font-black tracking-tight text-slate-900 tabular-nums">
                            {clock.toLocaleTimeString('id-ID', {
                                hour: '2-digit',
                                minute: '2-digit',
                                second: '2-digit',
                            })}
                        </p>

                        <p className="mt-0.5 text-[11px] font-medium tracking-wide text-slate-500 uppercase">
                            {clock.toLocaleDateString('id-ID', {
                                weekday: 'long',
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric',
                            })}
                        </p>
                    </div>
                </div>

                {/* BODY */}
                <div className="flex flex-1 gap-5 overflow-hidden p-5">
                    {/* LEFT COLUMN: RFID HERO */}
                    <div className="flex min-w-0 flex-1 flex-col gap-5">
                        <div className="relative flex flex-1 flex-col items-center justify-center overflow-hidden rounded-3xl bg-white p-8 shadow-md ring-1 ring-slate-200">
                            {/* decorative gradient accents */}
                            <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-[#07577f]/5 blur-3xl" />
                            <div className="pointer-events-none absolute -right-24 -bottom-24 h-72 w-72 rounded-full bg-emerald-300/10 blur-3xl" />

                            <div className="relative flex flex-col items-center text-center">
                                <img
                                    src="/assets/rfid.png"
                                    alt="Kartu RFID"
                                    className={`mt-8 h-56 w-56 object-contain drop-shadow sm:h-72 sm:w-72 ${scanning ? 'animate-pulse' : ''}`}
                                />

                                <h1 className="mt-6 text-3xl font-black tracking-tight text-[#07577f] sm:text-4xl">
                                    Silakan Scan Kartu Karyawan / Perawat
                                </h1>

                                <p className="mt-2 max-w-md text-base text-slate-500">
                                    Tempelkan kartu pada reader untuk melakukan
                                    presensi masuk atau keluar
                                </p>

                                {scanning && (
                                    <span className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#07577f]/10 px-4 py-2 text-sm font-bold text-[#07577f]">
                                        <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                                        Memproses kartu...
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                    {/* END LEFT COLUMN */}

                    {/* RIGHT PANEL: RESULT */}
                    <div className="flex w-[430px] shrink-0 flex-col gap-5 overflow-hidden">
                        {feedback ? (
                            /* RESULT CARD */
                            <div
                                className={`flex shrink-0 flex-col overflow-hidden rounded-3xl bg-white shadow-md ring-1 ${
                                    isSuccess
                                        ? 'ring-emerald-300'
                                        : 'ring-red-300'
                                }`}
                            >
                                {/* result header */}
                                <div
                                    className={`flex items-center gap-3 px-6 py-4 text-white ${
                                        isSuccess
                                            ? 'bg-gradient-to-r from-emerald-500 to-emerald-600'
                                            : 'bg-gradient-to-r from-red-500 to-red-600'
                                    }`}
                                >
                                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/20">
                                        {isSuccess ? (
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-6 w-6"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2.5"
                                            >
                                                <path d="M20 6 9 17l-5-5" />
                                            </svg>
                                        ) : (
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-6 w-6"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2.5"
                                            >
                                                <path d="M18 6 6 18M6 6l12 12" />
                                            </svg>
                                        )}
                                    </span>

                                    <div>
                                        <p className="text-base font-black">
                                            {title}
                                        </p>
                                        {!isSuccess && (
                                            <p className="text-xs text-white/80">
                                                {subtitle}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {isSuccess && feedback.result ? (
                                    <div className="p-6">
                                        <div className="flex flex-col items-center gap-4 sm:flex-row">
                                            <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-[#07577f]/10 ring-4 ring-emerald-100">
                                                {feedback.result.perawat
                                                    .image_url ? (
                                                    <img
                                                        src={
                                                            feedback.result
                                                                .perawat
                                                                .image_url
                                                        }
                                                        alt={
                                                            feedback.result
                                                                .perawat.name
                                                        }
                                                        className="h-full w-full object-cover"
                                                        style={{
                                                            objectPosition:
                                                                'center 20%',
                                                        }}
                                                    />
                                                ) : (
                                                    <div className="flex h-full w-full items-center justify-center">
                                                        <span className="text-2xl font-black text-[#07577f]">
                                                            {feedback.result.perawat.name
                                                                .charAt(0)
                                                                .toUpperCase()}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="min-w-0 flex-1">
                                                <p className="truncate text-lg font-bold text-gray-800">
                                                    {
                                                        feedback.result.perawat
                                                            .name
                                                    }
                                                </p>
                                                <p className="mt-0.5 text-sm text-gray-500">
                                                    {
                                                        feedback.result.perawat
                                                            .code
                                                    }{' '}
                                                    •{' '}
                                                    {
                                                        feedback.result.perawat
                                                            .gender_label
                                                    }
                                                </p>
                                                <p className="mt-1 text-sm font-semibold text-emerald-600">
                                                    {subtitle}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="mt-6 grid grid-cols-2 gap-3">
                                            <div className="rounded-2xl bg-[#f3f6f9] p-4 text-center">
                                                <p className="text-[11px] font-medium tracking-wider text-gray-400 uppercase">
                                                    Jam Masuk
                                                </p>
                                                <p className="mt-1 text-2xl font-black text-gray-800 tabular-nums">
                                                    {formatTime(
                                                        feedback.result.time_in,
                                                    )}
                                                </p>
                                            </div>

                                            <div className="rounded-2xl bg-[#f3f6f9] p-4 text-center">
                                                <p className="text-[11px] font-medium tracking-wider text-gray-400 uppercase">
                                                    Jam Keluar
                                                </p>
                                                <p className="mt-1 text-2xl font-black text-gray-800 tabular-nums">
                                                    {formatTime(
                                                        feedback.result
                                                            .time_out,
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="p-6">
                                        <div className="flex items-start gap-3 rounded-2xl bg-red-50 p-4">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="mt-0.5 h-5 w-5 shrink-0 text-red-500"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            >
                                                <circle
                                                    cx="12"
                                                    cy="12"
                                                    r="10"
                                                />
                                                <path d="M12 8v4M12 16h.01" />
                                            </svg>
                                            <p className="text-sm font-semibold text-red-600">
                                                {subtitle}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            /* IDLE PANEL */
                            <div className="flex min-h-0 flex-1 items-center justify-center rounded-3xl bg-white p-6 shadow-md ring-1 ring-slate-200">
                                <div className="flex flex-col items-center gap-3 text-center">
                                    <img
                                        src="/assets/RTF.png"
                                        alt="Kartu RFID"
                                        className="h-28 w-28 object-contain"
                                    />

                                    <div>
                                        <p className="text-lg font-black tracking-widest text-slate-500 uppercase">
                                            Menunggu Scan
                                        </p>
                                        <p className="mt-1 text-sm text-slate-500">
                                            Hasil presensi akan muncul di sini
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* HIDDEN INPUT: must stay focused to capture RFID scan */}
                <input
                    ref={inputRef}
                    type="text"
                    onKeyDown={handleKeyDown}
                    onBlur={() => setTimeout(keepFocus, 50)}
                    autoFocus
                    autoComplete="off"
                    className="pointer-events-none absolute h-px w-px opacity-0"
                    aria-label="RFID reader input"
                />
            </div>
        </>
    );
}
