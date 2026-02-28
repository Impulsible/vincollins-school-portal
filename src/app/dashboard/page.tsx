'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { FullPageLoader } from '@/components/shared/loading-spinner'

export default function DashboardPage() {
  const router = useRouter()

  useEffect(() => {
    const redirectToRoleDashboard = async () => {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        router.push('/login')
        return
      }

      const { data: user } = await supabase
        .from('users')
        .select('role')
        .eq('id', session.user.id)
        .single()

      // Add a small delay to show the beautiful loader
      await new Promise(resolve => setTimeout(resolve, 1000))

      switch (user?.role) {
        case 'student':
          router.push('/student')
          break
        case 'staff':
          router.push('/staff')
          break
        case 'admin':
          router.push('/admin')
          break
        default:
          router.push('/login')
      }
    }

    redirectToRoleDashboard()
  }, [router])

  return <FullPageLoader />
}