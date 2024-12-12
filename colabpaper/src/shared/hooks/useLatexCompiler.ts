import { useState, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';

interface CompilationResult {
    status: string;
    file_path: string;
    url: string;
    storage_type: 'local' | 'supabase';
}

interface UseLatexCompilerProps {
    projectId: string;
}

export function useLatexCompiler({ projectId }: UseLatexCompilerProps) {
    const [texContent, setTexContent] = useState<string>('');
    const [isCompiling, setIsCompiling] = useState(false);
    const [compiledPdfUrl, setCompiledPdfUrl] = useState<string | null>(null);
    const { toast } = useToast();

    const compileLaTeX = useCallback(async (filename: string = 'document.pdf'): Promise<CompilationResult | null> => {
        setIsCompiling(true);

        try {
            const response = await fetch(`/api/${process.env.NEXT_PUBLIC_API_VERSION}/compile`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
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
            toast({
                title: "Success",
                description: "Document compiled successfully",
            });
            return result;
        } catch (error) {
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : 'Compilation failed',
                variant: "destructive",
            });
            return null;
        } finally {
            setIsCompiling(false);
        }
    }, [projectId, texContent, toast]);

    const updateContent = useCallback((newContent: string) => {
        setTexContent(newContent);
    }, []);

    const resetState = useCallback(() => {
        setTexContent('');
        setCompiledPdfUrl(null);
    }, []);

    return {
        texContent,
        isCompiling,
        compiledPdfUrl,
        compileLaTeX,
        updateContent,
        resetState,
    };
}