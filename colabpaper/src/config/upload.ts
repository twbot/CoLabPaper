export type FileCategory = 'asset' | 'latex' | 'reference' | 'class';

export const UPLOAD_CONFIG = {
    MAX_FILE_SIZE: 20 * 1024 * 1024, // 20MB
    MAX_FILE_SIZE_MB: 20,

    FILE_TYPES: {
        // Images
        'image/jpeg': { ext: '.jpg', category: 'asset' },
        'image/png': { ext: '.png', category: 'asset' },
        'image/gif': { ext: '.gif', category: 'asset' },
        'image/webp': { ext: '.webp', category: 'asset' },

        // LaTeX files
        'application/x-tex': { ext: '.tex', category: 'latex' },
        'text/x-tex': { ext: '.tex', category: 'latex' },

        // Bibliography and other text files
        'text/plain': { ext: '.txt', category: 'reference' }, // Default for text files

        // References
        'application/pdf': { ext: '.pdf', category: 'reference' },
    } as const,

    // Storage paths
    PATHS: {
        ASSETS: 'assets',
        REFERENCES: 'references',
        LATEX: 'tex',
        CLASS: 'cls'
    } as const
} as const;

export const isAllowedFileType = (mimeType: string, category: FileCategory): boolean => {
    const fileType = UPLOAD_CONFIG.FILE_TYPES[mimeType as keyof typeof UPLOAD_CONFIG.FILE_TYPES];
    return fileType?.category === category;
};

export const getFileExtension = (mimeType: string): string => {
    return UPLOAD_CONFIG.FILE_TYPES[mimeType as keyof typeof UPLOAD_CONFIG.FILE_TYPES]?.ext || '.txt';
};