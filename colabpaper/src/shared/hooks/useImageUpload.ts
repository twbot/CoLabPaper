// src/hooks/useImageUpload.ts
import { useState, useCallback } from 'react';
import { UPLOAD_CONFIG, FileTypes, isAllowedFileType } from '@/config/upload';

interface UploadedImage {
    file_path: string;
    url: string;
    file_type: string;
    size: number;
}

interface UseImageUploadOptions {
    projectId: string;
    onUploadSuccess?: (image: UploadedImage) => void;
    maxSizeMB?: number;
    allowedTypes?: FileTypes;
}

export function useImageUpload({
    projectId,
    onUploadSuccess,
    maxSizeMB = UPLOAD_CONFIG.MAX_FILE_SIZE_MB,
    allowedTypes = UPLOAD_CONFIG.ALLOWED_FILE_TYPES,
}: UseImageUploadOptions) {
    const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const validateFile = useCallback((file: File): boolean => {
        // Check file type
        if (!isAllowedFileType(file.type, allowedTypes)) {
            setError(`Unsupported file type. Allowed types: ${allowedTypes.join(', ')}`);
            return false;
        }

        // Check file size
        const maxSize = maxSizeMB * 1024 * 1024;
        if (file.size > maxSize) {
            setError(`File too large. Maximum size: ${maxSizeMB}MB`);
            return false;
        }

        return true;
    }, [maxSizeMB, allowedTypes]);

    const uploadImage = useCallback(async (file: File): Promise<UploadedImage | null> => {
        if (!validateFile(file)) {
            return null;
        }

        setIsUploading(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch(`/api/upload-image/${projectId}`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Upload failed');
            }

            const result = await response.json();

            const uploadedImage: UploadedImage = {
                file_path: result.file_path,
                url: result.url,
                file_type: result.file_type,
                size: result.size,
            };

            setUploadedImages(prev => [...prev, uploadedImage]);
            onUploadSuccess?.(uploadedImage);

            return uploadedImage;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to upload image';
            setError(errorMessage);
            return null;
        } finally {
            setIsUploading(false);
        }
    }, [projectId, validateFile, onUploadSuccess]);

    const resetState = useCallback(() => {
        setUploadedImages([]);
        setError(null);
    }, []);

    return {
        uploadedImages,
        isUploading,
        error,
        uploadImage,
        resetState,
        config: {
            maxSizeMB,
            allowedTypes: allowedTypes as readonly string[],
        },
    };
}