import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const LATEX_SERVICE_URL = process.env.LATEX_SERVICE_URL || 'http://localhost:8000'
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

// const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { texContent, projectId, filename } = body
        console.log(LATEX_SERVICE_URL)
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