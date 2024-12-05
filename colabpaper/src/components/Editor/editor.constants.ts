import { EditorTheme } from "./editor.types";

export const EDITOR_THEMES: EditorTheme[] = [
    {
        id: 'default-light',
        name: 'Light',
        theme: {
            base: 'vs',
            inherit: true,
            rules: [
                { token: 'custom-ai', foreground: '#4CAF50', fontStyle: 'italic bold' }
            ],
            colors: {
                'editor.background': '#ffffff',
                'editor.foreground': '#000000',
            }
        }
    },
    {
        id: 'default-dark',
        name: 'Dark',
        theme: {
            base: 'vs-dark',
            inherit: true,
            rules: [
                { token: 'custom-ai', foreground: '#4CAF50', fontStyle: 'italic bold' }
            ],
            colors: {
                'editor.background': '#1e1e1e',
                'editor.foreground': '#d4d4d4',
            }
        }
    },
    {
        id: 'github-dark',
        name: 'GitHub Dark',
        theme: {
            base: 'vs-dark',
            inherit: true,
            rules: [
                { token: 'comment', foreground: '#8b949e', fontStyle: 'italic' },
                { token: 'keyword', foreground: '#ff7b72' },
                { token: 'string', foreground: '#a5d6ff' },
                { token: 'number', foreground: '#79c0ff' },
                { token: 'custom-ai', foreground: '#4CAF50', fontStyle: 'italic bold' }
            ],
            colors: {
                'editor.background': '#0d1117',
                'editor.foreground': '#c9d1d9',
            }
        }
    },
    {
        id: 'monokai',
        name: 'Monokai',
        theme: {
            base: 'vs-dark',
            inherit: true,
            rules: [
                { token: 'comment', foreground: '#88846f', fontStyle: 'italic' },
                { token: 'keyword', foreground: '#f92672' },
                { token: 'string', foreground: '#e6db74' },
                { token: 'number', foreground: '#ae81ff' },
                { token: 'custom-ai', foreground: '#4CAF50', fontStyle: 'italic bold' }
            ],
            colors: {
                'editor.background': '#272822',
                'editor.foreground': '#f8f8f2',
            }
        }
    }
];