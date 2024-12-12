import { FileTypeKey } from "@/types";

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


export interface FileItem {
    name: string;
    path: string;
    url?: string;
    type: FileTypeKey | 'image' | 'pdf' | 'bib' | 'unknown';
    size: number;
    content?: string;
    uploadedAt: string;
}

export interface FolderData {
    files: FileItem[];
    isOpen: boolean;
    label: string;
}

export interface FolderStructure {
    [key: string]: FolderData;
}