import { headers } from "next/headers"
import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { EmailSignInFormSchema } from "@/types/form.type"
import { z } from "zod"
import SignInClient from "./client"
import { SIGNIN_RETURN_TYPES } from "@/constants"

interface SignInPageProps {
  searchParams: { status: string; memoryID?: string }
}

export default function SignInPage(props: SignInPageProps) {
  async function signIn(values: z.infer<typeof EmailSignInFormSchema>): Promise<never> {
    "use server"

    const origin = headers().get("origin")
    const email = values.email
    const password = values.password
    const supabase = createClient()

    const { error } = await (await supabase).auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      if (error) {
        if (error.message === "Invalid login credentials") {
          redirect(`/signin?status=${SIGNIN_RETURN_TYPES.INVALID_CREDENTIALS}`)
        }
        redirect(`/signin?status=${SIGNIN_RETURN_TYPES.ERROR}`)
      }
    }

    return redirect(`${origin}`)
  }

  return <SignInClient searchParams={props.searchParams} signIn={signIn} />
}
