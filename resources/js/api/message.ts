import api from '@/lib/axios';
import type { Pagination } from './dokter';

export type MessageStatus = 'unread' | 'read' | 'replied';

export interface Message {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    subject: string | null;
    message: string;
    status: MessageStatus;
    admin_reply: string | null;
    replied_at: string | null;
}

export interface MessagePayload {
    name: string;
    email: string;
    phone?: string | null;
    subject?: string | null;
    message: string;
    status?: MessageStatus;
    admin_reply?: string | null;
    replied_at?: string | null;
}

export interface MessageListResponse {
    success: boolean;
    message: string;
    data?: {
        items?: Message[];
        pagination?: Pagination;
    };
}

export interface MessageResponse {
    success: boolean;
    message: string;
    data?: {
        message?: Message;
    };
}

export const getMessages = async (
    page = 1,
    perPage?: number,
): Promise<MessageListResponse> => {
    const searchParams = new URLSearchParams({ page: String(page) });

    if (perPage) {
        searchParams.append('per_page', String(perPage));
    }

    const response = await api.get<MessageListResponse>(
        `/api/v1/messages?${searchParams.toString()}`,
    );

    return response.data;
};

export const getMessage = async (id: number): Promise<MessageResponse> => {
    const response = await api.get<MessageResponse>(`/api/v1/messages/${id}`);

    return response.data;
};

export const storeMessage = async (
    payload: MessagePayload,
): Promise<MessageResponse> => {
    const response = await api.post<MessageResponse>(
        '/api/v1/messages',
        payload,
    );

    return response.data;
};

export const updateMessage = async (
    id: number,
    payload: MessagePayload,
): Promise<MessageResponse> => {
    const response = await api.put<MessageResponse>(
        `/api/v1/messages/${id}`,
        payload,
    );

    return response.data;
};

export const deleteMessage = async (
    id: number,
): Promise<{ success: boolean; message: string }> => {
    const response = await api.delete<{ success: boolean; message: string }>(
        `/api/v1/messages/${id}`,
    );

    return response.data;
};
