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

    // First get the project with owner details
    const { data: project, error } = await supabase
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
          shared_by,
          user:profile!project_shares_user_id_fkey(
            username,
            first_name,
            last_name,
            email
          )
        )
      `)
      .eq('id', params.projectId)
      .single()

    if (error) throw error

    return NextResponse.json({ data: project })

  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
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

    const { name, status } = body

    if (!name && !status) {
      return NextResponse.json(
        { error: 'Nothing to update' },
        { status: 400 }
      )
    }

    const updates: any = {
      updated_at: new Date().toISOString()
    }

    if (name) updates.name = name.trim()
    if (status) {
      if (!['active', 'archived'].includes(status)) {
        return NextResponse.json(
          { error: 'Invalid status' },
          { status: 400 }
        )
      }
      updates.status = status
      if (status === 'archived') {
        updates.archived_at = new Date().toISOString()
        updates.archived_by = user.id
      }
    }

    const { data: project, error } = await supabase
      .from('project')
      .update(updates)
      .eq('id', params.projectId)
      .select(`
                *,
                owner:owner_id(
                    email,
                    profile!inner(username, first_name, last_name)
                ),
                shares:project_shares(
                    user_id,
                    permission_level,
                    shared_at,
                    shared_by,
                    user:user_id(
                        email,
                        profile!inner(username, first_name, last_name)
                    )
                )
            `)
      .single()

    if (error) throw error

    return NextResponse.json({ data: project })

  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { projectId: string } }
) {
  try {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { error } = await supabase
      .from('project')
      .delete()
      .eq('id', params.projectId)
      .eq('owner_id', user.id)

    if (error) throw error

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}
