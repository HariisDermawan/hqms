import api from '@/lib/axios';
import type { Pagination } from './dokter';

export interface Berita {
    id: number;
    title: string;
    slug: string;
    description: string | null;
    image_url: string | null;
}

export interface BeritaPayload {
    title: string;
    slug: string;
    description?: string;
}

export interface BeritaListResponse {
    success: boolean;
    message: string;
    data?: {
        items?: Berita[];
        pagination?: Pagination;
    };
}

export interface BeritaResponse {
    success: boolean;
    message: string;
    data?: {
        berita?: Berita;
    };
}

export const getBeritas = async (
    page = 1,
    perPage?: number,
): Promise<BeritaListResponse> => {
    const searchParams = new URLSearchParams({ page: String(page) });

    if (perPage) {
        searchParams.append('per_page', String(perPage));
    }

    const response = await api.get<BeritaListResponse>(
        `/api/v1/beritas?${searchParams.toString()}`,
    );

    return response.data;
};

export const getBerita = async (id: number): Promise<BeritaResponse> => {
    const response = await api.get<BeritaResponse>(`/api/v1/beritas/${id}`);

    return response.data;
};

export const storeBerita = async (
    payload: BeritaPayload,
    image: File,
): Promise<BeritaResponse> => {
    const formData = new FormData();

    formData.append('title', payload.title);
    formData.append('slug', payload.slug);
    formData.append('description', payload.description ?? '');
    formData.append('image', image);

    const response = await api.post<BeritaResponse>(
        '/api/v1/beritas',
        formData,
    );

    return response.data;
};

export const updateBerita = async (
    id: number,
    payload: BeritaPayload,
    image?: File,
): Promise<BeritaResponse> => {
    const formData = new FormData();

    formData.append('_method', 'PUT');
    formData.append('title', payload.title);
    formData.append('slug', payload.slug);
    formData.append('description', payload.description ?? '');

    if (image) {
        formData.append('image', image);
    }

    const response = await api.post<BeritaResponse>(
        `/api/v1/beritas/${id}`,
        formData,
    );

    return response.data;
};

export const deleteBerita = async (
    id: number,
): Promise<{ success: boolean; message: string }> => {
    const response = await api.delete(`/api/v1/beritas/${id}`);

    return response.data;
};
