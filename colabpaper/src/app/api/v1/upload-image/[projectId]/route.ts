// src/app/api/upload-image/[projectId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { UPLOAD_CONFIG, isAllowedFileType } from '@/config/upload';

const LATEX_SERVICE_URL = process.env.LATEX_SERVICE_URL || 'http://localhost:8000';

export async function POST(
    request: NextRequest,
    { params }: { params: { projectId: string } }
) {
    try {
        // Validate project ID
        if (!params.projectId) {
            return NextResponse.json(
                { error: 'Project ID is required' },
                { status: 400 }
            );
        }

        // Get form data
        const formData = await request.formData();
        const file = formData.get('file') as File | null;

        // Validate file existence
        if (!file) {
            return NextResponse.json(
                { error: 'No file provided' },
                { status: 400 }
            );
        }

        // Validate file type
        if (!isAllowedFileType(file.type, UPLOAD_CONFIG.ALLOWED_FILE_TYPES)) {
            return NextResponse.json(
                {
                    error: 'Invalid file type. Allowed types: JPEG, PNG, GIF, WebP, PDF',
                    allowedTypes: UPLOAD_CONFIG.ALLOWED_FILE_TYPES
                },
                { status: 400 }
            );
        }

        // Validate file size
        if (file.size > UPLOAD_CONFIG.MAX_FILE_SIZE) {
            return NextResponse.json(
                {
                    error: 'File too large',
                    maxSize: `${UPLOAD_CONFIG.MAX_FILE_SIZE / (1024 * 1024)}MB`,
                    receivedSize: `${(file.size / (1024 * 1024)).toFixed(2)}MB`
                },
                { status: 400 }
            );
        }

        // Create a new FormData instance for the LaTeX service
        const serviceFormData = new FormData();
        serviceFormData.append('file', file);

        // Forward to LaTeX service
        const response = await fetch(
            `${LATEX_SERVICE_URL}/upload-image/${params.projectId}`,
            {
                method: 'POST',
                body: serviceFormData,
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            return NextResponse.json(
                { error: errorData.detail || 'Service error' },
                { status: response.status }
            );
        }

        const result = await response.json();

        // Return successful response
        return NextResponse.json({
            status: 'success',
            file_path: result.file_path,
            url: result.url,
            file_type: file.type,
            size: file.size,
        });

    } catch (error) {
        console.error('Image upload error:', error);

        return NextResponse.json(
            {
                error: 'Internal server error',
                detail: error instanceof Error ? error.message : 'Unknown error occurred'
            },
            { status: 500 }
        );
    }
}

export async function GET() {
    return NextResponse.json({
        maxFileSize: UPLOAD_CONFIG.MAX_FILE_SIZE,
        allowedTypes: UPLOAD_CONFIG.ALLOWED_FILE_TYPES,
        maxFileSizeMB: UPLOAD_CONFIG.MAX_FILE_SIZE_MB
    });
}