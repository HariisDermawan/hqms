import api from '@/lib/axios';
import type { AntrianStatus } from './antrian';
import type { Berita } from './berita';
import type { Dokter } from './dokter';
import type { Pagination } from './dokter';
import type { Poli } from './poli';
import type { Ruangan } from './ruangan';

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

export interface KioskRuangansResponse {
    success: boolean;
    message: string;
    data?: {
        items?: Ruangan[];
    };
}

export interface KioskNowServingResponse {
    success: boolean;
    message: string;
    data?: {
        items?: NowServingItem[];
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

export const getKioskRuangans = async (): Promise<KioskRuangansResponse> => {
    const response = await api.get<KioskRuangansResponse>(
        '/api/v1/kiosk/ruangans',
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
