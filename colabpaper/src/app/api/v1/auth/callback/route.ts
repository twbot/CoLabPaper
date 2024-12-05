import { createClient } from "@/utils/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  console.log('Received code:', code) // Debug log

  if (code) {
    try {
      const supabase = await createClient()
      console.log('Attempting to exchange code for session...') // Debug log

      // Exchange the code for a session
      const { data, error } = await supabase.auth.verifyOtp({
        token_hash: code,
        type: 'signup'
      })

      if (error) {
        console.error('Verification error:', error) // Debug log
        return NextResponse.redirect(`${requestUrl.origin}/signup?error=${error.message}`)
      }

      if (data) {
        console.log('Verification successful:', data) // Debug log

        // Get user from the newly created session
        const { data: { user } } = await supabase.auth.getUser()

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
          return NextResponse.redirect(`${requestUrl.origin}/dashboard`)
        }
      }
    } catch (error) {
      console.error('Error in verification process:', error)
      return NextResponse.redirect(`${requestUrl.origin}/signup?error=verification_failed`)
    }
  }

  // If we get here, something went wrong
  console.log('No code provided or verification failed') // Debug log
  return NextResponse.redirect(`${requestUrl.origin}/signup?error=invalid_request`)
}