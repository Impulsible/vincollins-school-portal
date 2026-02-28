/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const { data, error } = await supabase.auth.signInWithPassword({
          email: credentials.email,
          password: credentials.password,
        })

        if (error || !data.user) return null

        const { data: userData } = await supabase
          .from('users')
          .select('role, first_name, last_name')
          .eq('id', data.user.id)
          .single()

        // Ensure all required fields are strings, not undefined
        return {
          id: data.user.id,
          email: data.user.email || '', // Convert undefined to empty string
          name: `${userData?.first_name || ''} ${userData?.last_name || ''}`.trim() || null,
          role: userData?.role || 'student',
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session?.user) {
        (session.user as any).role = token.role
        ;(session.user as any).id = token.id
      }
      return session
    }
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: 'jwt',
  },
}