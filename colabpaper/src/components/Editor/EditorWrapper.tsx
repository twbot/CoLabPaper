'use client';

import React, { useEffect, useRef } from 'react';
import * as monaco from 'monaco-editor';
import { editor } from 'monaco-editor';

interface EditorWrapperProps {
    value: string;
    onChange: (value: string) => void;
}

const EditorWrapper: React.FC<EditorWrapperProps> = ({ value, onChange }) => {
    const editorRef = useRef<HTMLDivElement>(null);
    const monacoEditorRef = useRef<editor.IStandaloneCodeEditor | null>(null);

    useEffect(() => {
        if (editorRef.current) {
            // Register LaTeX language
            monaco.languages.register({ id: 'latex' });
            monaco.languages.setMonarchTokensProvider('latex', {
                tokenizer: {
                    root: [
                        [/\\[a-zA-Z]+/, 'keyword'],
                        [/\{|\}|\[|\]/, 'bracket'],
                        [/\$.*?\$/, 'variable'],
                        [/%.*$/, 'comment'],
                    ]
                }
            });

            monacoEditorRef.current = monaco.editor.create(editorRef.current, {
                value: value,
                language: 'latex',
                theme: 'vs-dark',
                minimap: { enabled: false },
                automaticLayout: true,
            });

            monacoEditorRef.current.onDidChangeModelContent(() => {
                onChange(monacoEditorRef.current?.getValue() || '');
            });
        }

        return () => {
            monacoEditorRef.current?.dispose();
        };
    }, []);

    useEffect(() => {
        if (monacoEditorRef.current && value !== monacoEditorRef.current.getValue()) {
            monacoEditorRef.current.setValue(value);
        }
    }, [value]);

    return <div ref={editorRef} style={{ width: '100%', height: '100%' }} />;
};

export default EditorWrapper;