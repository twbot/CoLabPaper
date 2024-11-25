import { createClient } from "@/utils/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  // The `/auth/callback` route is required for the server-side auth flow implemented
  // by the SSR package. It exchanges an auth code for the user's session.
  // https://supabase.com/docs/guides/auth/server-side/nextjs
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")

  if (code) {
    const supabase = createClient()
    await (await supabase).auth.exchangeCodeForSession(code)
  }

  // Construct the redirect URL
  let redirectUrl = `${origin}/home/?finishSignup=true`

  // URL to redirect to after sign up process completes
  return NextResponse.redirect(redirectUrl)
}
