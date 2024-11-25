export const UPLOAD_CONFIG = {
    MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
    ALLOWED_FILE_TYPES: [
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp',
        'application/pdf', // For vector graphics
    ] as const,
    MAX_FILE_SIZE_MB: 10,
} as const;

export type AllowedFileType = (typeof UPLOAD_CONFIG.ALLOWED_FILE_TYPES)[number];
export type FileTypes = ReadonlyArray<string>;

export function isAllowedFileType(type: string, allowedTypes: FileTypes): boolean {
    return allowedTypes.includes(type);
}