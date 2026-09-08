import {
    getKioskBeritas,
    getKioskDokters,
    getKioskFaqs,
    getKioskFasilitas,
    getKioskPolis,
    getNowServing,
    type NowServingItem,
} from '@/api/kiosk';
import type { Dokter } from '@/api/dokter';
import type { Faq } from '@/api/faq';
import type { Poli } from '@/api/poli';
import { useEffect, useRef, useState, type KeyboardEvent } from 'react';

interface ChatMessage {
    id: number;
    from: 'bot' | 'user';
    text: string;
}

const GREETINGS = [
    'halo',
    'hai',
    'hi',
    'hallo',
    'halow',
    'halo selamat',
    'assalamualaikum',
    'selamat pagi',
    'selamat siang',
    'selamat sore',
    'selamat malam',
    'pagi',
    'siang',
    'sore',
    'malam',
];

const THANKS = [
    'terima kasih',
    'terimakasih',
    'makasih',
    'makasi',
    'thanks',
    'thank you',
    'matur nuwun',
    'suwun',
];

const BYE = [
    'dadah',
    'bye',
    'sampai jumpa',
    'sampai ketemu',
    'selamat tinggal',
    'daah',
    'dah',
];

const DAY_LABELS: Record<string, string> = {
    sunday: 'Minggu',
    monday: 'Senin',
    tuesday: 'Selasa',
    wednesday: 'Rabu',
    thursday: 'Kamis',
    friday: 'Jumat',
    saturday: 'Sabtu',
};

const STATUS_LABELS: Record<string, string> = {
    waiting: 'Menunggu',
    called: 'Dipanggil',
    serving: 'Sedang Dilayani',
    completed: 'Selesai',
    skipped: 'Dilewati',
};

const CONTACT_TEXT =
    'Hubungi RS Medika HRS:\n📍 Alamat: Jl. Raya Merdeka No. 88, Kota Malang, Jawa Timur\n📞 Telepon: (0341) 555-888\n📧 Email: info@rsmedikahrs.id\n🕒 Melayani 24 jam setiap hari.';

const HOURS_TEXT =
    'Jam layanan kami:\n🕒 UGD / IGD: 24 jam (termasuk hari libur)\n🕗 Pendaftaran rawat jalan: 07.00 – 20.00 WIB\n🕙 Jam besuk: 10.00 – 12.00 & 16.00 – 20.00 WIB\nUntuk poli tertentu, jam praktik dokter bisa berbeda — silakan tanya "dokter ... jam berapa".';

const TICKET_GUIDE_TEXT =
    'Cara mengambil nomor antrean:\n\n1. Buka halaman Antrean (menu "Ambil Nomor Antrean" atau tombol Tiket di situs).\n2. Pilih poli tujuan (misal: Poli Umum, Poli Gigi, dll).\n3. Tekan tombol "Ambil Tiket" — nomor antrean Anda muncul (contoh: B-001).\n4. Catat/potret nomornya, lalu tunggu sampai dipanggil.\n5. Saat nomor Anda dipanggil, segera ke loket pendaftaran poli tersebut.\n\nStatus antrean bisa Anda pantau secara langsung di halaman Antrean / layar di lobi. 🎫';

const WHO_AM_I_TEXT =
    'Saya "Asisten RS Medika HRS" 🤖 — asisten virtual untuk membantu menjawab pertanyaan seputar rumah sakit: antrean, jadwal dokter, cara daftar, fasilitas, dan lainnya. Saya mengambil data langsung dari sistem rumah sakit, ya!';

const HELP_TEXT =
    'Berikut yang bisa saya bantu:\n• 🎫 Antrean sekarang & cara ambil tiket\n• 👨‍⚕️ Jadwal / jam praktik dokter\n• 🏥 Daftar poli & fasilitas\n• 📍 Alamat, telepon & jam layanan\n• 📰 Berita terbaru\n• ❓ Pertanyaan umum (FAQ)\n\nCukup ketik pertanyaan Anda, atau klik salah satu chip pertanyaan di atas!';

