import { NextResponse } from 'next/server'

const LATEX_SERVICE_URL = process.env.LATEX_SERVICE_URL || 'http://localhost:8000'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { texContent, projectId, filename } = body

        // Call LaTeX service
        const response = await fetch(`${LATEX_SERVICE_URL}/compile`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                tex_content: texContent,
                project_id: projectId,
                output_filename: filename,
            }),
        })

        if (!response.ok) {
            const error = await response.json()
            throw new Error(error.detail || 'LaTeX compilation failed')
        }

        const result = await response.json()

        // If using local storage in development, we need to adjust the URL
        if (result.storage_type === 'local') {
            // Convert the file system path to a local URL
            const localPath = result.file_path.replace('storage/', '')
            result.url = `${LATEX_SERVICE_URL}/storage/${localPath}`
        }

        return NextResponse.json(result)
    } catch (error) {
        console.error('LaTeX compilation error:', error)
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Unknown error occurred' },
            { status: 500 }
        )
    }
}