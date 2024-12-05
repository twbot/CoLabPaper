// src/app/api/v1/projects/route.ts
import { createClient } from '@/utils/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const supabase = await createClient()

        const { data: { user }, error: authError } = await supabase.auth.getUser()
        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const status = searchParams.get('status') || 'active'
        const page = parseInt(searchParams.get('page') || '1')
        const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 50)
        const orderBy = searchParams.get('orderBy') || 'updated_at'
        const orderDirection = searchParams.get('orderDirection') || 'desc'

        // Get the projects with owner details
        const { data: projects, error, count } = await supabase
            .from('project')
            .select(`
          *,
          owner:profile!project_owner_id_fkey(
            username,
            first_name,
            last_name,
            email
          ),
          shares:project_shares(
            user_id,
            permission_level,
            shared_at,
            shared_by
          )
        `, { count: 'exact' })
            .eq('status', status)
            .order(orderBy, { ascending: orderDirection === 'asc' })
            .range((page - 1) * limit, page * limit)

        if (error) throw error

        return NextResponse.json({
            data: projects,
            pagination: {
                page,
                limit,
                total: count || 0,
                pages: count ? Math.ceil(count / limit) : 0
            }
        })

    } catch (error) {
        console.error('Error:', error)
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Internal server error' },
            { status: 500 }
        )
    }
}

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient()
        const body = await request.json()

        const { data: { user }, error: authError } = await supabase.auth.getUser()
        console.log(user)
        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { name } = body

        if (!name?.trim()) {
            return NextResponse.json(
                { error: 'Project name is required' },
                { status: 400 }
            )
        }

        // Create the project
        const { data: project, error: projectError } = await supabase
            .from('project')
            .insert({
                name: name.trim(),
                owner_id: user.id,
                status: 'active'
            })
            .select('*')
            .single()

        if (projectError) throw projectError

        // Get the owner's profile
        const { data: ownerProfile } = await supabase
            .from('profile')
            .select('id, username, first_name, last_name, email')
            .eq('id', user.id)
            .single()

        // Return combined data
        return NextResponse.json({
            data: {
                ...project,
                owner_profile: ownerProfile
            }
        })

    } catch (error) {
        console.error('Error:', error)
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Internal server error' },
            { status: 500 }
        )
    }
}