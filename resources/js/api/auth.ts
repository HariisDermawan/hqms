import api from '@/lib/axios';

export interface LoginPayload {
    email: string;
    password: string;
}

export interface RegisterPayload {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
}

export interface User {
    id: number;
    name: string;
    email: string;
    roles: string[];
    created_at: string | null;
}

export interface UpdateProfilePayload {
    name: string;
    email: string;
}

export interface UpdatePasswordPayload {
    current_password: string;
    password: string;
    password_confirmation: string;
}

export interface AuthResponse {
    success: boolean;
    message: string;
    data?: {
        user?: User;
    };
}

export const login = async (payload: LoginPayload): Promise<AuthResponse> => {
    // WAJIB untuk Sanctum SPA
    await api.get('/sanctum/csrf-cookie');

    const response = await api.post<AuthResponse>(
        '/api/v1/auth/login',
        payload,
    );

    return response.data;
};

export const register = async (
    payload: RegisterPayload,
): Promise<AuthResponse> => {
    // WAJIB untuk Sanctum SPA
    await api.get('/sanctum/csrf-cookie');

    const response = await api.post<AuthResponse>(
        '/api/v1/auth/register',
        payload,
    );

    return response.data;
};

export const me = async (): Promise<AuthResponse> => {
    const response = await api.get<AuthResponse>('/api/v1/auth/me');

    return response.data;
};

export const updateProfile = async (
    payload: UpdateProfilePayload,
): Promise<AuthResponse> => {
    const response = await api.put<AuthResponse>('/api/v1/auth/me', payload);

    return response.data;
};

export const updatePassword = async (
    payload: UpdatePasswordPayload,
): Promise<{ success: boolean; message: string }> => {
    const response = await api.post<{
        success: boolean;
        message: string;
    }>('/api/v1/auth/me/password', payload);

    return response.data;
};

export const logout = async () => {
    const response = await api.post('/api/v1/auth/logout');

    return response.data;
};
