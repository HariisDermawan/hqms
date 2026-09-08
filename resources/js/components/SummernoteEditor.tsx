import { useEffect, useRef, useState } from 'react';

interface SummernoteEditorProps {
    value?: string;
    onChange?: (html: string) => void;
    placeholder?: string;
    error?: string;
}

const loadScript = (src: string): Promise<void> =>
    new Promise((resolve, reject) => {
        const existing = document.querySelector<HTMLScriptElement>(
            `script[src="${src}"]`,
        );

        if (existing) {
            if (existing.dataset.loaded === '1') {
                resolve();
            } else {
                existing.addEventListener('load', () => resolve());
                existing.addEventListener('error', () =>
                    reject(new Error(`Gagal memuat ${src}`)),
                );
            }

            return;
        }

        const script = document.createElement('script');
        script.src = src;
        script.onload = () => {
            script.dataset.loaded = '1';
            resolve();
        };
        script.onerror = () => reject(new Error(`Gagal memuat ${src}`));
        document.head.appendChild(script);
    });

const loadLink = (href: string): void => {
    if (!document.querySelector(`link[href="${href}"]`)) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        document.head.appendChild(link);
    }
};

export default function SummernoteEditor({
    value = '',
    onChange,
    placeholder = '',
    error,
}: SummernoteEditorProps) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const changeRef = useRef(onChange);
    changeRef.current = onChange;
    const [ready, setReady] = useState(false);
    const [loadError, setLoadError] = useState<string | null>(null);

    useEffect(() => {
        let destroyed = false;

        const init = () => {
            const node = textareaRef.current;

            if (!node || destroyed) {
                return;
            }

            const $node = window.$(node);

            $node.summernote({
                lang: 'id-ID',
                placeholder,
                height: 320,
                tabsize: 2,
                dialogsInBody: true,
                toolbar: [
                    ['style', ['style']],
                    ['font', ['bold', 'italic', 'underline', 'clear']],
                    ['fontname', ['fontname']],
                    ['fontsize', ['fontsize']],
                    ['color', ['color']],
                    ['para', ['ul', 'ol', 'paragraph']],
                    ['height', ['height']],
                    ['insert', ['link', 'picture', 'video', 'table', 'hr']],
                    ['view', ['fullscreen', 'codeview']],
                    ['help', ['help']],
                ],
                callbacks: {
                    onChange: (html: string) => {
                        changeRef.current?.(html);
                    },
                },
            });

            if (value) {
                $node.summernote('code', value);
            }

            setReady(true);
        };

        loadLink('/vendor/summernote-lite.min.css');

        Promise.all([
            loadScript('/vendor/jquery.min.js'),
            loadScript('/vendor/summernote-lite.min.js'),
            loadScript('/vendor/summernote-id-ID.min.js'),
        ])
            .then(() => {
                if (!destroyed) {
                    init();
                }
            })
            .catch((err: Error) => {
                if (!destroyed) {
                    setLoadError(err.message);
                }
            });

        return () => {
            destroyed = true;

            const node = textareaRef.current;

            if (node && window.$.fn.summernote) {
                try {
                    window.$(node).summernote('destroy');
                } catch {
                    // abaikan; node mungkin belum pernah di-initialize
                }
            }
        };
    }, []);

    return (
        <div>
            {loadError ? (
                <div className="rounded-[12px] border border-red-200 bg-red-50 px-4 py-3 text-[12px] text-red-500">
                    {loadError}
                </div>
            ) : (
                <div className={ready ? '' : 'pointer-events-none opacity-50'}>
                    <textarea
                        ref={textareaRef}
                        defaultValue={value}
                        className="min-h-[320px] w-full rounded-[12px] border border-slate-200 bg-white p-4 text-[13px] text-gray-700"
                    />
                    {!ready && (
                        <p className="mt-1 text-[11px] text-gray-400">
                            Memuat editor...
                        </p>
                    )}
                </div>
            )}

            {error && <p className="mt-1 text-[11px] text-red-500">{error}</p>}
        </div>
    );
}
