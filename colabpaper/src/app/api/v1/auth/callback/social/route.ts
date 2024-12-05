import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { type CookieOptions, createServerClient } from '@supabase/ssr'
import { createClient } from '@/utils/supabase/server'

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')
    // if "next" is in param, use it as the redirect URL
    const next = searchParams.get('next') ?? '/'

    if (code) {
        const supabase = await createClient()

        const { data: { user }, error } = await supabase.auth.exchangeCodeForSession(code)
        if (user && !error) {
            // Check if the user has a profile set up
            const { data: profileData, error: profileError } = await supabase
                .from('profile')
                .select('*')
                .eq('id', user?.id)
                .single()

            if (!profileData) {
                const profileImageUrl = user.user_metadata.avatar_url
                const email = user.user_metadata.email
                const username = email.split('@')[0]
                const fullName = user.user_metadata.full_name
                const firstName = fullName.split(' ')[0]
                const lastName = fullName.split(' ')[1]
                try {
                    const { data, error } = await supabase
                        .from('profile')
                        .insert({
                            id: user.id,
                            email: email,
                            profile_image: profileImageUrl,
                            username: username,
                            first_name: firstName,
                            last_name: lastName
                        })

                    if (error) {
                        console.error('Error inserting profile:', error)
                    } else {
                        console.log(`User profile with id ${user.id} created through Google SSO.`)
                    }
                } catch (error) {
                    console.error('Error inserting profile:', error)
                }
            }

            if (profileError || !profileData) {
                // If the user doesn't have a profile, redirect to the profile-setup page
                // return NextResponse.redirect(`${origin}/profile-setup`)
                return NextResponse.redirect(`${origin}`)
            }

            // If the user has a profile, redirect to the "next" URL or the default route
            return NextResponse.redirect(`${origin}${next}`)
        }
    }

    // return the user to an error page with instructions
    return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}