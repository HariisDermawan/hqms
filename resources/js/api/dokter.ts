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

export interface DokterPayload {
    code: string;
    name: string;
    specialization?: string;
    sip_number: string;
    phone?: string;
    is_active?: boolean;
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

export interface DokterResponse {
    success: boolean;
    message: string;
    data?: {
        dokter?: Dokter;
    };
}

export const getDokters = async (
    page = 1,
    perPage?: number,
): Promise<DokterListResponse> => {
    const searchParams = new URLSearchParams({ page: String(page) });

    if (perPage) {
        searchParams.append('per_page', String(perPage));
    }

    const response = await api.get<DokterListResponse>(
        `/api/v1/dokters?${searchParams.toString()}`,
    );

    return response.data;
};

export const getDokter = async (id: number): Promise<DokterResponse> => {
    const response = await api.get<DokterResponse>(`/api/v1/dokters/${id}`);

    return response.data;
};

export const storeDokter = async (
    payload: DokterPayload,
    image?: File,
): Promise<DokterResponse> => {
    const formData = new FormData();

    formData.append('code', payload.code);
    formData.append('name', payload.name);
    formData.append('specialization', payload.specialization ?? '');
    formData.append('sip_number', payload.sip_number);
    formData.append('phone', payload.phone ?? '');

    if (image) {
        formData.append('image', image);
    }

    formData.append('is_active', payload.is_active ? '1' : '0');

    const response = await api.post<DokterResponse>(
        '/api/v1/dokters',
        formData,
    );

    return response.data;
};

export const updateDokter = async (
    id: number,
    payload: DokterPayload,
    image?: File,
): Promise<DokterResponse> => {
    const formData = new FormData();

    formData.append('_method', 'PUT');
    formData.append('code', payload.code);
    formData.append('name', payload.name);
    formData.append('specialization', payload.specialization ?? '');
    formData.append('sip_number', payload.sip_number);
    formData.append('phone', payload.phone ?? '');

    if (image) {
        formData.append('image', image);
    }

    formData.append('is_active', payload.is_active ? '1' : '0');

    const response = await api.post<DokterResponse>(
        `/api/v1/dokters/${id}`,
        formData,
    );

    return response.data;
};

export const deleteDokter = async (
    id: number,
): Promise<{ success: boolean; message: string }> => {
    const response = await api.delete(`/api/v1/dokters/${id}`);

    return response.data;
};
