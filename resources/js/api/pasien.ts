import api from '@/lib/axios';
import type { Pagination } from './dokter';

export interface PoliSummary {
    id: number;
    code: string;
    name: string;
}

export type Gender = 'L' | 'P';

export interface PasienRuangan {
    id: number;
    code: string;
    name: string;
    category: string;
    tanggal_masuk: string | null;
}

export interface Pasien {
    id: number;
    poli: PoliSummary | null;
    medical_record_number: string;
    name: string;
    nik: string;
    gender: Gender;
    birth_date: string;
    age: number;
    phone: string | null;
    address: string | null;
    is_active: boolean;
    ruangans?: PasienRuangan[];
}

export interface PasienPayload {
    poli_id: number;
    medical_record_number: string;
    name: string;
    nik: string;
    gender: Gender;
    birth_date: string;
    phone?: string;
    address?: string;
    is_active?: boolean;
}

export interface PasienListResponse {
    success: boolean;
    message: string;
    data?: {
        items?: Pasien[];
        pagination?: Pagination;
    };
}

export interface PasienResponse {
    success: boolean;
    message: string;
    data?: {
        pasien?: Pasien;
    };
}

export const getPasiens = async (
    page = 1,
    perPage?: number,
): Promise<PasienListResponse> => {
    const searchParams = new URLSearchParams();
    searchParams.append('page', String(page));

    if (perPage) {
        searchParams.append('per_page', String(perPage));
    }

    const response = await api.get<PasienListResponse>(
        `/api/v1/pasiens?${searchParams.toString()}`,
    );

    return response.data;
};

export const getPasien = async (id: number): Promise<PasienResponse> => {
    const response = await api.get<PasienResponse>(`/api/v1/pasiens/${id}`);

    return response.data;
};

export const storePasien = async (
    payload: PasienPayload,
): Promise<PasienResponse> => {
    const response = await api.post<PasienResponse>('/api/v1/pasiens', payload);

    return response.data;
};

export const updatePasien = async (
    id: number,
    payload: PasienPayload,
): Promise<PasienResponse> => {
    const response = await api.put<PasienResponse>(
        `/api/v1/pasiens/${id}`,
        payload,
    );

    return response.data;
};

export const deletePasien = async (
    id: number,
): Promise<{ success: boolean; message: string }> => {
    const response = await api.delete(`/api/v1/pasiens/${id}`);

    return response.data;
};
