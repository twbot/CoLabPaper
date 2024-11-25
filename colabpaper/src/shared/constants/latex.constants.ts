import { FileTypeKey, LatexFileType } from "@/types";

export const LATEX_FILE_TYPES: Record<FileTypeKey, LatexFileType> = {
    'tex': {
        extension: '.tex',
        description: 'LaTeX Document',
        category: 'main'
    },
    'cls': {
        extension: '.cls',
        description: 'Document Class',
        category: 'style'
    },
    'sty': {
        extension: '.sty',
        description: 'Style Package',
        category: 'style'
    },
    'bib': {
        extension: '.bib',
        description: 'Bibliography Database',
        category: 'bibliography'
    },
    'bst': {
        extension: '.bst',
        description: 'Bibliography Style',
        category: 'bibliography'
    },
    'dtx': {
        extension: '.dtx',
        description: 'Documented LaTeX Source',
        category: 'packages'
    },
    'ins': {
        extension: '.ins',
        description: 'Installation File',
        category: 'packages'
    }
};