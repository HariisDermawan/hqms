import api from '@/lib/axios';

export type AttendanceAction = 'in' | 'out' | 'complete';
export interface AttendanceScanResult {
    action: AttendanceAction;
    time_in: string | null;
    time_out: string | null;
    perawat: {
        id: number;
        code: string;
        name: string;
        gender: 'L' | 'P';
        gender_label: string;
        image_url?: string | null;
    };
}

export interface AttendanceErrorData {
    action: 'error';
    reason?: 'not_found' | 'duplicate';
}

export interface AttendanceScanResponse {
    success: boolean;
    message: string;
    data?: AttendanceScanResult | AttendanceErrorData;
}

export const scanAttendance = async (
    rfidId: string,
): Promise<AttendanceScanResponse> => {
    const response = await api.post<AttendanceScanResponse>(
        '/api/v1/kiosk/attendance/scan',
        { rfid_id: rfidId },
    );

    return response.data;
};
