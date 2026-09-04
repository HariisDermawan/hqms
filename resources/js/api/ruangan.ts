import api from '@/lib/axios';
import type { Gender } from './pasien';
import type { Pagination } from './dokter';

export interface RuanganPasienItem {
    id: number;
    pasien_id: number;
    antrian_id: number | null;
    pendaftaran_id: number | null;
    name: string;
    mrn: string | null;
    gender: Gender | null;
    age: number | null;
    queue_number: string | null;
    poli: { id: number | null; name: string | null } | null;
    tanggal_masuk: string | null;
    tanggal_keluar: string | null;
}

export interface Ruangan {
    id: number;
    code: string;
    name: string;
    category: string;
    description: string | null;
    is_active: boolean;
    pasiens?: RuanganPasienItem[];
}

export interface RuanganPayload {
    code: string;
    name: string;
    category: string;
    description?: string;
    is_active?: boolean;
}

export interface RuanganListResponse {
    success: boolean;
    message: string;
    data?: {
        items?: Ruangan[];
        pagination?: Pagination;
    };
}

export interface RuanganResponse {
    success: boolean;
    message: string;
    data?: {
        ruangan?: Ruangan;
    };
}

export const getRuangans = async (
    page = 1,
    perPage?: number,
): Promise<RuanganListResponse> => {
    const searchParams = new URLSearchParams({ page: String(page) });

    if (perPage) {
        searchParams.append('per_page', String(perPage));
    }

    const response = await api.get<RuanganListResponse>(
        `/api/v1/ruangans?${searchParams.toString()}`,
    );

    return response.data;
};

export const getRuangan = async (id: number): Promise<RuanganResponse> => {
    const response = await api.get<RuanganResponse>(`/api/v1/ruangans/${id}`);

    return response.data;
};

export const storeRuangan = async (
    payload: RuanganPayload,
): Promise<RuanganResponse> => {
    const response = await api.post<RuanganResponse>(
        '/api/v1/ruangans',
        payload,
    );

    return response.data;
};

export const updateRuangan = async (
    id: number,
    payload: RuanganPayload,
): Promise<RuanganResponse> => {
    const response = await api.put<RuanganResponse>(
        `/api/v1/ruangans/${id}`,
        payload,
    );

    return response.data;
};

export const deleteRuangan = async (
    id: number,
): Promise<{ success: boolean; message: string }> => {
    const response = await api.delete(`/api/v1/ruangans/${id}`);

    return response.data;
};

export interface AssignRuanganPasienResponse {
    success: boolean;
    message: string;
    data?: {
        ruangan?: Ruangan;
        item?: RuanganPasienItem;
    };
}

export interface AssignRuanganPasienPayload {
    pasien_id: number;
    antrian_id?: number;
    pendaftaran_id?: number;
}

export const assignRuanganPasien = async (
    ruanganId: number,
    payload: AssignRuanganPasienPayload,
): Promise<AssignRuanganPasienResponse> => {
    const response = await api.post<AssignRuanganPasienResponse>(
        `/api/v1/ruangans/${ruanganId}/pasiens`,
        payload,
    );

    return response.data;
};

export const removeRuanganPasien = async (
    ruanganId: number,
    itemId: number,
): Promise<AssignRuanganPasienResponse> => {
    const response = await api.delete<AssignRuanganPasienResponse>(
        `/api/v1/ruangans/${ruanganId}/pasiens/${itemId}`,
    );

    return response.data;
};
