// app/auth/callback/route.ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const error = requestUrl.searchParams.get('error')
  const next = requestUrl.searchParams.get('next') || '/dashboard'
  
  if (error || !code) {
    return NextResponse.redirect(new URL('/sign-in', requestUrl.origin))
  }

  try {
    // Exchange code for session using @supabase/ssr
    // In Next.js 16, cookies() returns a Promise and must be awaited
    const cookieStore = await cookies()
    
    // Create a response object to capture cookies
    const response = NextResponse.redirect(new URL(next, requestUrl.origin))
    
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              response.cookies.set(name, value, options)
            })
          },
        },
      }
    )
    
    const { data: { session, user }, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

    // If exchange failed, redirect to sign-in
    if (exchangeError) {
      console.error('Exchange error:', exchangeError.message, exchangeError)
      return NextResponse.redirect(new URL('/sign-in?error=auth_failed', requestUrl.origin))
    }

    // If session exists after successful exchange, redirect to dashboard
    if (session && user) {
      console.log('Session established for user:', user.email)
      return response
    }

    // If no session after exchange, redirect to sign-in
    console.error('No session or user after exchange. Session:', !!session, 'User:', !!user)
    return NextResponse.redirect(new URL('/sign-in?error=no_session', requestUrl.origin))
  } catch (err) {
    console.error('Callback error:', err)
    return NextResponse.redirect(new URL('/sign-in?error=callback_error', requestUrl.origin))
  }
}