export interface EditorTheme {
    id: string;
    name: string;
    theme: {
        base: 'vs' | 'vs-dark' | 'hc-black';
        inherit: boolean;
        rules: Array<{
            token: string;
            foreground?: string;
            background?: string;
            fontStyle?: string;
        }>;
        colors: {
            [key: string]: string;
        };
    };
}
