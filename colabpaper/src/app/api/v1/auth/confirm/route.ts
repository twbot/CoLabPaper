import { type EmailOtpType } from '@supabase/supabase-js'
import { NextResponse, type NextRequest } from 'next/server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function GET(request: NextRequest) {
    const { searchParams, origin } = new URL(request.url)
    const token_hash = searchParams.get('token_hash')
    const type = searchParams.get('type') as EmailOtpType | null
    const next = searchParams.get('next') ?? '/'

    if (token_hash && type) {
        try {
            const supabase = await createClient()

            const { data, error } = await supabase.auth.verifyOtp({
                type,
                token_hash,
            })

            if (error) {
                console.error('Verification error:', error) // Debug log
                return NextResponse.redirect(`${origin}/signup?error=${error.message}`)
            }

            if (data) {
                // Get user from the newly created session
                const { data: { user } } = await supabase.auth.getUser()

                //TODO: Fix signup data transfer from temp_profile to profile table
                if (user) {
                    // Check if profile exists
                    const { data: existingProfile } = await supabase
                        .from('profile')
                        .select('*')
                        .eq('id', user.id)
                        .single()

                    if (!existingProfile) {
                        // Get temp profile data
                        const { data: tempProfile } = await supabase
                            .from('temp_profile')
                            .select('*')
                            .eq('user_id', user.id)
                            .single()

                        if (tempProfile) {
                            // Create the permanent profile
                            const { error: profileError } = await supabase
                                .from('profile')
                                .insert({
                                    id: user.id,
                                    email: tempProfile.email,
                                    username: tempProfile.username,
                                    first_name: tempProfile.first_name,
                                    last_name: tempProfile.last_name
                                })

                            if (profileError) {
                                console.error('Profile creation error:', profileError)
                            } else {
                                // Delete the temp profile
                                await supabase
                                    .from('temp_profile')
                                    .delete()
                                    .eq('user_id', user.id)
                            }
                        }
                    }

                    console.log('Redirecting to dashboard...') // Debug log
                    return NextResponse.redirect(`${origin}/dashboard`)
                }
            }
        } catch (error) {
            console.error('Error in verification process:', error)
            return NextResponse.redirect(`${origin}/signup?error=verification_failed`)
        }
    }

    // If we get here, something went wrong
    console.log('No code provided or verification failed') // Debug log
    return NextResponse.redirect(`${origin}/signup?error=invalid_request`)
}