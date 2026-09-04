import { usePage } from '@inertiajs/react';

export type RoleName =
    | 'Super Admin'
    | 'Admin'
    | 'Dokter'
    | 'Staf Loket'
    | 'Staf Obat'
    | 'Perawat';

const FULL_ACCESS_ROLES: RoleName[] = ['Super Admin', 'Admin'];

const MENU_PREFIX: Record<string, string> = {
    dashboard: '/dashboard',
    monitoring: '/monitorings',
    pasien: '/pasiens',
    poli: '/polis',
    dokter: '/dokters',
    jadwalDokter: '/jadwal-dokters',
    perawat: '/perawats',
    presensi: '/presensis',
    obat: '/obats',
    ruangan: '/ruangans',
    pendaftaran: '/pendaftarans',
    antrian: '/antrians',
    pemeriksaan: '/pemeriksaans',
    pembayaran: '/pembayarans',
};

const ROLE_MENUS: Record<RoleName, string[] | '*'> = {
    'Super Admin': '*',
    Admin: '*',
    'Staf Loket': [
        MENU_PREFIX.dashboard,
        MENU_PREFIX.monitoring,
        MENU_PREFIX.pasien,
        MENU_PREFIX.ruangan,
        MENU_PREFIX.pendaftaran,
        MENU_PREFIX.antrian,
        MENU_PREFIX.pembayaran,
    ],
    'Staf Obat': [
        MENU_PREFIX.dashboard,
        MENU_PREFIX.pasien,
        MENU_PREFIX.obat,
        MENU_PREFIX.pembayaran,
    ],
    Dokter: [
        MENU_PREFIX.obat,
        MENU_PREFIX.ruangan,
        MENU_PREFIX.pemeriksaan,
        MENU_PREFIX.pasien,
        MENU_PREFIX.poli,
    ],
    Perawat: [MENU_PREFIX.presensi, MENU_PREFIX.perawat],
};

export const hasFullAccess = (roles: RoleName[]): boolean =>
    roles.some((role) => FULL_ACCESS_ROLES.includes(role));

export const canAccessMenu = (roles: RoleName[], path: string): boolean => {
    if (roles.length === 0 || hasFullAccess(roles)) {
        return true;
    }

    return roles.some((role) => {
        const allowed = ROLE_MENUS[role];

        if (!allowed) {
            return false;
        }

        if (allowed === '*') {
            return true;
        }

        return allowed.some(
            (prefix) => path === prefix || path.startsWith(`${prefix}/`),
        );
    });
};

export const isViewOnly = (roles: RoleName[]): boolean => {
    if (roles.length === 0 || hasFullAccess(roles)) {
        return false;
    }

    return roles.some((role) => role === 'Perawat');
};

interface SharedAuth {
    [key: string]: unknown;

    auth?: {
        user?: {
            id: number;
            name: string;
            email: string;
            roles: RoleName[];
        } | null;
    };
}

export const usePermissions = () => {
    const { props } = usePage<SharedAuth>();

    const roles = props.auth?.user?.roles ?? [];

    return {
        roles,
        hasFullAccess: hasFullAccess(roles),
        canAccess: (path: string) => canAccessMenu(roles, path),
        viewOnly: isViewOnly(roles),
    };
};
