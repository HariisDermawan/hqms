import api from '@/lib/axios';
import type { Pagination } from './dokter';

export interface Penawaran {
    id: number;
    title: string;
    slug: string;
    description: string | null;
    image_url: string | null;
}

export interface PenawaranPayload {
    title: string;
    slug: string;
    description?: string;
}

export interface PenawaranListResponse {
    success: boolean;
    message: string;
    data?: {
        items?: Penawaran[];
        pagination?: Pagination;
    };
}

export interface PenawaranResponse {
    success: boolean;
    message: string;
    data?: {
        penawaran?: Penawaran;
    };
}

export const getPenawarans = async (
    page = 1,
    perPage?: number,
): Promise<PenawaranListResponse> => {
    const searchParams = new URLSearchParams({ page: String(page) });

    if (perPage) {
        searchParams.append('per_page', String(perPage));
    }

    const response = await api.get<PenawaranListResponse>(
        `/api/v1/penawarans?${searchParams.toString()}`,
    );

    return response.data;
};

export const getPenawaran = async (id: number): Promise<PenawaranResponse> => {
    const response = await api.get<PenawaranResponse>(
        `/api/v1/penawarans/${id}`,
    );

    return response.data;
};

export const storePenawaran = async (
    payload: PenawaranPayload,
    image: File,
): Promise<PenawaranResponse> => {
    const formData = new FormData();

    formData.append('title', payload.title);
    formData.append('slug', payload.slug);
    formData.append('description', payload.description ?? '');
    formData.append('image', image);

    const response = await api.post<PenawaranResponse>(
        '/api/v1/penawarans',
        formData,
    );

    return response.data;
};

export const updatePenawaran = async (
    id: number,
    payload: PenawaranPayload,
    image?: File,
): Promise<PenawaranResponse> => {
    const formData = new FormData();

    formData.append('_method', 'PUT');
    formData.append('title', payload.title);
    formData.append('slug', payload.slug);
    formData.append('description', payload.description ?? '');

    if (image) {
        formData.append('image', image);
    }

    const response = await api.post<PenawaranResponse>(
        `/api/v1/penawarans/${id}`,
        formData,
    );

    return response.data;
};

export const deletePenawaran = async (
    id: number,
): Promise<{ success: boolean; message: string }> => {
    const response = await api.delete(`/api/v1/penawarans/${id}`);

    return response.data;
};
