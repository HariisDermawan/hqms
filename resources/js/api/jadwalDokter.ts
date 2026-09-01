import api from '@/lib/axios';
import type { Dokter, Pagination } from './dokter';

export interface JadwalDokter {
    id: number;
    dokter: Pick<
        Dokter,
        'id' | 'code' | 'name' | 'specialization' | 'image_url'
    > | null;
    poli: { id: number; code: string; name: string } | null;
    day: string;
    start_time: string;
    end_time: string;
    is_active: boolean;
}

export interface JadwalDokterListResponse {
    success: boolean;
    message: string;
    data?: {
        items?: JadwalDokter[];
        pagination?: Pagination;
    };
}

export const getJadwalDokters = async (): Promise<JadwalDokterListResponse> => {
    const response = await api.get<JadwalDokterListResponse>(
        '/api/v1/jadwal-dokters',
    );

    return response.data;
};
