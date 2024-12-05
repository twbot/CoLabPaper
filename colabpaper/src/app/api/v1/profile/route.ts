// src/app/api/v1/profile/route.ts
import { createClient } from '@/utils/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: profile, error } = await supabase
      .from('profile')
      .select('*')
      .eq('id', user.id)
      .single()

    if (error) throw error

    return NextResponse.json({ data: profile })

  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { username, first_name, last_name } = body

    // Validate username length
    if (username && username.length >= 30) {
      return NextResponse.json(
        { error: 'Username must be less than 30 characters' },
        { status: 400 }
      )
    }

    const { data: profile, error } = await supabase
      .from('profile')
      .update({
        username,
        first_name,
        last_name
      })
      .eq('id', user.id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ data: profile })

  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}