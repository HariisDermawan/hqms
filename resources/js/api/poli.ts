import api from '@/lib/axios';
import type { Pagination } from './dokter';

export interface Poli {
    id: number;
    code: string;
    name: string;
    description: string | null;
    image_url: string | null;
    is_active: boolean;
}

export interface PoliPayload {
    code: string;
    name: string;
    description?: string;
    is_active?: boolean;
}

export interface PoliListResponse {
    success: boolean;
    message: string;
    data?: {
        items?: Poli[];
        pagination?: Pagination;
    };
}

export interface PoliResponse {
    success: boolean;
    message: string;
    data?: {
        poli?: Poli;
    };
}

export const getPolis = async (page = 1): Promise<PoliListResponse> => {
    const response = await api.get<PoliListResponse>(
        `/api/v1/polis?page=${page}`,
    );

    return response.data;
};

export const getPoli = async (id: number): Promise<PoliResponse> => {
    const response = await api.get<PoliResponse>(`/api/v1/polis/${id}`);

    return response.data;
};

export const storePoli = async (
    payload: PoliPayload,
    image?: File,
): Promise<PoliResponse> => {
    const formData = new FormData();

    formData.append('code', payload.code);
    formData.append('name', payload.name);
    formData.append('description', payload.description ?? '');

    if (image) {
        formData.append('image', image);
    }

    formData.append('is_active', payload.is_active ? '1' : '0');

    const response = await api.post<PoliResponse>('/api/v1/polis', formData);

    return response.data;
};

export const updatePoli = async (
    id: number,
    payload: PoliPayload,
    image?: File,
): Promise<PoliResponse> => {
    const formData = new FormData();

    formData.append('_method', 'PUT');
    formData.append('code', payload.code);
    formData.append('name', payload.name);
    formData.append('description', payload.description ?? '');

    if (image) {
        formData.append('image', image);
    }

    formData.append('is_active', payload.is_active ? '1' : '0');

    const response = await api.post<PoliResponse>(
        `/api/v1/polis/${id}`,
        formData,
    );

    return response.data;
};

export const deletePoli = async (
    id: number,
): Promise<{ success: boolean; message: string }> => {
    const response = await api.delete(`/api/v1/polis/${id}`);

    return response.data;
};