const STARTER_CHIPS = [
    'Antrian sekarang',
    'Jadwal dokter hari ini',
    'Poli anak di hari apa',
    'Cara ambil tiket',
    'Dokter di poli umum',
    'Alamat & jam layanan',
];

const normalize = (text: string): string =>
    text
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

const hasSome = (text: string, keywords: string[]): boolean =>
    keywords.some((keyword) => text.includes(keyword));

const hasWholeWord = (text: string, keywords: string[]): boolean =>
    keywords.some((keyword) => {
        const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

        return new RegExp(`\\b${escaped}\\b`).test(text);
    });

const formatTime = (time?: string | null): string =>
    time ? time.slice(0, 5) : '—';

const DAY_ORDER = [
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
    'sunday',
];

const todayKey = (): string => {
    const days = [
        'sunday',
        'monday',
        'tuesday',
        'wednesday',
        'thursday',
        'friday',
        'saturday',
    ];

    return days[new Date().getDay()];
};

const findAnswer = (
    query: string,
    faqs: { question: string; answer: string }[],
): string | null => {
    const tokens = normalize(query)
        .split(' ')
        .filter((token) => token.length > 2);

    if (tokens.length === 0) {
        return null;
    }

    let best: {
        faq: { question: string; answer: string };
        score: number;
    } | null = null;

    for (const faq of faqs) {
        const question = normalize(faq.question);
        const answer = normalize(faq.answer);
        let score = 0;

        for (const token of tokens) {
            if (question.includes(token)) {
                score += 2;
            }

            if (answer.includes(token)) {
                score += 1;
            }
        }

        if (best === null || score > best.score) {
            best = { faq, score };
        }
    }

    if (best !== null && best.score > 0) {
        return best.faq.answer;
    }

    return null;
};

const findDoctor = (query: string, dokters: Dokter[]): Dokter | null => {
    let best: Dokter | null = null;
    let bestScore = 0;

    const queryTokens = normalize(query)
        .split(' ')
        .filter((token) => token.length > 2);

    for (const dokter of dokters) {
        const cleanName = normalize(dokter.name).replace(
            /\b(dr|dokter|drg|drs)\b/g,
            '',
        );
        const nameTokens = cleanName
            .split(' ')
            .filter((token) => token.length > 2);

        let score = 0;

        for (const token of nameTokens) {
            if (queryTokens.includes(token)) {
                score += 3;
            } else if (
                queryTokens.some(
                    (qt) => qt.includes(token) || token.includes(qt),
                )
            ) {
                score += 1;
            }
        }

        if (score > bestScore) {
            bestScore = score;
            best = dokter;
        }
    }

    return bestScore >= 3 ? best : null;
};

const buildDoctorSchedules = (dokter: Dokter): string => {
    const schedules = dokter.schedules ?? [];

    if (schedules.length === 0) {
        return `${dokter.name} saat ini belum memiliki jadwal praktik. Anda bisa menanyakan langsung ke loket pendaftaran.`;
    }

    const lines = schedules.map(
        (schedule) =>
            `• ${DAY_LABELS[schedule.day] ?? schedule.day}: ${formatTime(
                schedule.start_time,
            )} – ${formatTime(schedule.end_time)}${
                schedule.poli ? ` (Poli ${schedule.poli})` : ''
            }`,
    );

    return `Jadwal praktik ${dokter.name}:\n${lines.join('\n')}`;
};

const buildDoctorToday = (dokter: Dokter): string => {
    const today = todayKey();
    const schedules = (dokter.schedules ?? []).filter(
        (schedule) => schedule.day === today,
    );

    if (schedules.length === 0) {
        return `${dokter.name} tidak praktik hari ini (${DAY_LABELS[today] ?? today}).\n\nJadwal lengkapnya:\n${buildDoctorSchedules(dokter)}`;
    }

    return `Ya, ${dokter.name} praktik hari ini (${DAY_LABELS[today] ?? today}):\n• ${schedules
        .map(
            (schedule) =>
                `${formatTime(schedule.start_time)} – ${formatTime(
                    schedule.end_time,
                )}${schedule.poli ? ` (Poli ${schedule.poli})` : ''}`,
        )
        .join('\n• ')}`;
};

