import api from '@/lib/axios';
import type { AntrianStatus } from './antrian';
import type { Poli } from './poli';

export interface KioskPoli extends Poli {}

export interface KioskTicketPasien {
    name: string;
    medical_record_number: string | null;
}

export interface NowServingItem {
    queue_number: string;
    status: AntrianStatus;
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
    poli: { id: number; code: string; name: string } | null;
}

export interface KioskPolisResponse {
    success: boolean;
    message: string;
    data?: {
        items?: KioskPoli[];
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
