import api from '@/lib/axios';
import type { AntrianStatus } from './antrian';
import type { Berita } from './berita';
import type { Dokter } from './dokter';
import type { Faq } from './faq';
import type { Fasilitas } from './fasilitas';
import type { Pagination } from './dokter';
import type { Penawaran } from './penawaran';
import type { Poli } from './poli';
import type { Message, MessagePayload } from './message';
import type { Ruangan } from './ruangan';
import type { Testimonial } from './testimonial';

export interface KioskPoli extends Poli {}

export interface KioskTicketPasien {
    name: string;
    medical_record_number: string | null;
}

export interface NowServingItem {
    id: number;
    queue_number: string;
    status: AntrianStatus;
    loket: number | null;
    called_at: string | null;
    poli: {
        id: number;
        name: string | null;
    } | null;
    pasien: KioskTicketPasien | null;
}

export interface CreatedTicket {
    id: number;
    queue_number: string;
    status: AntrianStatus;
    loket: number | null;
    poli: { id: number; code: string; name: string } | null;
}

export interface KioskPolisResponse {
    success: boolean;
    message: string;
    data?: {
        items?: KioskPoli[];
    };
}

export interface KioskDoktersResponse {
    success: boolean;
    message: string;
    data?: {
        items?: Dokter[];
    };
}

export interface KioskBeritasResponse {
    success: boolean;
    message: string;
    data?: {
        items?: Berita[];
        pagination?: Pagination;
    };
}

export interface KioskPenawaransResponse {
    success: boolean;
    message: string;
    data?: {
        items?: Penawaran[];
        pagination?: Pagination;
    };
}

export interface KioskRuangansResponse {
    success: boolean;
    message: string;
    data?: {
        items?: Ruangan[];
    };
}

export interface KioskMessageResponse {
    success: boolean;
    message: string;
    data?: {
        message?: Message;
    };
}

export interface KioskFaqsResponse {
    success: boolean;
    message: string;
    data?: {
        items?: Faq[];
    };
}

export interface KioskTestimonialsResponse {
    success: boolean;
    message: string;
    data?: {
        items?: Testimonial[];
    };
}

export interface KioskNowServingResponse {
    success: boolean;
    message: string;
    data?: {
        items?: NowServingItem[];
    };
}

export interface KioskFasilitasResponse {
    success: boolean;
    message: string;
    data?: {
        items?: Fasilitas[];
    };
}

export interface KioskStoreResponse {
    success: boolean;
    message: string;
    data?: {
        antrian?: CreatedTicket;
    };
}

export const getKioskPolis = async (): Promise<KioskPolisResponse> => {
    const response = await api.get<KioskPolisResponse>('/api/v1/kiosk/polis');

    return response.data;
};

export const getKioskDokters = async (): Promise<KioskDoktersResponse> => {
    const response = await api.get<KioskDoktersResponse>(
        '/api/v1/kiosk/dokters',
    );

    return response.data;
};

export const getKioskBeritas = async (
    page = 1,
): Promise<KioskBeritasResponse> => {
    const searchParams = new URLSearchParams({
        page: String(page),
        per_page: '8',
    });

    const response = await api.get<KioskBeritasResponse>(
        `/api/v1/kiosk/beritas?${searchParams.toString()}`,
    );

    return response.data;
};

export const getKioskPenawarans = async (
    page = 1,
): Promise<KioskPenawaransResponse> => {
    const searchParams = new URLSearchParams({
        page: String(page),
        per_page: '8',
    });

    const response = await api.get<KioskPenawaransResponse>(
        `/api/v1/kiosk/penawarans?${searchParams.toString()}`,
    );

    return response.data;
};

export const getKioskRuangans = async (): Promise<KioskRuangansResponse> => {
    const response = await api.get<KioskRuangansResponse>(
        '/api/v1/kiosk/ruangans',
    );

    return response.data;
};

export const getKioskFaqs = async (): Promise<KioskFaqsResponse> => {
    const response = await api.get<KioskFaqsResponse>('/api/v1/kiosk/faqs');

    return response.data;
};

export const getKioskTestimonials =
    async (): Promise<KioskTestimonialsResponse> => {
        const response = await api.get<KioskTestimonialsResponse>(
            '/api/v1/kiosk/testimonials',
        );

        return response.data;
    };

export const postKioskMessage = async (
    payload: MessagePayload,
): Promise<KioskMessageResponse> => {
    const response = await api.post<KioskMessageResponse>(
        '/api/v1/kiosk/messages',
        payload,
    );

    return response.data;
};

export const getKioskFasilitas = async (): Promise<KioskFasilitasResponse> => {
    const response = await api.get<KioskFasilitasResponse>(
        '/api/v1/kiosk/fasilitas',
    );

    return response.data;
};

export const getNowServing = async (): Promise<KioskNowServingResponse> => {
    const response = await api.get<KioskNowServingResponse>(
        '/api/v1/kiosk/now-serving',
    );

    return response.data;
};

export const storeKioskTicket = async (
    poliId: number,
): Promise<KioskStoreResponse> => {
    const response = await api.post<KioskStoreResponse>(
        '/api/v1/kiosk/tickets',
        { poli_id: poliId },
    );

    return response.data;
};