const matchPoli = (
    query: string,
    polis: { id: number; name: string | null }[],
): { id: number; name: string | null } | null => {
    const q = normalize(query);

    let best: { id: number; name: string | null } | null = null;
    let bestScore = 0;

    for (const poli of polis) {
        const name = normalize(poli.name ?? '');

        if (name === '') {
            continue;
        }

        let score = 0;

        if (q.includes(name)) {
            score += 5;
        }

        for (const token of name.split(' ').filter((t) => t.length > 2)) {
            if (q.includes(token)) {
                score += 2;
            }
        }

        if (score > bestScore) {
            bestScore = score;
            best = poli;
        }
    }

    return bestScore >= 2 ? best : null;
};

const buildPoliSchedules = (
    poliName: string,
    dokters: Dokter[],
    todayOnly = false,
): string => {
    const target = normalize(poliName)
        .replace(/^poli\s*/, '')
        .trim();

    const schedules = dokters.flatMap((dokter) =>
        (dokter.schedules ?? [])
            .filter((schedule) => {
                const poli = normalize(schedule.poli ?? '').replace(
                    /^poli\s*/,
                    '',
                );

                const matches =
                    poli !== '' &&
                    (poli === target ||
                        poli.includes(target) ||
                        target.includes(poli));

                return matches && (!todayOnly || schedule.day === todayKey());
            })
            .map((schedule) => ({ dokter, schedule })),
    );

    if (schedules.length === 0) {
        if (todayOnly) {
            return `Poli ${poliName} tidak buka hari ini (${DAY_LABELS[todayKey()] ?? todayKey()}).`;
        }

        return `Jadwal Poli ${poliName} belum tersedia saat ini. Tanyakan langsung ke loket pendaftaran, ya.`;
    }

    const lines: string[] = [];

    for (const day of DAY_ORDER) {
        const daySchedules = schedules.filter(
            ({ schedule }) => schedule.day === day,
        );

        if (daySchedules.length === 0) {
            continue;
        }

        const entries = daySchedules.map(
            ({ dokter, schedule }) =>
                `${dokter.name}: ${formatTime(
                    schedule.start_time,
                )} – ${formatTime(schedule.end_time)}`,
        );

        lines.push(`• ${DAY_LABELS[day] ?? day}: ${entries.join('; ')}`);
    }

    const result = `Jadwal Poli ${poliName}:\n${lines.join('\n')}`;

    if (todayOnly) {
        return `Poli ${poliName} buka hari ini (${DAY_LABELS[todayKey()] ?? todayKey()}):\n${lines.join('\n')}`;
    }

    return result;
};

const normalizePoliName = (name: string): string =>
    normalize(name).replace(/^poli\s*/, '');

const buildDoctorsByPoli = (poliName: string, dokters: Dokter[]): string => {
    const target = normalizePoliName(poliName);

    const matched = new Map<number, Dokter>();

    for (const dokter of dokters) {
        const practices = (dokter.schedules ?? []).some((schedule) => {
            const poli = normalizePoliName(schedule.poli ?? '');

            return (
                poli !== '' &&
                (poli === target ||
                    poli.includes(target) ||
                    target.includes(poli))
            );
        });

        if (practices) {
            matched.set(dokter.id, dokter);
        }
    }

    const list = [...matched.values()];

    if (list.length === 0) {
        return `Belum ada dokter yang terdaftar praktik di Poli ${poliName} saat ini.`;
    }

    return `Dokter yang praktik di Poli ${poliName}:\n${list
        .map(
            (dokter) =>
                `• ${dokter.name}${dokter.specialization ? ` — ${dokter.specialization}` : ''}`,
        )
        .join('\n')}`;
};

