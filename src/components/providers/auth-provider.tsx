'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { createClient } from '@/lib/supabase/client'

interface User {
  id: string
  email?: string | null
  name?: string | null
  role?: string
  firstName?: string
  lastName?: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Define fetchProfile before using it in useEffect
  const fetchProfile = async (userId: string) => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()
      
      if (error) {
        console.error('Error fetching profile:', error)
        return
      }
      
      if (data) {
        setUser(prevUser => {
          if (!prevUser) return null
          return {
            ...prevUser,
            firstName: data.first_name,
            lastName: data.last_name,
            role: data.role,
          }
        })
      }
    } catch (error) {
      console.error('Error in fetchProfile:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (status === 'loading') {
      setIsLoading(true)
      return
    }

    if (session?.user) {
      // Check if user has id (with type assertion since we've extended the types)
      const sessionUser = session.user as any
      
      setUser({
        id: sessionUser.id || '',
        email: sessionUser.email,
        name: sessionUser.name,
        role: sessionUser.role,
        firstName: sessionUser.firstName,
        lastName: sessionUser.lastName,
      })
      
      // Fetch additional profile data if needed
      if (sessionUser.id) {
        fetchProfile(sessionUser.id)
      } else {
        setIsLoading(false)
      }
    } else {
      setUser(null)
      setIsLoading(false)
    }
  }, [session, status])

  const signOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}