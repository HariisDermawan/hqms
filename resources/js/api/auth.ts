import api from '@/lib/axios';

export interface LoginPayload {
    email: string;
    password: string;
}

export interface LoginResponse {
    success: boolean;
    message: string;
    data?: {
        user?: any;
        token?: string;
    };
}

export const login = async (
    payload: LoginPayload
): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>(
        '/api/v1/auth/login',
        payload
    );

    return response.data;
};
