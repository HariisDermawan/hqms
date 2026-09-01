import api from '@/lib/axios';

export interface LoginPayload {
    email: string;
    password: string;
}

export interface LoginResponse {
    success: boolean;
    message: string;
    data?: {
        user?: {
            id: number;
            name: string;
            email: string;
        };
    };
}

export const login = async (
    payload: LoginPayload
): Promise<LoginResponse> => {

    // WAJIB untuk Sanctum SPA
    await api.get('/sanctum/csrf-cookie');

    const response = await api.post<LoginResponse>(
        '/api/v1/auth/login',
        payload
    );

    return response.data;
};

export const me = async (): Promise<LoginResponse> => {
    const response = await api.get<LoginResponse>(
        '/api/v1/auth/me'
    );

    return response.data;
};

export const logout = async () => {
    const response = await api.post(
        '/api/v1/auth/logout'
    );

    return response.data;
};
