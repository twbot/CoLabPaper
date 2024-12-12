import { NextResponse } from 'next/server'

const LATEX_SERVICE_URL = process.env.LATEX_SERVICE_URL || 'http://localhost:8000'

export async function GET(request: Request) {
    try {

        // Call LaTeX service
        const response = await fetch(`${LATEX_SERVICE_URL}/health/supabase`, {
            method: 'GET'
        })

        if (!response.ok) {
            const error = await response.json()
            throw new Error(error.detail || 'LaTeX health check for supabase failed')
        }

        const result = await response.json()

        return NextResponse.json(result)
    } catch (error) {
        console.error('LaTeX compilation error:', error)
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Unknown error occurred' },
            { status: 500 }
        )
    }
}