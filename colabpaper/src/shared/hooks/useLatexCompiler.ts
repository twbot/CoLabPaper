// src/hooks/useLatexEditor.ts
import { useState, useCallback } from 'react';
import { useImageUpload } from './useImageUpload';

interface CompilationResult {
    status: string;
    file_path: string;
    url: string;
    storage_type: 'local' | 'supabase';
}

interface UseLatexEditorProps {
    projectId: string;
}

export function useLatexEditor({ projectId }: UseLatexEditorProps) {
    const [texContent, setTexContent] = useState<string>('');
    const [isCompiling, setIsCompiling] = useState(false);
    const [compiledPdfUrl, setCompiledPdfUrl] = useState<string | null>(null);

    const handleUploadSuccess = useCallback((image: { file_path: string }) => {
        const imageLatex = `\\includegraphics{${image.file_path}}\n`;
        setTexContent(prev => prev + imageLatex);
    }, []);

    const {
        uploadedImages,
        isUploading,
        error: uploadError,
        uploadImage,
    } = useImageUpload({
        projectId,
        onUploadSuccess: handleUploadSuccess,
    });

    const compileLaTeX = useCallback(async (filename: string = 'document.pdf'): Promise<CompilationResult | null> => {
        setIsCompiling(true);

        try {
            const response = await fetch('/api/compile-latex', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    texContent,
                    projectId,
                    filename,
                }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.detail || 'Failed to compile LaTeX');
            }

            const result = await response.json();
            setCompiledPdfUrl(result.url);
            return result;
        } catch (err) {
            return null;
        } finally {
            setIsCompiling(false);
        }
    }, [projectId, texContent]);

    const updateTexContent = useCallback((newContent: string) => {
        setTexContent(newContent);
    }, []);

    const resetState = useCallback(() => {
        setTexContent('');
        setCompiledPdfUrl(null);
    }, []);

    return {
        texContent,
        uploadedImages,
        isUploading,
        isCompiling,
        error: uploadError,
        compiledPdfUrl,
        uploadImage,
        compileLaTeX,
        updateTexContent,
        resetState,
    };
}