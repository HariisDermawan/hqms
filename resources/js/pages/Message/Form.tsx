import { Link } from '@inertiajs/react';
import { useEffect, useState, type FormEvent } from 'react';
import {
    type Message,
    type MessagePayload,
    type MessageStatus,
} from '@/api/message';
import { STATUS_OPTIONS } from './status';

interface MessageFormProps {
    initial?: Message | null;
    forceReply?: boolean;
    processing: boolean;
    errors?: Record<string, string | undefined> & {
        general?: string;
    };
    onSubmit: (payload: MessagePayload) => void;
}

const inputClass =
    'w-full h-[42px] px-[12px] rounded-[12px] bg-[#d9d9d9] text-[13px] text-gray-700 placeholder:text-[#999] outline-none focus:bg-[#d5d5d5] focus:ring-2 focus:ring-[#084e7a]/30 transition';

const textareaClass =
    'w-full rounded-[12px] bg-[#d9d9d9] px-[12px] py-[10px] text-[13px] text-gray-700 transition outline-none placeholder:text-[#999] focus:bg-[#d5d5d5] focus:ring-2 focus:ring-[#084e7a]/30';

const labelClass = 'block text-[13px] text-[#333] mb-[4px]';

export default function MessageForm({
    initial,
    forceReply = false,
    processing,
    errors = {},
    onSubmit,
}: MessageFormProps) {
    const [name, setName] = useState(initial?.name ?? '');
    const [email, setEmail] = useState(initial?.email ?? '');
    const [phone, setPhone] = useState(initial?.phone ?? '');
    const [subject, setSubject] = useState(initial?.subject ?? '');
    const [message, setMessage] = useState(initial?.message ?? '');
    const [status, setStatus] = useState<MessageStatus>(
        initial?.status ?? (forceReply ? 'replied' : 'unread'),
    );
    const [adminReply, setAdminReply] = useState(initial?.admin_reply ?? '');

    useEffect(() => {
        setAdminReply(initial?.admin_reply ?? '');
    }, [initial]);

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        onSubmit({
            name: name.trim(),
            email: email.trim(),
            phone: phone.trim() || null,
            subject: subject.trim() || null,
            message: message.trim(),
            status,
            admin_reply:
                status === 'replied' ? adminReply.trim() || null : null,
            replied_at: status === 'replied' ? new Date().toISOString() : null,
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
                {/* NAMA */}
                <div>
                    <label htmlFor="name" className={labelClass}>
                        Nama
                    </label>

                    <input
                        id="name"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        placeholder="Nama pengirim..."
                        className={inputClass}
                    />

                    {errors.name && (
                        <p className="mt-1 text-[11px] text-red-500">
                            {errors.name}
                        </p>
                    )}
                </div>

                {/* EMAIL */}
                <div>
                    <label htmlFor="email" className={labelClass}>
                        Email
                    </label>

                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        placeholder="email@contoh.com"
                        className={inputClass}
                    />

                    {errors.email && (
                        <p className="mt-1 text-[11px] text-red-500">
                            {errors.email}
                        </p>
                    )}
                </div>

                {/* NO. HP */}
                <div>
                    <label htmlFor="phone" className={labelClass}>
                        No. HP{' '}
                        <span className="font-normal text-gray-400">
                            (opsional)
                        </span>
                    </label>

                    <input
                        id="phone"
                        value={phone}
                        onChange={(event) => setPhone(event.target.value)}
                        placeholder="08xxxxxxxxxx"
                        className={inputClass}
                    />

                    {errors.phone && (
                        <p className="mt-1 text-[11px] text-red-500">
                            {errors.phone}
                        </p>
                    )}
                </div>

                {/* SUBJEK */}
                <div>
                    <label htmlFor="subject" className={labelClass}>
                        Subjek{' '}
                        <span className="font-normal text-gray-400">
                            (opsional)
                        </span>
                    </label>

                    <input
                        id="subject"
                        value={subject}
                        onChange={(event) => setSubject(event.target.value)}
                        placeholder="Subjek pesan..."
                        className={inputClass}
                    />

                    {errors.subject && (
                        <p className="mt-1 text-[11px] text-red-500">
                            {errors.subject}
                        </p>
                    )}
                </div>

                {/* PESAN */}
                <div className="sm:col-span-2">
                    <label htmlFor="message" className={labelClass}>
                        Pesan
                    </label>

                    <textarea
                        id="message"
                        value={message}
                        onChange={(event) => setMessage(event.target.value)}
                        rows={4}
                        placeholder="Isi pesan..."
                        className={textareaClass}
                    />

                    {errors.message && (
                        <p className="mt-1 text-[11px] text-red-500">
                            {errors.message}
                        </p>
                    )}
                </div>

                {/* STATUS */}
                <div>
                    <label htmlFor="status" className={labelClass}>
                        Status
                    </label>

                    <select
                        id="status"
                        value={status}
                        onChange={(event) =>
                            setStatus(event.target.value as MessageStatus)
                        }
                        className={inputClass}
                    >
                        {STATUS_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>

                    {errors.status && (
                        <p className="mt-1 text-[11px] text-red-500">
                            {errors.status}
                        </p>
                    )}
                </div>

                {/* BALASAN ADMIN */}
                {status === 'replied' && (
                    <div className="sm:col-span-2">
                        <label htmlFor="admin_reply" className={labelClass}>
                            Balasan Admin
                        </label>

                        <textarea
                            id="admin_reply"
                            value={adminReply}
                            onChange={(event) =>
                                setAdminReply(event.target.value)
                            }
                            rows={4}
                            placeholder="Tuliskan balasan untuk pengirim..."
                            className={textareaClass}
                        />

                        {errors.admin_reply && (
                            <p className="mt-1 text-[11px] text-red-500">
                                {errors.admin_reply}
                            </p>
                        )}
                    </div>
                )}
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
                <Link
                    href={initial ? `/messages/${initial.id}` : '/messages'}
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
                          : 'Simpan Pesan'}
                </button>
            </div>
        </form>
    );
}
