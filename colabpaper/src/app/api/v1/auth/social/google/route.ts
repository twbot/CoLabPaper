import { createClient } from '@/supabase/server'
import { getURL } from '@/utils/fetchHelpers'
import { headers } from "next/headers"

export async function POST(request: Request) {
    const origin = headers().get("origin")
    const supabase = createClient()

    const { user, data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: `${getURL()}api/${process.env.NEXT_PUBLIC_API_VERSION}/auth/callback/social`
        }
    })

    if (error) {
        console.error(error)
        return new Response(JSON.stringify({ error: 'Error signing in with Google' }), {
            status: 500,
        })
    }

    if (data?.url) {
        return new Response(JSON.stringify({ url: data.url }), {
            status: 200,
        })
    }

    return new Response(JSON.stringify({ error: 'No redirect URL found' }), {
        status: 500,
    })
}