import type { MessageStatus } from '@/api/message';

export const STATUS_OPTIONS: {
    value: MessageStatus;
    label: string;
}[] = [
    { value: 'unread', label: 'Belum Dibaca' },
    { value: 'read', label: 'Dibaca' },
    { value: 'replied', label: 'Terjawab' },
];

const STATUS_LABELS: Record<MessageStatus, string> = Object.fromEntries(
    STATUS_OPTIONS.map((item) => [item.value, item.label]),
) as Record<MessageStatus, string>;

export const statusLabel = (status: MessageStatus): string =>
    STATUS_LABELS[status] ?? status;

export const statusBadgeClass = (status: MessageStatus): string => {
    switch (status) {
        case 'unread':
            return 'bg-red-50 text-red-600';
        case 'read':
            return 'bg-amber-50 text-amber-600';
        case 'replied':
            return 'bg-emerald-50 text-emerald-600';
        default:
            return 'bg-gray-100 text-gray-500';
    }
};
