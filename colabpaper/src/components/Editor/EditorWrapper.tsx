// src/components/Editor/EditorWrapper.tsx
'use client';

import React, { useEffect, useRef } from 'react';
import * as monaco from 'monaco-editor';
import { editor } from 'monaco-editor';
import { registerLatexCommands } from './EditorCommands';
import { ThemeSelector } from './ThemeSelector';
import { useEditor } from '@/context/EditorContext';

interface EditorWrapperProps {
    value: string;
    onChange: (value: string) => void;
}

const EditorWrapper: React.FC<EditorWrapperProps> = ({ value, onChange }) => {
    const editorRef = useRef<HTMLDivElement>(null);
    const monacoEditorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
    const { setEditorInstance } = useEditor();

    useEffect(() => {
        if (editorRef.current) {
            // Configure LaTeX language
            monaco.languages.register({ id: 'latex' });
            monaco.languages.setMonarchTokensProvider('latex', {
                tokenizer: {
                    root: [
                        [/\\[a-zA-Z]+/, 'keyword'],
                        [/\{|\}|\[|\]/, 'bracket'],
                        [/\$.*?\$/, 'variable'],
                        [/%.*$/, 'comment'],
                        [/\\ai\{[^}]*\}/, 'custom-ai'], // Highlight AI commands
                    ]
                }
            });

            // Create editor with improved configuration
            monacoEditorRef.current = monaco.editor.create(editorRef.current, {
                value,
                language: 'latex',
                theme: 'vs-dark',
                minimap: { enabled: false },
                automaticLayout: true,
                wordWrap: 'on',
                fontSize: 14,
                lineHeight: 21,
                padding: { top: 10 },
                suggestOnTriggerCharacters: true,
                quickSuggestions: {
                    other: true,
                    comments: false,
                    strings: false
                },
                suggest: {
                    snippetsPreventQuickSuggestions: false,
                    showIcons: false,
                    showStatusBar: true,
                    preview: true,
                    previewMode: 'prefix',
                    filterGraceful: true,
                    selectionMode: 'always'
                },
                snippetSuggestions: 'inline',
                acceptSuggestionOnEnter: 'on',
            });
            setEditorInstance(monacoEditorRef.current);

            // Register commands
            registerLatexCommands(monacoEditorRef.current);

            // Listen for changes
            monacoEditorRef.current.onDidChangeModelContent(() => {
                onChange(monacoEditorRef.current?.getValue() || '');
            });

            // Add custom styling for the suggestion widget
            const style = document.createElement('style');
            style.textContent = `
                .monaco-editor .suggest-widget {
                    width: auto !important;
                    max-width: 500px !important;
                }
                .monaco-editor .suggest-widget .monaco-list .monaco-list-row .contents {
                    padding: 4px 8px !important;
                }
                .monaco-editor .suggest-widget .monaco-list .monaco-list-row.focused {
                    background-color: #2a2d2e !important;
                }
            `;
            document.head.appendChild(style);
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

    return (
        <div className="h-full flex flex-col">
            <div ref={editorRef} className="flex-grow" />
        </div>
    );
};

export default EditorWrapper;