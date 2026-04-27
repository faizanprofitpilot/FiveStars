import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
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

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const path = request.nextUrl.pathname

  // Protected routes
  if (path.startsWith('/dashboard') ||
      path.startsWith('/onboarding') ||
      path.startsWith('/integrations')) {
    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  // Enforce 7-day trial: after expiry, block dashboard access unless upgraded.
  // Allow Billing page so users can upgrade.
  if (user && path.startsWith('/dashboard') && !path.startsWith('/dashboard/billing')) {
    // Active subscription?
    const { data: sub } = await supabase
      .from('billing_subscriptions')
      .select('status')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    const isActive = sub?.status === 'active' || sub?.status === 'trialing'

    if (!isActive) {
      const { data: biz } = await supabase
        .from('businesses')
        .select('trial_ends_at, created_at')
        .eq('user_id', user.id)
        .single()

      const trialEndsAt = biz?.trial_ends_at || (biz?.created_at ? new Date(biz.created_at).toISOString() : null)
      const trialEndMs = trialEndsAt ? new Date(trialEndsAt).getTime() : 0
      const nowMs = Date.now()

      // If trial_ends_at missing, treat as expired (forces upgrade)
      if (!trialEndMs || nowMs >= trialEndMs) {
        const url = new URL('/dashboard/billing', request.url)
        url.searchParams.set('expired', '1')
        url.searchParams.set('returnTo', path)
        return NextResponse.redirect(url)
      }
    }
  }

  // Redirect authenticated users away from auth pages
  if (request.nextUrl.pathname.startsWith('/login') ||
      request.nextUrl.pathname.startsWith('/signup')) {
    if (user) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

