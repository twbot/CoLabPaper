import { headers } from "next/headers"
import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { EmailAndProfileSignUpSchema } from "@/types"
import { z } from "zod"
import SignUpClient from "./client"
import { SIGNUP_RETURN_TYPES } from "@/constants"

interface SignUpPageProps {
  searchParams: { status: string; email: string; }
}

export default function SignUpPage(props: SignUpPageProps) {
  async function signUp(values: z.infer<typeof EmailAndProfileSignUpSchema>): Promise<never> {
    "use server"

    const origin = headers().get("origin")
    const email = values.email
    const password = values.password
    const supabase = await createClient()

    // First, create a temporary profile
    const { error: tempProfileError } = await supabase
      .from('temp_profile')
      .insert({
        user_id: undefined, // This will be updated after user creation
        email: values.email,
        username: values.username,
        first_name: values.first_name,
        last_name: values.last_name
      })

    if (tempProfileError) {
      console.error("Error creating temp profile:", tempProfileError)
      redirect(`/signup?status=${SIGNUP_RETURN_TYPES.ERROR}`)
    }

    let redirectTo = `${origin}/api/${process.env.NEXT_PUBLIC_API_VERSION}/auth/callback`

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectTo,
      },
    })

    if (error) {
      if (error.status === 422 && error.message === "User already registered") {
        return redirect(`/signup?status=${SIGNUP_RETURN_TYPES.ALREAD_REGISTERED_ERROR}`)
      }
      console.error("Signup error:", error)
      return redirect(`/signup?status=${SIGNUP_RETURN_TYPES.ERROR}&message=${encodeURIComponent(error.message)}`)
    }

    // Update the temp profile with the user ID
    if (data.user) {
      const { error: updateError } = await supabase
        .from('temp_profile')
        .update({ user_id: data.user.id })
        .eq('email', email)

      if (updateError) {
        console.error("Error updating temp profile:", updateError)
      }
    }

    // Redirect to confirmation page
    return redirect(`/signup?status=${SIGNUP_RETURN_TYPES.CONFIRM_EMAIL}&email=${encodeURIComponent(email)}`)
  }

  return <SignUpClient searchParams={props.searchParams} signUp={signUp} />
}