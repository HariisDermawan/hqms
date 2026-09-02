import api from '@/lib/axios';
import type { Pagination } from './dokter';

export type AntrianStatus =
    | 'waiting'
    | 'called'
    | 'serving'
    | 'completed'
    | 'skipped';

export interface Antrian {
    id: number;
    queue_number: string;
    status: AntrianStatus;
    called_at: string | null;
    started_at: string | null;
    completed_at: string | null;
    notes: string | null;
    pendaftaran: {
        id: number;
        registration_number: string;
        registration_date: string;
    } | null;
    pasien: {
        id: number;
        medical_record_number: string;
        name: string;
    } | null;
    poli: { id: number; code: string; name: string } | null;
}

export interface AntrianPayload {
    pendaftaran_id: number;
    notes?: string;
}

export interface AntrianStatusPayload {
    status: AntrianStatus;
    notes?: string;
}

export interface AntrianListResponse {
    success: boolean;
    message: string;
    data?: {
        items?: Antrian[];
        pagination?: Pagination;
    };
}

export interface AntrianResponse {
    success: boolean;
    message: string;
    data?: {
        antrian?: Antrian;
    };
}

export const getAntrians = async (params?: {
    perPage?: number;
}): Promise<AntrianListResponse> => {
    const searchParams = new URLSearchParams();

    if (params?.perPage) {
        searchParams.append('per_page', String(params.perPage));
    }

    const query = searchParams.toString();

    const response = await api.get<AntrianListResponse>(
        `/api/v1/antrians${query ? `?${query}` : ''}`,
    );

    return response.data;
};

export const getAntrian = async (id: number): Promise<AntrianResponse> => {
    const response = await api.get<AntrianResponse>(`/api/v1/antrians/${id}`);

    return response.data;
};

export const storeAntrian = async (
    payload: AntrianPayload,
): Promise<AntrianResponse> => {
    const response = await api.post<AntrianResponse>(
        '/api/v1/antrians',
        payload,
    );

    return response.data;
};

export const updateAntrian = async (
    id: number,
    payload: AntrianStatusPayload,
): Promise<AntrianResponse> => {
    const response = await api.put<AntrianResponse>(
        `/api/v1/antrians/${id}`,
        payload,
    );

    return response.data;
};

export const deleteAntrian = async (
    id: number,
): Promise<{ success: boolean; message: string }> => {
    const response = await api.delete(`/api/v1/antrians/${id}`);

    return response.data;
};
