import api from '@/lib/axios';

export interface Dokter {
    id: number;
    code: string;
    name: string;
    specialization?: string | null;
    sip_number: string;
    phone?: string | null;
    image_url?: string | null;
    is_active: boolean;
}

export interface Pagination {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
    from: number | null;
    to: number | null;
}

export interface DokterListResponse {
    success: boolean;
    message: string;
    data?: {
        items?: Dokter[];
        pagination?: Pagination;
    };
}

export const getDokters = async (): Promise<DokterListResponse> => {
    const response = await api.get<DokterListResponse>('/api/v1/dokters');

    return response.data;
};
