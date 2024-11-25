import { NextRequest, NextResponse } from 'next/server';

const LATEX_SERVICE_URL = process.env.LATEX_SERVICE_URL || 'http://localhost:8000';

export async function DELETE(
    request: NextRequest,
    { params }: { params: { projectId: string; filename: string } }
) {
    try {
        const response = await fetch(
            `${LATEX_SERVICE_URL}/cls/${params.projectId}/${params.filename}`,
            {
                method: 'DELETE',
            }
        );

        if (!response.ok) {
            const error = await response.json();
            return NextResponse.json(
                { error: error.detail || 'Failed to delete class file' },
                { status: response.status }
            );
        }

        const result = await response.json();
        return NextResponse.json(result);
    } catch (error) {
        console.error('Class file deletion error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to delete class file' },
            { status: 500 }
        );
    }
}