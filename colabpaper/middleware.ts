import { type NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { createServerClient, type CookieOptions } from '@supabase/ssr'

// Define public routes that don't require authentication
const publicRoutes = [
    '/',              // Splash page
    '/signin',        // Sign in page
    '/signup',        // Sign up page
]

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    // Check if the route is public
    if (publicRoutes.includes(pathname)) {
        // If it's a public route, create a response and a supabase client to check auth status
        let response = NextResponse.next({
            request: {
                headers: request.headers,
            },
        })

        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    getAll() {
                        return request.cookies.getAll()
                    },
                    setAll(cookiesToSet) {
                        cookiesToSet.forEach(({ name, value, options }) => {
                            request.cookies.set({ name, value, ...options })
                        })
                        response = NextResponse.next({
                            request: {
                                headers: request.headers,
                            },
                        })
                        cookiesToSet.forEach(({ name, value, options }) => {
                            response.cookies.set({ name, value, ...options })
                        })
                    },
                },
            }
        )

        // Check if user is authenticated
        const { data: { user } } = await supabase.auth.getUser()

        // If user is authenticated and trying to access auth pages, redirect to dashboard
        if (user && (pathname === '/signin' || pathname === '/signup')) {
            return NextResponse.redirect(new URL('/dashboard', request.url))
        }

        return response
    }

    // For protected routes, check authentication
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return request.cookies.get(name)?.value
                },
                set(name: string, value: string, options: CookieOptions) {
                    request.cookies.set({
                        name,
                        value,
                        ...options,
                    })
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    })
                    response.cookies.set({
                        name,
                        value,
                        ...options,
                    })
                },
                remove(name: string, options: CookieOptions) {
                    request.cookies.set({
                        name,
                        value: '',
                        ...options,
                    })
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    })
                    response.cookies.set({
                        name,
                        value: '',
                        ...options,
                    })
                },
            },
        }
    )

    const { data: { user } } = await supabase.auth.getUser()

    // If no user and trying to access protected route, redirect to splash page
    if (!user) {
        return NextResponse.redirect(new URL('/', request.url))
    }

    return response
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder
         * - auth/callback (auth callback route)
         */
        '/((?!api|_next/static|_next/image|favicon.ico|public|auth/confirm|.*\\.(png|jpg|jpeg|gif|webp)$).*)',
    ],
}