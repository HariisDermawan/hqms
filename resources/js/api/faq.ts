import api from '@/lib/axios';
import type { Pagination } from './dokter';

export interface Faq {
    id: number;
    question: string;
    answer: string;
    sort_order: number;
    is_active: boolean;
}

export interface FaqPayload {
    question: string;
    answer: string;
    sort_order?: number;
    is_active?: boolean;
}

export interface FaqListResponse {
    success: boolean;
    message: string;
    data?: {
        items?: Faq[];
        pagination?: Pagination;
    };
}

export interface FaqResponse {
    success: boolean;
    message: string;
    data?: {
        faq?: Faq;
    };
}

export const getFaqs = async (
    page = 1,
    perPage?: number,
): Promise<FaqListResponse> => {
    const searchParams = new URLSearchParams({ page: String(page) });

    if (perPage) {
        searchParams.append('per_page', String(perPage));
    }

    const response = await api.get<FaqListResponse>(
        `/api/v1/faqs?${searchParams.toString()}`,
    );

    return response.data;
};

export const getFaq = async (id: number): Promise<FaqResponse> => {
    const response = await api.get<FaqResponse>(`/api/v1/faqs/${id}`);

    return response.data;
};

export const storeFaq = async (payload: FaqPayload): Promise<FaqResponse> => {
    const response = await api.post<FaqResponse>('/api/v1/faqs', payload);

    return response.data;
};

export const updateFaq = async (
    id: number,
    payload: FaqPayload,
): Promise<FaqResponse> => {
    const response = await api.put<FaqResponse>(`/api/v1/faqs/${id}`, payload);

    return response.data;
};

export const deleteFaq = async (
    id: number,
): Promise<{ success: boolean; message: string }> => {
    const response = await api.delete<{ success: boolean; message: string }>(
        `/api/v1/faqs/${id}`,
    );

    return response.data;
};
