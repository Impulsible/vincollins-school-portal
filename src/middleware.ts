/* eslint-disable @typescript-eslint/no-unused-vars */
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

  const { data: { session } } = await supabase.auth.getSession()

  const path = request.nextUrl.pathname

  // Define public paths
  const isPublicPath = path === '/' || 
                       path === '/login' || 
                       path === '/forgot-password' || 
                       path === '/reset-password' ||
                       path.startsWith('/_next') ||
                       path.startsWith('/api') ||
                       path.includes('.')

  // Protected routes
  const isProtectedRoute = path.startsWith('/dashboard') ||
                          path.startsWith('/student') ||
                          path.startsWith('/staff') ||
                          path.startsWith('/admin')

  if (!session && isProtectedRoute) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (session && (path === '/login' || path === '/forgot-password' || path === '/reset-password')) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Role-based access
  if (session && isProtectedRoute) {
    const { data: user } = await supabase
      .from('users')
      .select('role')
      .eq('id', session.user.id)
      .single()

    if (path.startsWith('/student') && user?.role !== 'student') {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    if (path.startsWith('/staff') && user?.role !== 'staff') {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    if (path.startsWith('/admin') && user?.role !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}