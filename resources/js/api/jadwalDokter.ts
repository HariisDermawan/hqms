import api from '@/lib/axios';
import type { Dokter, Pagination } from './dokter';

export interface JadwalDokter {
    id: number;
    dokter: Pick<
        Dokter,
        'id' | 'code' | 'name' | 'specialization' | 'image_url'
    > | null;
    poli: { id: number; code: string; name: string } | null;
    day: string;
    start_time: string;
    end_time: string;
    is_active: boolean;
}

export interface JadwalDokterPayload {
    dokter_id: number;
    poli_id: number;
    day: string;
    start_time: string;
    end_time: string;
    is_active?: boolean;
}

export interface JadwalDokterListResponse {
    success: boolean;
    message: string;
    data?: {
        items?: JadwalDokter[];
        pagination?: Pagination;
    };
}

export interface JadwalDokterResponse {
    success: boolean;
    message: string;
    data?: {
        jadwal_dokter?: JadwalDokter;
    };
}

export const getJadwalDokters = async (params?: {
    poliId?: number;
    dokterId?: number;
    perPage?: number;
}): Promise<JadwalDokterListResponse> => {
    const searchParams = new URLSearchParams();

    if (params?.poliId) {
        searchParams.append('poli_id', String(params.poliId));
    }

    if (params?.dokterId) {
        searchParams.append('dokter_id', String(params.dokterId));
    }

    if (params?.perPage) {
        searchParams.append('per_page', String(params.perPage));
    }

    const query = searchParams.toString();

    const response = await api.get<JadwalDokterListResponse>(
        `/api/v1/jadwal-dokters${query ? `?${query}` : ''}`,
    );

    return response.data;
};

export const getJadwalDokter = async (
    id: number,
): Promise<JadwalDokterResponse> => {
    const response = await api.get<JadwalDokterResponse>(
        `/api/v1/jadwal-dokters/${id}`,
    );

    return response.data;
};

export const storeJadwalDokter = async (
    payload: JadwalDokterPayload,
): Promise<JadwalDokterResponse> => {
    const response = await api.post<JadwalDokterResponse>(
        '/api/v1/jadwal-dokters',
        payload,
    );

    return response.data;
};

export const updateJadwalDokter = async (
    id: number,
    payload: JadwalDokterPayload,
): Promise<JadwalDokterResponse> => {
    const response = await api.put<JadwalDokterResponse>(
        `/api/v1/jadwal-dokters/${id}`,
        payload,
    );

    return response.data;
};

export const deleteJadwalDokter = async (
    id: number,
): Promise<{ success: boolean; message: string }> => {
    const response = await api.delete(`/api/v1/jadwal-dokters/${id}`);

    return response.data;
};
