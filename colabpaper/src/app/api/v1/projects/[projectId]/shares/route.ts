// src/app/api/v1/projects/[projectId]/shares/route.ts
import { createClient } from '@/utils/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
    request: NextRequest,
    { params }: { params: { projectId: string } }
) {
    try {
        const supabase = await createClient()

        const { data: { user }, error: authError } = await supabase.auth.getUser()
        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { data: shares, error } = await supabase
            .from('project_shares')
            .select(`
                *,
                user:user_id(
                    email,
                    profile!inner(username, first_name, last_name)
                )
            `)
            .eq('project_id', params.projectId)

        if (error) throw error

        return NextResponse.json({ data: shares })

    } catch (error) {
        console.error('Error:', error)
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Internal server error' },
            { status: 500 }
        )
    }
}

export async function POST(
    request: NextRequest,
    { params }: { params: { projectId: string } }
) {
    try {
        const supabase = await createClient()
        const body = await request.json()

        const { data: { user }, error: authError } = await supabase.auth.getUser()
        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { email, permission_level } = body

        if (!email || !permission_level) {
            return NextResponse.json(
                { error: 'Email and permission level are required' },
                { status: 400 }
            )
        }

        if (!['read', 'write', 'admin'].includes(permission_level)) {
            return NextResponse.json(
                { error: 'Invalid permission level' },
                { status: 400 }
            )
        }

        const { data: userToShare } = await supabase
            .from('profile')
            .select('id')
            .eq('email', email)
            .single()

        if (!userToShare) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            )
        }

        const { data: share, error } = await supabase
            .from('project_shares')
            .insert({
                project_id: params.projectId,
                user_id: userToShare.id,
                permission_level,
                shared_by: user.id
            })
            .select(`
                *,
                user:user_id(
                    email,
                    profile!inner(username, first_name, last_name)
                )
            `)
            .single()

        if (error) throw error

        return NextResponse.json({ data: share })

    } catch (error) {
        console.error('Error:', error)
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Internal server error' },
            { status: 500 }
        )
    }
}