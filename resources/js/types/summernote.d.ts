interface SummernoteOptions {
    lang?: string;
    placeholder?: string;
    height?: number;
    minHeight?: number;
    maxHeight?: number;
    focus?: boolean;
    tabsize?: number;
    dialogsInBody?: boolean;
    toolbar?: Array<Array<string | string[]>>;
    callbacks?: Record<string, (...args: any[]) => void>;
}

declare global {
    interface JQuery<TElement = HTMLElement> {
        summernote(options: SummernoteOptions): JQuery<TElement>;
        summernote(command: string, ...args: any[]): any;
    }
}

export {};
