import api from '@/lib/axios';
import type { Pagination } from './dokter';

export type PendaftaranStatus =
    | 'waiting'
    | 'called'
    | 'serving'
    | 'completed'
    | 'cancelled';

export interface Pendaftaran {
    id: number;
    registration_number: string;
    queue_number: string;
    registration_date: string;
    status: PendaftaranStatus;
    notes: string | null;
    pasien: {
        id: number;
        medical_record_number: string;
        name: string;
        nik: string;
    } | null;
    poli: { id: number; code: string; name: string } | null;
}

export interface PendaftaranPayload {
    pasien_id: number;
    poli_id: number;
    registration_date: string;
    notes?: string;
    status?: PendaftaranStatus;
}

export interface PendaftaranListResponse {
    success: boolean;
    message: string;
    data?: {
        items?: Pendaftaran[];
        pagination?: Pagination;
    };
}

export interface PendaftaranResponse {
    success: boolean;
    message: string;
    data?: {
        pendaftaran?: Pendaftaran;
    };
}

export const getPendaftarans = async (
    page = 1,
    perPage?: number,
): Promise<PendaftaranListResponse> => {
    const searchParams = new URLSearchParams();
    searchParams.append('page', String(page));

    if (perPage) {
        searchParams.append('per_page', String(perPage));
    }

    const response = await api.get<PendaftaranListResponse>(
        `/api/v1/pendaftarans?${searchParams.toString()}`,
    );

    return response.data;
};

export const getPendaftaran = async (
    id: number,
): Promise<PendaftaranResponse> => {
    const response = await api.get<PendaftaranResponse>(
        `/api/v1/pendaftarans/${id}`,
    );

    return response.data;
};

export const storePendaftaran = async (
    payload: PendaftaranPayload,
): Promise<PendaftaranResponse> => {
    const response = await api.post<PendaftaranResponse>(
        '/api/v1/pendaftarans',
        payload,
    );

    return response.data;
};

export const updatePendaftaran = async (
    id: number,
    payload: PendaftaranPayload,
): Promise<PendaftaranResponse> => {
    const response = await api.put<PendaftaranResponse>(
        `/api/v1/pendaftarans/${id}`,
        payload,
    );

    return response.data;
};

export const deletePendaftaran = async (
    id: number,
): Promise<{ success: boolean; message: string }> => {
    const response = await api.delete(`/api/v1/pendaftarans/${id}`);

    return response.data;
};
