import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // Initialize Supabase client safely
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // If environment variables are missing, log and continue (prevents crash)
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase environment variables in middleware')
    return response
  }

  try {
    const supabase = createServerClient(
      supabaseUrl,
      supabaseAnonKey,
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

    // Public paths that don't require authentication
    const isPublicPath = 
      path === '/' || 
      path === '/login' || 
      path === '/forgot-password' || 
      path === '/reset-password' ||
      path.startsWith('/_next') ||
      path.startsWith('/api') ||
      path.includes('.')

    // Redirect unauthenticated users from protected routes
    if (!session && !isPublicPath) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirectTo', path)
      return NextResponse.redirect(loginUrl)
    }

    // Redirect authenticated users away from auth pages
    if (session && (path === '/login' || path === '/forgot-password' || path === '/reset-password')) {
      return NextResponse.redirect(new URL('/', request.url))
    }

    // Root path handling for authenticated users
    if (session && path === '/') {
      try {
        const { data: user } = await supabase
          .from('users')
          .select('role')
          .eq('id', session.user.id)
          .single()

        if (user?.role === 'student') {
          return NextResponse.redirect(new URL('/student', request.url))
        }
        if (user?.role === 'staff') {
          return NextResponse.redirect(new URL('/staff', request.url))
        }
        if (user?.role === 'admin') {
          return NextResponse.redirect(new URL('/admin', request.url))
        }
      } catch (error) {
        console.error('Error fetching user role:', error)
        // If role fetch fails, redirect to dashboard (which will handle it)
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }
    }

    // Role-based access control for protected routes
    if (session) {
      try {
        const { data: user } = await supabase
          .from('users')
          .select('role')
          .eq('id', session.user.id)
          .single()

        if (!user) {
          // User record doesn't exist, redirect to login
          return NextResponse.redirect(new URL('/login', request.url))
        }

        if (path.startsWith('/student') && user.role !== 'student') {
          return NextResponse.redirect(new URL('/', request.url))
        }
        if (path.startsWith('/staff') && user.role !== 'staff') {
          return NextResponse.redirect(new URL('/', request.url))
        }
        if (path.startsWith('/admin') && user.role !== 'admin') {
          return NextResponse.redirect(new URL('/', request.url))
        }
      } catch (error) {
        console.error('Role check error:', error)
        // On error, allow access to dashboard which will handle it
        if (path !== '/dashboard') {
          return NextResponse.redirect(new URL('/dashboard', request.url))
        }
      }
    }

    return response
  } catch (error) {
    console.error('Middleware error:', error)
    // Fail open - allow the request to continue
    return response
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}