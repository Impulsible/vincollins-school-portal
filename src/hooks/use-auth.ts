// src/hooks/use-auth.ts
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'

export interface User {
  id: string
  name?: string | null
  email?: string | null
  image?: string | null
  role?: string
  firstName?: string
  lastName?: string
}

export function useAuth() {
  const { data: session, status } = useSession()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<User | undefined>()

  useEffect(() => {
    if (status === 'loading') {
      setIsLoading(true)
    } else {
      setIsAuthenticated(!!session)
      setUser(session?.user as User)
      setIsLoading(false)
    }
  }, [session, status])

  return {
    user,
    isAuthenticated,
    isLoading,
    role: (session?.user as any)?.role,
  }
}