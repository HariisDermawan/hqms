import api from '@/lib/axios';

export interface Perawat {
    id: number;
    code: string;
    name: string;
    gender: 'L' | 'P';
    gender_label?: string;
    str_number: string;
    rfid_id?: string | null;
    phone?: string | null;
    image_url?: string | null;
    is_active: boolean;
}

export interface PerawatPayload {
    code: string;
    name: string;
    gender: 'L' | 'P';
    str_number: string;
    rfid_id?: string;
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

export interface PerawatListResponse {
    success: boolean;
    message: string;
    data?: {
        items?: Perawat[];
        pagination?: Pagination;
    };
}

export interface PerawatResponse {
    success: boolean;
    message: string;
    data?: {
        perawat?: Perawat;
    };
}

export const getPerawats = async (
    page = 1,
    perPage?: number,
): Promise<PerawatListResponse> => {
    const searchParams = new URLSearchParams({ page: String(page) });

    if (perPage) {
        searchParams.append('per_page', String(perPage));
    }

    const response = await api.get<PerawatListResponse>(
        `/api/v1/perawats?${searchParams.toString()}`,
    );

    return response.data;
};

export const getPerawat = async (id: number): Promise<PerawatResponse> => {
    const response = await api.get<PerawatResponse>(`/api/v1/perawats/${id}`);

    return response.data;
};

export const storePerawat = async (
    payload: PerawatPayload,
    image?: File,
): Promise<PerawatResponse> => {
    const formData = new FormData();

    formData.append('code', payload.code);
    formData.append('name', payload.name);
    formData.append('gender', payload.gender);
    formData.append('str_number', payload.str_number);
    formData.append('rfid_id', payload.rfid_id ?? '');
    formData.append('phone', payload.phone ?? '');

    if (image) {
        formData.append('image', image);
    }

    formData.append('is_active', payload.is_active ? '1' : '0');

    const response = await api.post<PerawatResponse>(
        '/api/v1/perawats',
        formData,
    );

    return response.data;
};

export const updatePerawat = async (
    id: number,
    payload: PerawatPayload,
    image?: File,
): Promise<PerawatResponse> => {
    const formData = new FormData();

    formData.append('_method', 'PUT');
    formData.append('code', payload.code);
    formData.append('name', payload.name);
    formData.append('gender', payload.gender);
    formData.append('str_number', payload.str_number);
    formData.append('rfid_id', payload.rfid_id ?? '');
    formData.append('phone', payload.phone ?? '');

    if (image) {
        formData.append('image', image);
    }

    formData.append('is_active', payload.is_active ? '1' : '0');

    const response = await api.post<PerawatResponse>(
        `/api/v1/perawats/${id}`,
        formData,
    );

    return response.data;
};

export const deletePerawat = async (
    id: number,
): Promise<{ success: boolean; message: string }> => {
    const response = await api.delete(`/api/v1/perawats/${id}`);

    return response.data;
};
