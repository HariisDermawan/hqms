import api from '@/lib/axios';
import type { Pagination } from './dokter';

export interface Fasilitas {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    image_url: string | null;
    is_active: boolean;
    ruangans_count?: number;
}

export interface FasilitasPayload {
    name: string;
    slug: string;
    description?: string;
    is_active?: boolean;
}

export interface FasilitasListResponse {
    success: boolean;
    message: string;
    data?: {
        items?: Fasilitas[];
        pagination?: Pagination;
    };
}

export interface FasilitasResponse {
    success: boolean;
    message: string;
    data?: {
        fasilitas?: Fasilitas;
    };
}

export const getFasilitases = async (
    page = 1,
    perPage?: number,
): Promise<FasilitasListResponse> => {
    const searchParams = new URLSearchParams({ page: String(page) });

    if (perPage) {
        searchParams.append('per_page', String(perPage));
    }

    const response = await api.get<FasilitasListResponse>(
        `/api/v1/fasilitas?${searchParams.toString()}`,
    );

    return response.data;
};

export const getFasilitas = async (
    idOrSlug: number | string,
): Promise<FasilitasResponse & { data?: { ruangans?: any[] } }> => {
    const response = await api.get(`/api/v1/fasilitas/${idOrSlug}`);

    return response.data;
};

export const storeFasilitas = async (
    payload: FasilitasPayload,
    image?: File,
): Promise<FasilitasResponse> => {
    const formData = new FormData();

    formData.append('name', payload.name);
    formData.append('slug', payload.slug);
    formData.append('description', payload.description ?? '');
    formData.append('is_active', payload.is_active ? '1' : '0');

    if (image) {
        formData.append('image', image);
    }

    const response = await api.post<FasilitasResponse>(
        '/api/v1/fasilitas',
        formData,
    );

    return response.data;
};

export const updateFasilitas = async (
    id: number | string,
    payload: FasilitasPayload,
    image?: File,
): Promise<FasilitasResponse> => {
    const formData = new FormData();

    formData.append('_method', 'PUT');
    formData.append('name', payload.name);
    formData.append('slug', payload.slug);
    formData.append('description', payload.description ?? '');
    formData.append('is_active', payload.is_active ? '1' : '0');

    if (image) {
        formData.append('image', image);
    }

    const response = await api.post<FasilitasResponse>(
        `/api/v1/fasilitas/${id}`,
        formData,
    );

    return response.data;
};

export const deleteFasilitas = async (
    id: number,
): Promise<{ success: boolean; message: string }> => {
    const response = await api.delete(`/api/v1/fasilitas/${id}`);

    return response.data;
};

export const getKioskFasilitases = async (): Promise<FasilitasListResponse> => {
    const response = await api.get<FasilitasListResponse>(
        '/api/v1/kiosk/fasilitas',
    );

    return response.data;
};
