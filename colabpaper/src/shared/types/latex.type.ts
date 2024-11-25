
// Types for LaTeX-related files
export type FileTypeKey = 'tex' | 'cls' | 'sty' | 'bib' | 'bst' | 'dtx' | 'ins';

export type FileCategory = 'main' | 'style' | 'bibliography' | 'packages';

export interface LatexFileType {
    extension: string;
    description: string;
    category: FileCategory;
    template?: string;
}