const buildDoctorsToday = (dokters: Dokter[]): string => {
    const today = todayKey();

    const practicing = dokters.filter((dokter) =>
        (dokter.schedules ?? []).some((schedule) => schedule.day === today),
    );

    if (practicing.length === 0) {
        return `Tidak ada dokter yang praktik hari ini (${DAY_LABELS[today] ?? today}).`;
    }

    const lines = practicing.map((dokter) => {
        const schedules = (dokter.schedules ?? []).filter(
            (schedule) => schedule.day === today,
        );

        const times = schedules
            .map(
                (schedule) =>
                    `${formatTime(schedule.start_time)} – ${formatTime(
                        schedule.end_time,
                    )}${schedule.poli ? ` (${schedule.poli})` : ''}`,
            )
            .join(', ');

        return `• ${dokter.name}: ${times}`;
    });

    return `Dokter yang praktik hari ini (${DAY_LABELS[today] ?? today}):\n${lines.join('\n')}`;
};

const buildNowServingForPoli = (
    poliName: string,
    items: NowServingItem[],
): string => {
    const target = normalizePoliName(poliName);

    const filtered = items.filter((item) => {
        const poli = normalizePoliName(item.poli?.name ?? '');

        return (
            poli !== '' &&
            (poli === target || poli.includes(target) || target.includes(poli))
        );
    });

    if (filtered.length === 0) {
        return `Saat ini belum ada antrean aktif di Poli ${poliName}. Ambil tiket dari halaman Antrean, ya. 🎫`;
    }

    const lines = filtered
        .slice(0, 5)
        .map(
            (item) =>
                `• ${item.queue_number} (${
                    STATUS_LABELS[item.status] ?? item.status
                })${item.loket ? ` · Loket ${item.loket}` : ''}`,
        );

    return `Antrean Poli ${poliName} sekarang:\n${lines.join(
        '\n',
    )}\n\nStatus berubah secara realtime — pantau halaman Antrean atau layar di lobi.`;
};

const buildDoctorList = (dokters: Dokter[]): string => {
    if (dokters.length === 0) {
        return 'Nama dokter belum tersedia saat ini.';
    }

    const lines = dokters
        .slice(0, 8)
        .map(
            (dokter) =>
                `• ${dokter.name}${dokter.specialization ? ` — ${dokter.specialization}` : ''}`,
        );

    return `Dokter yang praktik di RS Medika HRS:\n${lines.join(
        '\n',
    )}\n\nTanya "jadwal dokter <nama>" untuk jam praktiknya.`;
};

const buildPoliList = (
    polis: { id: number; name: string | null }[],
): string => {
    if (polis.length === 0) {
        return 'Daftar poli belum tersedia saat ini.';
    }

    const names = polis
        .map((poli) => poli.name)
        .filter((name): name is string => name !== null);

    return `Poli yang tersedia:\n${names
        .map((name) => `• ${name}`)
        .join(
            '\n',
        )}\n\nPilih poli saat mengambil nomor antrean di halaman Antrean.`;
};

const buildNowServing = (items: NowServingItem[]): string => {
    if (items.length === 0) {
        return 'Saat ini belum ada antrean yang sedang dipanggil/dilayani. Silakan ambil tiket di halaman Antrean. 🎫';
    }

    const lines = items
        .slice(0, 6)
        .map(
            (item) =>
                `• ${item.poli?.name ?? 'Poli'}: ${item.queue_number} (${
                    STATUS_LABELS[item.status] ?? item.status
                })${item.loket ? ` · Loket ${item.loket}` : ''}`,
        );

    return `Antrean yang sedang berjalan sekarang:\n${lines.join(
        '\n',
    )}\n\nStatus berubah secara realtime — pantau halaman Antrean atau layar di lobi.`;
};

const buildBerita = (beritas: { title: string }[]): string => {
    if (beritas.length === 0) {
        return 'Belum ada berita terbaru.';
    }

    return `Berita terbaru dari RS Medika HRS:\n${beritas
        .slice(0, 3)
        .map((berita) => `• ${berita.title}`)
        .join('\n')}`;
};

