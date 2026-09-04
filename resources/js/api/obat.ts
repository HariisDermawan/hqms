import api from '@/lib/axios';
import type { Pagination } from './dokter';

export interface ObatPemeriksaanInfo {
    id: number;
    queue_number: string | null;
    examined_at: string | null;
    diagnosis: string | null;
    pasien: {
        id: number;
        medical_record_number: string;
        name: string;
    } | null;
    poli: { id: number; name: string } | null;
}

export interface Obat {
    id: number;
    nama_obat: string;
    dosis: string | null;
    jumlah: number;
    satuan: string | null;
    harga: string | number;
    keterangan: string | null;
    pemeriksaan?: ObatPemeriksaanInfo | null;
    created_at?: string | null;
}

export interface ObatPayload {
    pemeriksaan_id: number;
    nama_obat: string;
    dosis?: string;
    jumlah?: number;
    satuan?: string;
    harga?: number;
    keterangan?: string;
}

export interface ObatListResponse {
    success: boolean;
    message: string;
    data?: {
        items?: Obat[];
        pagination?: Pagination;
    };
}

export interface ObatResponse {
    success: boolean;
    message: string;
    data?: {
        obat?: Obat;
    };
}

export const getObats = async (
    page = 1,
    perPage?: number,
): Promise<ObatListResponse> => {
    const searchParams = new URLSearchParams({ page: String(page) });

    if (perPage) {
        searchParams.append('per_page', String(perPage));
    }

    const response = await api.get<ObatListResponse>(
        `/api/v1/obats?${searchParams.toString()}`,
    );

    return response.data;
};

export const getObat = async (id: number): Promise<ObatResponse> => {
    const response = await api.get<ObatResponse>(`/api/v1/obats/${id}`);

    return response.data;
};

export const storeObat = async (
    payload: ObatPayload,
): Promise<ObatResponse> => {
    const response = await api.post<ObatResponse>('/api/v1/obats', payload);

    return response.data;
};

export const updateObat = async (
    id: number,
    payload: ObatPayload,
): Promise<ObatResponse> => {
    const response = await api.put<ObatResponse>(
        `/api/v1/obats/${id}`,
        payload,
    );

    return response.data;
};

export const deleteObat = async (
    id: number,
): Promise<{ success: boolean; message: string }> => {
    const response = await api.delete(`/api/v1/obats/${id}`);

    return response.data;
};
