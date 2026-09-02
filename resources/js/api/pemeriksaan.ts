import api from '@/lib/axios';
import type { AntrianStatus } from './antrian';
import type { Pagination } from './dokter';

export interface Pemeriksaan {
    id: number;
    antrian: {
        id: number;
        queue_number: string;
        status: AntrianStatus;
    } | null;
    pasien: {
        id: number;
        medical_record_number: string;
        name: string;
    } | null;
    poli: { id: number; code: string; name: string } | null;
    dokter: {
        id: number;
        code: string;
        name: string;
        specialization: string | null;
    } | null;
    examined_at: string | null;
    complaint: string | null;
    diagnosis: string | null;
    treatment: string | null;
    notes: string | null;
}

export interface PemeriksaanPayload {
    antrian_id: number;
    dokter_id: number;
    examined_at: string;
    complaint?: string;
    diagnosis?: string;
    treatment?: string;
    notes?: string;
}

export interface PemeriksaanListResponse {
    success: boolean;
    message: string;
    data?: {
        items?: Pemeriksaan[];
        pagination?: Pagination;
    };
}

export interface PemeriksaanResponse {
    success: boolean;
    message: string;
    data?: {
        pemeriksaan?: Pemeriksaan;
    };
}

export const getPemeriksaans = async (
    page = 1,
    perPage?: number,
): Promise<PemeriksaanListResponse> => {
    const searchParams = new URLSearchParams({ page: String(page) });

    if (perPage) {
        searchParams.append('per_page', String(perPage));
    }

    const response = await api.get<PemeriksaanListResponse>(
        `/api/v1/pemeriksaans?${searchParams.toString()}`,
    );

    return response.data;
};

export const getPemeriksaan = async (
    id: number,
): Promise<PemeriksaanResponse> => {
    const response = await api.get<PemeriksaanResponse>(
        `/api/v1/pemeriksaans/${id}`,
    );

    return response.data;
};

export const storePemeriksaan = async (
    payload: PemeriksaanPayload,
): Promise<PemeriksaanResponse> => {
    const response = await api.post<PemeriksaanResponse>(
        '/api/v1/pemeriksaans',
        payload,
    );

    return response.data;
};

export const updatePemeriksaan = async (
    id: number,
    payload: PemeriksaanPayload,
): Promise<PemeriksaanResponse> => {
    const response = await api.put<PemeriksaanResponse>(
        `/api/v1/pemeriksaans/${id}`,
        payload,
    );

    return response.data;
};

export const deletePemeriksaan = async (
    id: number,
): Promise<PemeriksaanResponse> => {
    const response = await api.delete<PemeriksaanResponse>(
        `/api/v1/pemeriksaans/${id}`,
    );

    return response.data;
};