const buildFasilitasList = (
    fasilitas: { id: number; name: string }[],
): string => {
    if (fasilitas.length === 0) {
        return 'Daftar fasilitas belum tersedia saat ini.';
    }

    return `Fasilitas RS Medika HRS:\n${fasilitas
        .map((item) => `• ${item.name}`)
        .join('\n')}`;
};

const buildFallback = (faqs: FaqItem[]): string => {
    const suggestions = faqs.slice(0, 3).map((faq) => `• ${faq.question}`);

    return (
        'Maaf, saya belum menemukan jawaban yang cocok. 🙏 Coba tanyakan hal lain seperti "antrian sekarang", "jadwal dokter", "alamat", atau "cara ambil tiket".\n\n' +
        (suggestions.length > 0
            ? `Beberapa pertanyaan yang sering ditanyakan:\n${suggestions.join(
                  '\n',
              )}\n\n`
            : '') +
        'Atau hubungi kami melalui form pesan di bawah halaman ini.'
    );
};

interface FaqItem {
    id: number;
    question: string;
    answer: string;
}

let messageId = 0;

const nextMessageId = (): number => ++messageId;

const RANDOM_GREETING_FLOWS = [
    'Halo! 😊 Ada yang bisa saya bantu? Ketik pertanyaan Anda — misalnya "cara ambil tiket", "antrian sekarang", atau "jadwal dokter".',
    'Halo 🙌 Selamat datang di RS Medika HRS. Ada yang bisa saya bantu hari ini?',
    'Hai, senang bisa membantu! 😊 Silakan ketik pertanyaan Anda seputar layanan rumah sakit kami.',
];

const isGreeting = (query: string): boolean => {
    const strongOpeners = [
        'halo',
        'hai',
        'hi',
        'hallo',
        'assalamualaikum',
        'selamat',
        'pagi dok',
        'siang dok',
        'sore dok',
        'malam dok',
    ];

    if (strongOpeners.some((opener) => query.startsWith(opener))) {
        return true;
    }

    return (
        query.split(' ').filter(Boolean).length <= 3 &&
        hasSome(query, GREETINGS)
    );
};

