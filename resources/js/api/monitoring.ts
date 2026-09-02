import api from '@/lib/axios';

export interface MonitoringSummary {
    total_pasien: number;
    total_poli: number;
    pendaftaran_hari_ini: number;
    pendaftaran_bulan_ini: number;
    antrian_hari_ini: number;
    pemeriksaan_hari_ini: number;
    pemeriksaan_bulan_ini: number;
}

export interface BarDatum {
    label: string | number;
    jumlah: number;
}

export interface CountDatum {
    name: string;
    status: string;
    value: number;
}

export interface MonitoringCharts {
    pasien_per_month: BarDatum[];
    pasien_per_poli: BarDatum[];
    pendaftaran_per_day: BarDatum[];
    pendaftaran_per_poli: BarDatum[];
    antrian_status: CountDatum[];
}

export interface MonitoringStats {
    summary: MonitoringSummary;
    charts: MonitoringCharts;
}

export interface MonitoringResponse {
    success: boolean;
    message: string;
    data?: MonitoringStats;
}

export const getMonitoring = async (): Promise<MonitoringResponse> => {
    const response = await api.get<MonitoringResponse>('/api/v1/monitoring');

    return response.data;
};
