import api from '@/lib/axios';

export type PresensiStatus = 'hadir' | 'ijin' | 'sakit' | 'cuti' | 'alpa';

export interface Presensi {
    id: number;
    perawat_id: number;
    date: string;
    time_in: string | null;
    time_out: string | null;
    status: PresensiStatus;
    note?: string | null;
    perawat?: {
        id: number;
        name: string;
        code: string;
        str_number?: string;
        gender?: 'L' | 'P';
        gender_label?: string;
        image_url?: string | null;
    } | null;
}

export interface PresensiPayload {
    perawat_id: number;
    date: string;
    time_in?: string;
    time_out?: string;
    status: PresensiStatus;
    note?: string;
}

export interface Pagination {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
    from: number | null;
    to: number | null;
}

export interface PresensiListResponse {
    success: boolean;
    message: string;
    data?: {
        items?: Presensi[];
        pagination?: Pagination;
    };
}

export interface PresensiResponse {
    success: boolean;
    message: string;
    data?: {
        presensi?: Presensi;
    };
}

export const getPresensis = async (
    page = 1,
    perPage?: number,
): Promise<PresensiListResponse> => {
    const searchParams = new URLSearchParams({ page: String(page) });

    if (perPage) {
        searchParams.append('per_page', String(perPage));
    }

    const response = await api.get<PresensiListResponse>(
        `/api/v1/presensis?${searchParams.toString()}`,
    );

    return response.data;
};

export const getPresensi = async (id: number): Promise<PresensiResponse> => {
    const response = await api.get<PresensiResponse>(`/api/v1/presensis/${id}`);

    return response.data;
};

export const storePresensi = async (
    payload: PresensiPayload,
): Promise<PresensiResponse> => {
    const response = await api.post<PresensiResponse>('/api/v1/presensis', {
        ...payload,
        time_in: payload.time_in || null,
        time_out: payload.time_out || null,
        note: payload.note || null,
    });

    return response.data;
};

export const updatePresensi = async (
    id: number,
    payload: PresensiPayload,
): Promise<PresensiResponse> => {
    const response = await api.put<PresensiResponse>(
        `/api/v1/presensis/${id}`,
        {
            ...payload,
            time_in: payload.time_in || null,
            time_out: payload.time_out || null,
            note: payload.note || null,
        },
    );

    return response.data;
};

export const deletePresensi = async (
    id: number,
): Promise<{ success: boolean; message: string }> => {
    const response = await api.delete(`/api/v1/presensis/${id}`);

    return response.data;
};
