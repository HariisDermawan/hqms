import type { Auth } from '@/types/auth';
import type { JQueryStatic } from 'jquery';

declare global {
    interface Window {
        $: JQueryStatic;
        jQuery: JQueryStatic;
    }
}

declare module 'react' {
    interface InputHTMLAttributes<T> {
        passwordrules?: string;
    }
}

declare module '@inertiajs/core' {
    export interface InertiaConfig {
        sharedPageProps: {
            name: string;
            auth: Auth;
            sidebarOpen: boolean;
            [key: string]: unknown;
        };
    }
}