export default function Chatbot() {
    const [open, setOpen] = useState(false);
    const [faqs, setFaqs] = useState<FaqItem[]>([]);
    const [dokters, setDokters] = useState<Dokter[]>([]);
    const [polis, setPolis] = useState<Poli[]>([]);
    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            id: nextMessageId(),
            from: 'bot',
            text: 'Halo! 👋 Selamat datang di RS Medika HRS. Ada yang bisa saya bantu? Ketik pertanyaan Anda atau pilih salah satu topik di bawah.',
        },
    ]);
    const [input, setInput] = useState('');
    const [typing, setTyping] = useState(false);
    const bodyRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let active = true;

        const load = async () => {
            try {
                const [faqResponse, dokterResponse, poliResponse] =
                    await Promise.all([
                        getKioskFaqs(),
                        getKioskDokters(),
                        getKioskPolis(),
                    ]);

                if (!active) {
                    return;
                }

                setFaqs(
                    (faqResponse.data?.items ?? []).map((faq: Faq) => ({
                        id: faq.id,
                        question: faq.question,
                        answer: faq.answer,
                    })),
                );
                setDokters(dokterResponse.data?.items ?? []);
                setPolis(poliResponse.data?.items ?? []);
            } catch {
                if (active) {
                    setFaqs([]);
                    setDokters([]);
                    setPolis([]);
                }
            }
        };

        void load();

        return () => {
            active = false;
        };
    }, []);

    useEffect(() => {
        if (bodyRef.current) {
            bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
        }
    }, [messages, typing, open]);

    const resolveReply = async (query: string): Promise<string> => {
        const q = normalize(query);

        if (q === '') {
            return 'Silakan ketik pertanyaan Anda terlebih dahulu ya. 😊';
        }

        if (hasWholeWord(q, BYE)) {
            return 'Terima kasih sudah menghubungi kami! 🙏 Semoga cepat sehat dan sampai jumpa lagi. 👋';
        }

        if (hasSome(q, THANKS)) {
            return 'Sama-sama! 😊 Senang bisa membantu. Ada lagi yang ingin ditanyakan?';
        }

        if (isGreeting(q)) {
            return RANDOM_GREETING_FLOWS[
                Math.floor(Math.random() * RANDOM_GREETING_FLOWS.length)
            ];
        }

        if (q.includes('kamu siapa') || q.includes('siapa kamu')) {
            return WHO_AM_I_TEXT;
        }

        if (hasSome(q, ['bantuan', 'ada apa saja', 'fitur apa'])) {
            return HELP_TEXT;
        }

        if (
            hasSome(q, ['antrian', 'antrean', 'antri']) &&
            hasSome(q, [
                'sekarang',
                'berjalan',
                'giliran',
                'dipanggil',
                'dilayani',
                'berikutnya',
                'berapa',
                'info',
                'cek',
                'nomor',
                'sudah',
            ])
        ) {
            try {
                const response = await getNowServing();

                const items = response.data?.items ?? [];

                const matchedPoli = matchPoli(q, polis);

                if (matchedPoli) {
                    return buildNowServingForPoli(
                        matchedPoli.name ?? '',
                        items,
                    );
                }

                return buildNowServing(items);
            } catch {
                return 'Maaf, sedang tidak bisa mengecek antrean. Silakan coba beberapa saat lagi, atau pantau halaman Antrean.';
            }
        }

        if (
            hasSome(q, [
                'cara ambil',
                'ambil tiket',
                'ambil nomor',
                'cara daftar',
                'cara mendaftar',
                'cara bikin',
                'cara buat',
                'cara antrian',
                'bikin antrian',
                'buat antrian',
                'ambil antrian',
                'buat tiket',
                'dapat tiket',
                'gimana cara',
                'bagaimana cara',
                'daftar berobat',
            ])
        ) {
            return TICKET_GUIDE_TEXT;
        }

        if (q.includes('dokter')) {
            const askedToday = hasSome(q, ['hari ini', 'sekarang ada']);

            if (
                hasSome(q, [
                    'jam',
                    'jadwal',
                    'praktek',
                    'praktik',
                    'pukul',
                    'waktu',
                    'kapan',
                    'hari apa',
                    'jam berapa',
                    'bertugas',
                    'hari ini',
                ])
            ) {
                const matched = findDoctor(q, dokters);

                if (matched) {
                    return askedToday
                        ? buildDoctorToday(matched)
                        : buildDoctorSchedules(matched);
                }

                const poliForDoctor = matchPoli(q, polis);

                if (poliForDoctor) {
                    return buildPoliSchedules(
                        poliForDoctor.name ?? '',
                        dokters,
                        askedToday,
                    );
                }

                if (askedToday) {
                    return buildDoctorsToday(dokters);
                }

                return `Dokter yang mana yang Anda maksud? Ini daftar dokter kami:\n${dokters
                    .map((item) => `• ${item.name}`)
                    .join(
                        '\n',
                    )}\n\nKetik misalnya "jadwal dokter ${dokters[0]?.name ?? ''}", "poli anak di hari apa", atau "siapa saja dokter yang praktik".`;
            }

            const doctorsPoli = matchPoli(q, polis);

            if (doctorsPoli) {
                return buildDoctorsByPoli(doctorsPoli.name ?? '', dokters);
            }

            if (
                hasSome(q, [
                    'siapa',
                    'daftar',
                    'apa saja',
                    'semua',
                    'nama',
                    'list',
                ])
            ) {
                return buildDoctorList(dokters);
            }
        }

        if (q.includes('poli')) {
            if (
                hasSome(q, [
                    'hari apa',
                    'jadwal',
                    'jam',
                    'kapan',
                    'hari ini',
                    'buka',
                    'jam berapa',
                    'praktik',
                    'praktek',
                ])
            ) {
                const matchedPoli = matchPoli(q, polis);

                if (matchedPoli) {
                    return buildPoliSchedules(
                        matchedPoli.name ?? '',
                        dokters,
                        hasSome(q, ['hari ini']),
                    );
                }

                const names = polis
                    .map((poli) => poli.name)
                    .filter((name): name is string => name !== null);

                return `Poli yang mana yang Anda maksud? Ini daftarnya:\n${names
                    .map((name) => `• ${name}`)
                    .join(
                        '\n',
                    )}\n\nKetik misalnya "jadwal Poli ${names[0] ?? ''}".`;
            }

            if (
                hasSome(q, ['apa', 'ada', 'layanan', 'daftar', 'nama', 'macam'])
            ) {
                return buildPoliList(polis);
            }
        }

        if (
            q.includes('fasilitas') &&
            hasSome(q, ['apa', 'ada', 'layanan', 'daftar', 'ruang'])
        ) {
            try {
                const response = await getKioskFasilitas();

                return buildFasilitasList(
                    (response.data?.items ?? []).map((item) => ({
                        id: item.id,
                        name: item.name,
                    })),
                );
            } catch {
                return 'Maaf, sedang tidak bisa memuat daftar fasilitas. Silakan coba lagi nanti.';
            }
        }

        if (
            q.includes('berita') &&
            hasSome(q, [
                'apa',
                'terbaru',
                'info',
                'kabar',
                'headline',
                'bagaimana',
            ])
        ) {
            try {
                const response = await getKioskBeritas(1);

                return buildBerita(response.data?.items ?? []);
            } catch {
                return 'Maaf, sedang tidak bisa memuat berita terbaru. Silakan coba lagi nanti.';
            }
        }

        if (
            hasSome(q, [
                'alamat',
                'lokasi',
                'diman',
                'di mana',
                'dimana',
                'telepon',
                'telp',
                'kontak',
                'hubungi',
                'email',
                'no hp',
                'nomer hp',
                'nomor hp',
            ])
        ) {
            return CONTACT_TEXT;
        }

        if (
            q.includes('jam') &&
            hasSome(q, [
                'operasional',
                'buka',
                'besuk',
                'kunjungan',
                'layanan',
                'kerja',
                '24',
                'klinik',
                'rawat jalan',
            ])
        ) {
            return HOURS_TEXT;
        }

        const faqAnswer = findAnswer(q, faqs);

        if (faqAnswer) {
            return faqAnswer;
        }

        if (
            hasSome(q, [
                'biaya',
                'harga',
                'tarif',
                'bayar',
                'pembayaran',
                'bpjs',
                'asuransi',
                'kelas',
            ])
        ) {
            return 'Untuk info biaya, kelas perawatan, dan prosedur BPJS/asuransi, sebaiknya konfirmasi langsung ke loket pendaftaran atau kasir — karena bergantung pada jenis layanan dan ketersediaan.\n\nSementara itu, silakan cek pertanyaan umum kami: ketik "FAQ" atau lihat-lihat chip pertanyaan di atas. 😊';
        }

        return buildFallback(faqs);
    };

    const sendQuestion = (question: string) => {
        const trimmed = question.trim();

        if (!trimmed || typing) {
            return;
        }

        setMessages((prev) => [
            ...prev,
            { id: nextMessageId(), from: 'user', text: trimmed },
        ]);
        setInput('');
        setTyping(true);

        window.setTimeout(async () => {
            const reply = await resolveReply(trimmed);

            const delay = Math.min(1500, Math.max(600, reply.length * 6));

            window.setTimeout(() => {
                setMessages((prev) => [
                    ...prev,
                    { id: nextMessageId(), from: 'bot', text: reply },
                ]);
                setTyping(false);
            }, delay);
        }, 350);
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            sendQuestion(input);
        }
    };

    return (
        <div className="fixed right-5 bottom-5 z-50 flex flex-col items-end gap-3 sm:right-6 sm:bottom-6">
            {open && (
                <div className="flex w-[calc(100vw-40px)] max-w-[360px] flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl shadow-sky-950/20">
                    <div className="flex items-center justify-between gap-3 bg-[#075985] px-5 py-4">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/15 ring-2 ring-white/30">
                                    <img
                                        src="/icons/robot.svg"
                                        alt="Asisten RS Medika HRS"
                                        className="h-9 w-9 rounded-full object-cover"
                                    />
                                </div>

                                <span className="absolute right-0 bottom-0 h-2.5 w-2.5 rounded-full border-2 border-[#075985] bg-emerald-400" />
                            </div>

                            <div>
                                <div className="text-sm font-bold text-white">
                                    Asisten RS Medika HRS
                                </div>

                                <div className="text-[11px] text-sky-200">
                                    Online — data realtime
                                </div>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={() => setOpen(false)}
                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sky-200 transition hover:bg-white/10 hover:text-white"
                            aria-label="Tutup chatbot"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <path d="M6 6L18 18M18 6L6 18" />
                            </svg>
                        </button>
                    </div>

                    <div
                        ref={bodyRef}
                        className="max-h-[320px] min-h-[240px] space-y-3 overflow-y-auto bg-slate-50 px-4 py-4"
                    >
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`flex ${
                                    message.from === 'user'
                                        ? 'justify-end'
                                        : 'justify-start'
                                }`}
                            >
                                <div
                                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-line ${
                                        message.from === 'user'
                                            ? 'rounded-br-md bg-[#0284c7] text-white'
                                            : 'rounded-bl-md border border-slate-200 bg-white text-slate-700'
                                    }`}
                                >
                                    {message.text}
                                </div>
                            </div>
                        ))}

                        {typing && (
                            <div className="flex justify-start">
                                <div className="flex items-center gap-1 rounded-2xl rounded-bl-md border border-slate-200 bg-white px-4 py-3">
                                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400" />
                                    <span
                                        className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400"
                                        style={{ animationDelay: '120ms' }}
                                    />
                                    <span
                                        className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400"
                                        style={{ animationDelay: '240ms' }}
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {faqs.length > 0 && (
                        <div className="border-t border-slate-100 bg-white px-4 pt-3">
                            <div className="flex gap-2 overflow-x-auto pb-3">
                                {STARTER_CHIPS.map((chip) => (
                                    <button
                                        key={chip}
                                        type="button"
                                        onClick={() => sendQuestion(chip)}
                                        className="shrink-0 rounded-full border border-[#0284c7]/30 bg-[#e0f2fe] px-3 py-1.5 text-xs font-medium text-[#075985] transition hover:bg-[#bae6fd]"
                                    >
                                        {chip}
                                    </button>
                                ))}

                                {faqs.map((faq) => (
                                    <button
                                        key={faq.id}
                                        type="button"
                                        onClick={() =>
                                            sendQuestion(faq.question)
                                        }
                                        className="shrink-0 rounded-full border border-[#0284c7]/30 bg-[#f0f9ff] px-3 py-1.5 text-xs font-medium text-[#075985] transition hover:bg-[#e0f2fe]"
                                    >
                                        {faq.question}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="flex items-center gap-2 border-t border-slate-100 bg-white px-3 py-3">
                        <input
                            type="text"
                            value={input}
                            onChange={(event) => setInput(event.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Ketik pertanyaan Anda..."
                            className="w-full rounded-full border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:border-[#0284c7] focus:ring-2 focus:ring-[#0284c7]/10 focus:outline-none"
                        />

                        <button
                            type="button"
                            onClick={() => sendQuestion(input)}
                            disabled={typing || input.trim() === ''}
                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#0284c7] text-white transition hover:bg-[#075985] disabled:cursor-not-allowed disabled:opacity-50"
                            aria-label="Kirim pesan"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <path d="M22 2L11 13" />
                                <path d="M22 2L15 22L11 13L2 9z" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}

            <button
                type="button"
                onClick={() => setOpen((value) => !value)}
                className="flex h-14 w-14 items-center justify-center rounded-full bg-[#075985] text-white shadow-xl shadow-sky-950/30 transition hover:scale-105 hover:bg-[#064e73]"
                aria-label={open ? 'Tutup chatbot' : 'Buka chatbot'}
            >
                {open ? (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                    >
                        <path d="M6 6L18 18M18 6L6 18" />
                    </svg>
                ) : (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                    >
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                )}
            </button>
        </div>
    );
}
