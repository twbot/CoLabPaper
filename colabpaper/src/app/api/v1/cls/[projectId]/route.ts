import { NextRequest, NextResponse } from 'next/server';

const LATEX_SERVICE_URL = process.env.LATEX_SERVICE_URL || 'http://localhost:8000';

export async function POST(
    request: NextRequest,
    { params }: { params: { projectId: string } }
) {
    try {
        const formData = await request.formData();
        const filename = formData.get('filename') as string;

        // Forward the request to the LaTeX service
        const response = await fetch(
            `${LATEX_SERVICE_URL}/cls/${params.projectId}`,
            {
                method: 'POST',
                body: formData,
                headers: {
                    'X-Filename': filename,  // Pass filename in header if needed by backend
                }
            }
        );

        if (!response.ok) {
            const error = await response.json();
            return NextResponse.json(
                { error: error.detail || 'Failed to create class file' },
                { status: response.status }
            );
        }

        const result = await response.json();
        return NextResponse.json(result);
    } catch (error) {
        console.error('Class file creation error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to create class file' },
            { status: 500 }
        );
    }
}

export async function GET(
    request: NextRequest,
    { params }: { params: { projectId: string } }
) {
    try {
        const response = await fetch(
            `${LATEX_SERVICE_URL}/cls/${params.projectId}`,
            {
                method: 'GET',
            }
        );

        if (!response.ok) {
            const error = await response.json();
            return NextResponse.json(
                { error: error.detail || 'Failed to get project class files' },
                { status: response.status }
            );
        }

        const result = await response.json();
        return NextResponse.json(result);
    } catch (error) {
        console.error('Class file fetch error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to get class files' },
            { status: 500 }
        );
    }
}