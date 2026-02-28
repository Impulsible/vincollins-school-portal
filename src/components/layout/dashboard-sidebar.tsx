'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils/cn'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  LayoutDashboard,
  GraduationCap,
  BookOpen,
  Calendar,
  ClipboardList,
  FileText,
  Users,
  Settings,
  LogOut,
  Award,
  BookMarked,
  Clock,
  BarChart,
  UserCircle,
  Shield,
  Database,
  FileSpreadsheet,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface ChildNavItem {
  title: string
  href: string
}

interface NavItem {
  title: string
  href: string
  icon: React.ElementType
  children?: ChildNavItem[]
}

interface DashboardSidebarProps {
  user: any
}

export function DashboardSidebar({ user }: DashboardSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const getNavigationItems = (): NavItem[] => {
    const baseItems: NavItem[] = [
      {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutDashboard,
      },
    ]

    switch (user?.role) {
      case 'student':
        return [
          ...baseItems,
          {
            title: 'My Results',
            href: '/student/results',
            icon: Award,
          },
          {
            title: 'Timetable',
            href: '/student/timetable',
            icon: Calendar,
          },
          {
            title: 'Assignments',
            href: '/student/assignments',
            icon: ClipboardList,
          },
          {
            title: 'Resources',
            href: '/student/resources',
            icon: BookMarked,
          },
          {
            title: 'CBT Exams',
            href: '/student/cbt',
            icon: FileText,
          },
          {
            title: 'Profile',
            href: '/student/profile',
            icon: UserCircle,
          },
        ]

      case 'staff':
        return [
          ...baseItems,
          {
            title: 'Results',
            href: '/staff/results',
            icon: Award,
            children: [
              { title: 'Enter Results', href: '/staff/results/enter' },
              { title: 'Review', href: '/staff/results/review' },
            ],
          },
          {
            title: 'Assignments',
            href: '/staff/assignments',
            icon: ClipboardList,
            children: [
              { title: 'Create', href: '/staff/assignments/create' },
              { title: 'Manage', href: '/staff/assignments' },
            ],
          },
          {
            title: 'Resources',
            href: '/staff/resources',
            icon: BookMarked,
            children: [
              { title: 'Upload', href: '/staff/resources/upload' },
              { title: 'Library', href: '/staff/resources' },
            ],
          },
          {
            title: 'CBT',
            href: '/staff/cbt',
            icon: FileText,
            children: [
              { title: 'Create Exam', href: '/staff/cbt/create' },
              { title: 'Grade', href: '/staff/cbt/grade' },
              { title: 'Schedule', href: '/staff/cbt/schedule' },
            ],
          },
          {
            title: 'Timetable',
            href: '/staff/timetable',
            icon: Calendar,
            children: [
              { title: 'View', href: '/staff/timetable' },
              { title: 'Manage', href: '/staff/timetable/manage' },
            ],
          },
          {
            title: 'Class',
            href: '/staff/class',
            icon: Users,
          },
          {
            title: 'Profile',
            href: '/staff/profile',
            icon: UserCircle,
          },
        ]

      case 'admin':
        return [
          ...baseItems,
          {
            title: 'User Management',
            href: '/admin/users',
            icon: Users,
            children: [
              { title: 'Students', href: '/admin/users/students' },
              { title: 'Staff', href: '/admin/users/staff' },
              { title: 'Roles', href: '/admin/users/roles' },
              { title: 'Bulk Upload', href: '/admin/users/bulk-upload' },
            ],
          },
          {
            title: 'Academics',
            href: '/admin/academics',
            icon: GraduationCap,
            children: [
              { title: 'Sessions', href: '/admin/academics/sessions' },
              { title: 'Classes', href: '/admin/academics/classes' },
              { title: 'Subjects', href: '/admin/academics/subjects' },
              { title: 'Grading', href: '/admin/academics/grading' },
            ],
          },
          {
            title: 'Results',
            href: '/admin/results',
            icon: Award,
            children: [
              { title: 'Approval', href: '/admin/results/approval' },
              { title: 'Publish', href: '/admin/results/publish' },
              { title: 'Reports', href: '/admin/results/reports' },
            ],
          },
          {
            title: 'Timetable',
            href: '/admin/timetable',
            icon: Calendar,
            children: [
              { title: 'Create', href: '/admin/timetable/create' },
              { title: 'Manage', href: '/admin/timetable' },
            ],
          },
          {
            title: 'CBT',
            href: '/admin/cbt',
            icon: FileText,
            children: [
              { title: 'Exams', href: '/admin/cbt/exams' },
              { title: 'Monitoring', href: '/admin/cbt/monitoring' },
              { title: 'Schedule', href: '/admin/cbt/schedule' },
            ],
          },
          {
            title: 'Resources',
            href: '/admin/resources',
            icon: BookMarked,
            children: [
              { title: 'Library', href: '/admin/resources' },
              { title: 'Approval', href: '/admin/resources/approval' },
            ],
          },
          {
            title: 'System',
            href: '/admin/system',
            icon: Settings,
            children: [
              { title: 'Audit Logs', href: '/admin/system/audit-logs' },
              { title: 'Settings', href: '/admin/system/settings' },
              { title: 'Backups', href: '/admin/system/backups' },
            ],
          },
          {
            title: 'Exports',
            href: '/admin/exports',
            icon: FileSpreadsheet,
            children: [
              { title: 'Export Data', href: '/admin/exports' },
              { title: 'History', href: '/admin/exports/history' },
            ],
          },
        ]

      default:
        return baseItems
    }
  }

  const navigationItems = getNavigationItems()

  // Helper function to check if a path is active
  const isPathActive = (href: string): boolean => {
    return pathname === href || pathname.startsWith(href + '/')
  }

  return (
    <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 bg-[#0A2472] text-white">
      <div className="flex h-16 items-center border-b border-white/10 px-6">
        <Link href="/dashboard" className="flex items-center space-x-2">
          <span className="font-serif text-xl font-bold text-white">Vincollins</span>
          <span className="text-sm text-secondary">Portal</span>
        </Link>
      </div>

      <ScrollArea className="flex-1 px-4 py-4">
        <nav className="space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon
            const isActive = isPathActive(item.href)
            const hasChildren = item.children && item.children.length > 0
            const showChildren = hasChildren && isActive
            
            return (
              <div key={item.href} className="space-y-1">
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors duration-200',
                    isActive
                      ? 'bg-white/15 text-secondary font-medium'
                      : 'text-white/70 hover:bg-white/10 hover:text-white'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.title}</span>
                  {isActive && (
                    <span className="ml-auto h-1.5 w-1.5 rounded-full bg-secondary" />
                  )}
                </Link>
                
                {showChildren && (
                  <div className="ml-6 space-y-1 mt-1">
                    {item.children?.map((child) => {
                      const isChildActive = pathname === child.href
                      return (
                        <Link
                          key={child.href}
                          href={child.href}
                          className={cn(
                            'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors duration-200',
                            isChildActive
                              ? 'bg-white/15 text-secondary font-medium'
                              : 'text-white/60 hover:bg-white/10 hover:text-white'
                          )}
                        >
                          <span className="text-xs">•</span>
                          <span>{child.title}</span>
                          {isChildActive && (
                            <span className="ml-auto h-1 w-1 rounded-full bg-secondary" />
                          )}
                        </Link>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </nav>
      </ScrollArea>

      <div className="border-t border-white/10 p-4">
        <div className="flex items-center gap-3 rounded-lg bg-white/5 px-3 py-2">
          <div className="h-8 w-8 rounded-full bg-secondary/20 flex items-center justify-center">
            <UserCircle className="h-5 w-5 text-secondary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {user?.first_name} {user?.last_name}
            </p>
            <p className="text-xs text-white/60 capitalize">{user?.role}</p>
          </div>
        </div>
        <Button
          variant="ghost"
          className="mt-2 w-full justify-start text-white/70 hover:text-white hover:bg-white/10"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  )
}