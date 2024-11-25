import { headers } from "next/headers"
import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { EmailAndProfileSignUpSchema } from "@/types"
import { z } from "zod"
import { SIGNUP_RETURN_TYPES } from "@/constants"
import { TempProfilePOSTSchema } from "@/types/api"
import SignUpClient from "./client"

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
        // User already exists, redirect to sign in page with a message
        redirect(`/signup?status=${SIGNUP_RETURN_TYPES.ALREAD_REGISTERED_ERROR}`)
      }
      // Handle other errors
      console.error("Signup error:", error)
      redirect(`/signup?status=${SIGNUP_RETURN_TYPES.ERROR}&message=${encodeURIComponent(error.message)}`)
    }

    if (data.user && data.user.id) {
      try {
        const profileObject: z.infer<typeof TempProfilePOSTSchema> = {
          user_id: data.user.id,
          first_name: values.first_name,
          last_name: values.last_name,
          email: values.email,
          username: values.username
        }

        const response = await fetch(`${origin}/api/${process.env.NEXT_PUBLIC_API_VERSION}/temp-profile`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(profileObject)
        })

        if (!response.ok) {
          const errorData = await response.json()
          console.error("Error adding user profile:", errorData.error)
          //TODO: Handle POST error scenario
        }
      } catch (error) {
        console.error("Error:", error)
        //TODO: Handle any error scenario
      }
    }

    let confirmRedirect = `/signup?status=${SIGNUP_RETURN_TYPES.CONFIRM_EMAIL}&email=${encodeURIComponent(email)}`

    redirect(confirmRedirect)
  }

  return <SignUpClient searchParams={props.searchParams} signUp={signUp} />
}