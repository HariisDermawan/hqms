import type { AntrianStatus } from '@/api/antrian';

export const STATUS_OPTIONS: {
    value: AntrianStatus;
    label: string;
}[] = [
    { value: 'waiting', label: 'Menunggu' },
    { value: 'called', label: 'Dipanggil' },
    { value: 'serving', label: 'Dilayani' },
    { value: 'completed', label: 'Selesai' },
    { value: 'skipped', label: 'Dilewati' },
];

const STATUS_LABELS: Record<AntrianStatus, string> = Object.fromEntries(
    STATUS_OPTIONS.map((item) => [item.value, item.label]),
) as Record<AntrianStatus, string>;

export const statusLabel = (status: AntrianStatus): string =>
    STATUS_LABELS[status] ?? status;

export const statusBadgeClass = (status: AntrianStatus): string => {
    switch (status) {
        case 'waiting':
            return 'bg-amber-50 text-amber-600';
        case 'called':
            return 'bg-blue-50 text-blue-600';
        case 'serving':
            return 'bg-indigo-50 text-indigo-600';
        case 'completed':
            return 'bg-green-50 text-green-600';
        case 'skipped':
            return 'bg-gray-100 text-gray-500';
        default:
            return 'bg-gray-100 text-gray-500';
    }
};

export const formatTime = (iso: string | null): string => {
    if (!iso) {
        return '-';
    }

    return new Date(iso).toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
    });
};

export const todayLocal = (): string => {
    const now = new Date();

    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
};
