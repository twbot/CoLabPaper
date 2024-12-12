import { FileTypeKey, LatexCommand, LatexFileType } from "@/types";

// LaTeX File Types
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

// LaTeX Commands
export const LATEX_COMMANDS: LatexCommand[] = [
    // Sections
    {
        command: 'section',
        description: 'Create section',
        snippet: '\\section{$1}$0',
        category: 'Structure'
    },
    {
        command: 'subsection',
        description: 'Create subsection',
        snippet: '\\subsection{$1}$0',
        category: 'Structure'
    },
    {
        command: 'subsubsection',
        description: 'Create subsubsection',
        snippet: '\\subsubsection{$1}$0',
        category: 'Structure'
    },

    // Environments
    {
        command: 'begin',
        description: 'Begin environment',
        snippet: '\\begin{$1}\n\t$0\n\\end{$1}',
        category: 'Environment'
    },
    {
        command: 'item',
        description: 'List item',
        snippet: '\\item $0',
        category: 'Environment'
    },

    // Text formatting
    {
        command: 'textbf',
        description: 'Bold text',
        snippet: '\\textbf{$1}$0',
        category: 'Text'
    },
    {
        command: 'textit',
        description: 'Italic text',
        snippet: '\\textit{$1}$0',
        category: 'Text'
    },
    {
        command: 'underline',
        description: 'Underlined text',
        snippet: '\\underline{$1}$0',
        category: 'Text'
    },

    // Math
    {
        command: 'equation',
        description: 'Equation environment',
        snippet: '\\begin{equation}\n\t$0\n\\end{equation}',
        category: 'Math'
    },
    {
        command: 'frac',
        description: 'Fraction',
        snippet: '\\frac{$1}{$2}$0',
        category: 'Math'
    },

    // References
    {
        command: 'cite',
        description: 'Citation',
        snippet: '\\cite{$1}$0',
        category: 'References'
    },
    {
        command: 'label',
        description: 'Label for reference',
        snippet: '\\label{$1}$0',
        category: 'References'
    },
    {
        command: 'ref',
        description: 'Reference',
        snippet: '\\ref{$1}$0',
        category: 'References'
    },

    // Custom AI Commands
    {
        command: 'ai',
        description: 'Generate content using AI',
        snippet: '\\ai{$1}$0',
        category: 'AI'
    },
];