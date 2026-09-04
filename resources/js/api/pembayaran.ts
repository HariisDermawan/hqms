import api from '@/lib/axios';
import type { Pagination } from './dokter';

export type MetodePembayaran =
    | 'cash'
    | 'transfer'
    | 'debit'
    | 'credit'
    | 'qris';

export type StatusPembayaran = 'unpaid' | 'paid' | 'refunded' | 'cancelled';

export interface DetailItem {
    description: string;
    quantity?: number;
    unit_price?: number;
}

export interface PembayaranPemeriksaanInfo {
    id: number;
    queue_number: string | null;
    examined_at: string | null;
    diagnosis: string | null;
    pasien: {
        id: number;
        medical_record_number: string;
        name: string;
    } | null;
    poli: { id: number; name: string } | null;
}

export interface Pembayaran {
    id: number;
    invoice_number: string;
    total: string | number;
    metode: MetodePembayaran;
    status: StatusPembayaran;
    tanggal: string | null;
    detail_items: DetailItem[] | null;
    keterangan: string | null;
    pemeriksaan?: PembayaranPemeriksaanInfo | null;
    created_at?: string | null;
}

export interface PembayaranPayload {
    pemeriksaan_id: number;
    total?: number;
    metode: MetodePembayaran;
    status: StatusPembayaran;
    tanggal: string;
    detail_items?: DetailItem[];
    keterangan?: string;
}

export interface PembayaranListResponse {
    success: boolean;
    message: string;
    data?: {
        items?: Pembayaran[];
        pagination?: Pagination;
    };
}

export interface PembayaranResponse {
    success: boolean;
    message: string;
    data?: {
        pembayaran?: Pembayaran;
    };
}

export const getPembayarans = async (
    page = 1,
    perPage?: number,
): Promise<PembayaranListResponse> => {
    const searchParams = new URLSearchParams({ page: String(page) });

    if (perPage) {
        searchParams.append('per_page', String(perPage));
    }

    const response = await api.get<PembayaranListResponse>(
        `/api/v1/pembayarans?${searchParams.toString()}`,
    );

    return response.data;
};

export const getPembayaran = async (
    id: number,
): Promise<PembayaranResponse> => {
    const response = await api.get<PembayaranResponse>(
        `/api/v1/pembayarans/${id}`,
    );

    return response.data;
};

export const storePembayaran = async (
    payload: PembayaranPayload,
): Promise<PembayaranResponse> => {
    const response = await api.post<PembayaranResponse>(
        '/api/v1/pembayarans',
        payload,
    );

    return response.data;
};

export const updatePembayaran = async (
    id: number,
    payload: PembayaranPayload,
): Promise<PembayaranResponse> => {
    const response = await api.put<PembayaranResponse>(
        `/api/v1/pembayarans/${id}`,
        payload,
    );

    return response.data;
};

export const deletePembayaran = async (
    id: number,
): Promise<{ success: boolean; message: string }> => {
    const response = await api.delete(`/api/v1/pembayarans/${id}`);

    return response.data;
};
