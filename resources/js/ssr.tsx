import { createServer } from 'react-dom/server';
import { createInertiaApp } from '@inertiajs/react';
import type { ResolvedComponent } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent<{ default: ResolvedComponent }>(
            `./pages/${name}.tsx`,
            import.meta.glob<{ default: ResolvedComponent }>(
                './pages/**/*.tsx',
            ),
        ).then((module) => module.default),
    setup({ App, props }) {
        return createServer(<App {...props} />);
    },
});
