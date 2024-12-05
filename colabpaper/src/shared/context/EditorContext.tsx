// src/context/EditorContext.tsx
import { createContext, useContext, useRef, useState } from 'react';
import * as monaco from 'monaco-editor';
import { editor } from 'monaco-editor';

interface EditorContextType {
    editorInstance: monaco.editor.IStandaloneCodeEditor | null;
    setEditorInstance: (editor: monaco.editor.IStandaloneCodeEditor) => void;
    applyTheme: (theme: any) => void;
}

const EditorContext = createContext<EditorContextType | undefined>(undefined);

export function EditorProvider({ children }: { children: React.ReactNode }) {
    const [editorInstance, setEditorInstance] = useState<monaco.editor.IStandaloneCodeEditor | null>(null);

    const applyTheme = (theme: any) => {
        if (!editorInstance) return;
        monaco.editor.defineTheme('custom-theme', {
            ...theme.theme,
            rules: [
                ...theme.theme.rules,
                { token: 'custom-ai', foreground: '#4CAF50', fontStyle: 'italic bold' },
            ]
        });
        editorInstance.updateOptions({ theme: 'custom-theme' });
    };

    return (
        <EditorContext.Provider value={{ editorInstance, setEditorInstance, applyTheme }}>
            {children}
        </EditorContext.Provider>
    );
}

export function useEditor() {
    const context = useContext(EditorContext);
    if (context === undefined) {
        throw new Error('useEditor must be used within an EditorProvider');
    }
    return context;
}