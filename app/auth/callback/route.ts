// app/auth/callback/route.ts
import { supabase } from '@/lib/supabaseClient'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const { data: { session } } = await supabase.auth.getSession()
  
  if (code) {
    const supabase = createRouteHandlerClient({ cookies })
    await supabase.auth.exchangeCodeForSession(code)
  }

  if (!session) {
    return NextResponse.redirect(new URL('/sign-in', requestUrl.origin))
  }

  return NextResponse.redirect(new URL('/dashboard', requestUrl.origin))
}