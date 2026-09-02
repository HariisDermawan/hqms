import api from '@/lib/axios';
import type { Pagination } from './dokter';

export interface Testimonial {
    id: number;
    pasien: {
        id: number;
        name: string | null;
        medical_record_number: string | null;
    } | null;
    name: string;
    role: string | null;
    message: string;
    rating: number;
    sort_order: number;
    is_active: boolean;
}

export interface TestimonialPayload {
    pasien_id?: number | null;
    name: string;
    role?: string;
    message: string;
    rating: number;
    sort_order?: number;
    is_active?: boolean;
}

export interface TestimonialListResponse {
    success: boolean;
    message: string;
    data?: {
        items?: Testimonial[];
        pagination?: Pagination;
    };
}

export interface TestimonialResponse {
    success: boolean;
    message: string;
    data?: {
        testimonial?: Testimonial;
    };
}

export const getTestimonials = async (
    page = 1,
    perPage?: number,
): Promise<TestimonialListResponse> => {
    const searchParams = new URLSearchParams({ page: String(page) });

    if (perPage) {
        searchParams.append('per_page', String(perPage));
    }

    const response = await api.get<TestimonialListResponse>(
        `/api/v1/testimonials?${searchParams.toString()}`,
    );

    return response.data;
};

export const getTestimonial = async (
    id: number,
): Promise<TestimonialResponse> => {
    const response = await api.get<TestimonialResponse>(
        `/api/v1/testimonials/${id}`,
    );

    return response.data;
};

export const storeTestimonial = async (
    payload: TestimonialPayload,
): Promise<TestimonialResponse> => {
    const response = await api.post<TestimonialResponse>(
        '/api/v1/testimonials',
        payload,
    );

    return response.data;
};

export const updateTestimonial = async (
    id: number,
    payload: TestimonialPayload,
): Promise<TestimonialResponse> => {
    const response = await api.put<TestimonialResponse>(
        `/api/v1/testimonials/${id}`,
        payload,
    );

    return response.data;
};

export const deleteTestimonial = async (
    id: number,
): Promise<{ success: boolean; message: string }> => {
    const response = await api.delete(`/api/v1/testimonials/${id}`);

    return response.data;
};
