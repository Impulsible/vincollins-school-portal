/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils/cn'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  LayoutDashboard,
  GraduationCap,
  BookOpen,
  CalendarDays,
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
  Mail,
  Bell,
  Download,
  Upload,
  Edit,
  PlusCircle,
  CheckCircle,
  AlertCircle,
  Eye,
  School,
  UserPlus,
  FileCheck,
  Library,
  Grid,
  Activity,
  TrendingUp,
  Key,
  MessageCircle,
  FileOutput,
  FileInput,
  ChevronRight,
} from 'lucide-react'

// Define the type for navigation items
interface NavChildItem {
  title: string
  href: string
  icon?: React.ComponentType<{ className?: string }>
}

interface NavItem {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  children?: NavChildItem[]
}

interface DashboardSidebarProps {
  user: {
    first_name?: string
    last_name?: string
    role?: 'student' | 'staff' | 'admin' | string
    [key: string]: any
  }
}

export function DashboardSidebar({ user }: DashboardSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    // Implement logout logic here
    // const supabase = createClient()
    // await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const getNavigationItems = (): NavItem[] => {
    const baseItems: NavItem[] = [
      {
        title: 'Dashboard',
        href: '/',
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
            icon: CalendarDays,
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
              { title: 'Enter Results', href: '/staff/results/enter', icon: Edit },
              { title: 'Review', href: '/staff/results/review', icon: FileCheck },
              { title: 'Published', href: '/staff/results/published', icon: CheckCircle },
            ],
          },
          {
            title: 'Assignments',
            href: '/staff/assignments',
            icon: ClipboardList,
            children: [
              { title: 'Create', href: '/staff/assignments/create', icon: PlusCircle },
              { title: 'Manage', href: '/staff/assignments', icon: Edit },
              { title: 'Grade', href: '/staff/assignments/grade', icon: CheckCircle },
            ],
          },
          {
            title: 'Resources',
            href: '/staff/resources',
            icon: BookMarked,
            children: [
              { title: 'Upload', href: '/staff/resources/upload', icon: Upload },
              { title: 'Library', href: '/staff/resources', icon: Library },
              { title: 'Categories', href: '/staff/resources/categories', icon: Grid },
            ],
          },
          {
            title: 'CBT',
            href: '/staff/cbt',
            icon: FileText,
            children: [
              { title: 'Create Exam', href: '/staff/cbt/create', icon: PlusCircle },
              { title: 'Question Bank', href: '/staff/cbt/questions', icon: Database },
              { title: 'Grade', href: '/staff/cbt/grade', icon: CheckCircle },
              { title: 'Schedule', href: '/staff/cbt/schedule', icon: CalendarDays },
            ],
          },
          {
            title: 'Timetable',
            href: '/staff/timetable',
            icon: CalendarDays,
            children: [
              { title: 'View', href: '/staff/timetable', icon: Eye },
              { title: 'Manage', href: '/staff/timetable/manage', icon: Edit },
            ],
          },
          {
            title: 'Class',
            href: '/staff/class',
            icon: Users,
            children: [
              { title: 'My Class', href: '/staff/class', icon: Users },
              { title: 'Students', href: '/staff/class/students', icon: UserCircle },
              { title: 'Attendance', href: '/staff/class/attendance', icon: CheckCircle },
            ],
          },
          {
            title: 'Profile',
            href: '/staff/profile',
            icon: UserCircle,
          },
          {
            title: 'Messages',
            href: '/staff/messages',
            icon: Mail,
          },
          {
            title: 'Notifications',
            href: '/staff/notifications',
            icon: Bell,
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
              { title: 'All Users', href: '/admin/users', icon: Users },
              { title: 'Students', href: '/admin/users/students', icon: GraduationCap },
              { title: 'Staff', href: '/admin/users/staff', icon: Users },
              { title: 'Add Student', href: '/admin/users/students/create', icon: UserPlus },
              { title: 'Add Staff', href: '/admin/users/staff/create', icon: UserPlus },
              { title: 'Roles', href: '/admin/users/roles', icon: Shield },
              { title: 'Permissions', href: '/admin/users/permissions', icon: Shield },
              { title: 'Bulk Upload', href: '/admin/users/bulk-upload', icon: Upload },
            ],
          },
          {
            title: 'Academics',
            href: '/admin/academics',
            icon: GraduationCap,
            children: [
              { title: 'Sessions', href: '/admin/academics/sessions', icon: CalendarDays },
              { title: 'Terms', href: '/admin/academics/terms', icon: Clock },
              { title: 'Classes', href: '/admin/academics/classes', icon: BookOpen },
              { title: 'Subjects', href: '/admin/academics/subjects', icon: BookMarked },
              { title: 'Grading', href: '/admin/academics/grading', icon: Award },
              { title: 'Curriculum', href: '/admin/academics/curriculum', icon: FileText },
            ],
          },
          {
            title: 'Results',
            href: '/admin/results',
            icon: Award,
            children: [
              { title: 'All Results', href: '/admin/results', icon: FileText },
              { title: 'Approval Queue', href: '/admin/results/approval', icon: Clock },
              { title: 'Publish', href: '/admin/results/publish', icon: CheckCircle },
              { title: 'Reports', href: '/admin/results/reports', icon: BarChart },
              { title: 'Transcripts', href: '/admin/results/transcripts', icon: FileText },
              { title: 'Analytics', href: '/admin/results/analytics', icon: TrendingUp },
            ],
          },
          {
            title: 'Timetable',
            href: '/admin/timetable',
            icon: CalendarDays,
            children: [
              { title: 'Create', href: '/admin/timetable/create', icon: PlusCircle },
              { title: 'Manage', href: '/admin/timetable', icon: Edit },
              { title: 'Conflicts', href: '/admin/timetable/conflicts', icon: AlertCircle },
              { title: 'Publish', href: '/admin/timetable/publish', icon: CheckCircle },
            ],
          },
          {
            title: 'CBT',
            href: '/admin/cbt',
            icon: FileText,
            children: [
              { title: 'Exams', href: '/admin/cbt/exams', icon: Database },
              { title: 'Create Exam', href: '/admin/cbt/create', icon: PlusCircle },
              { title: 'Question Bank', href: '/admin/cbt/questions', icon: Database },
              { title: 'Monitoring', href: '/admin/cbt/monitoring', icon: Activity },
              { title: 'Schedule', href: '/admin/cbt/schedule', icon: CalendarDays },
              { title: 'Results', href: '/admin/cbt/results', icon: Award },
            ],
          },
          {
            title: 'Resources',
            href: '/admin/resources',
            icon: BookMarked,
            children: [
              { title: 'Library', href: '/admin/resources', icon: Library },
              { title: 'Upload', href: '/admin/resources/upload', icon: Upload },
              { title: 'Categories', href: '/admin/resources/categories', icon: Grid },
              { title: 'Approval', href: '/admin/resources/approval', icon: CheckCircle },
            ],
          },
          {
            title: 'Reports',
            href: '/admin/reports',
            icon: BarChart,
            children: [
              { title: 'Academic Reports', href: '/admin/reports/academic', icon: BookOpen },
              { title: 'Financial Reports', href: '/admin/reports/financial', icon: FileSpreadsheet },
              { title: 'Attendance Reports', href: '/admin/reports/attendance', icon: Users },
              { title: 'Performance Analytics', href: '/admin/reports/analytics', icon: TrendingUp },
              { title: 'Custom Reports', href: '/admin/reports/custom', icon: FileText },
            ],
          },
          {
            title: 'Exports',
            href: '/admin/exports',
            icon: Download,
            children: [
              { title: 'Export Data', href: '/admin/exports', icon: FileOutput },
              { title: 'Import Data', href: '/admin/imports', icon: FileInput },
              { title: 'Templates', href: '/admin/exports/templates', icon: FileText },
              { title: 'History', href: '/admin/exports/history', icon: Clock },
            ],
          },
          {
            title: 'System',
            href: '/admin/system',
            icon: Settings,
            children: [
              { title: 'Settings', href: '/admin/system/settings', icon: Settings },
              { title: 'Audit Logs', href: '/admin/system/audit-logs', icon: FileText },
              { title: 'Backups', href: '/admin/system/backups', icon: Database },
              { title: 'Maintenance', href: '/admin/system/maintenance', icon: Settings },
              { title: 'Logs', href: '/admin/system/logs', icon: FileText },
              { title: 'API Keys', href: '/admin/system/api-keys', icon: Key },
            ],
          },
          {
            title: 'Communication',
            href: '/admin/communication',
            icon: Mail,
            children: [
              { title: 'Announcements', href: '/admin/announcements', icon: Bell },
              { title: 'Messages', href: '/admin/messages', icon: Mail },
              { title: 'Email Templates', href: '/admin/email-templates', icon: FileText },
              { title: 'SMS Templates', href: '/admin/sms-templates', icon: MessageCircle },
              { title: 'Push Notifications', href: '/admin/push-notifications', icon: Bell },
            ],
          },
          {
            title: 'Profile',
            href: '/admin/profile',
            icon: UserCircle,
          },
        ]

      default:
        return baseItems
    }
  }

  const navigationItems = getNavigationItems()

  return (
    <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 bg-portal-deep text-white">
      <div className="flex h-16 items-center border-b border-white/10 px-6">
        <Link href="/" className="flex items-center space-x-2">
          <School className="h-6 w-6 text-secondary" />
          <span className="font-serif text-xl font-bold">Vincollins</span>
          <span className="text-sm text-secondary">Portal</span>
        </Link>
      </div>

      <ScrollArea className="flex-1 px-4 py-4">
        <nav className="space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
            
            return (
              <div key={item.href} className="space-y-1">
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                    isActive
                      ? 'bg-white/10 text-secondary'
                      : 'text-white/70 hover:bg-white/5 hover:text-white'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.title}</span>
                  {item.children && <ChevronRight className="h-4 w-4 ml-auto" />}
                </Link>
                
                {item.children && (
                  <div className="ml-6 space-y-1">
                    {item.children.map((child: NavChildItem) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className={cn(
                          'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                          pathname === child.href
                            ? 'bg-white/10 text-secondary'
                            : 'text-white/60 hover:bg-white/5 hover:text-white'
                        )}
                      >
                        {child.icon && <child.icon className="h-4 w-4" />}
                        <span>{child.title}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </nav>
      </ScrollArea>

      <div className="border-t border-white/10 p-4">
        <div className="flex items-center gap-3 rounded-lg bg-white/5 px-3 py-2">
          <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
            <UserCircle className="h-5 w-5 text-secondary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">
              {user?.first_name} {user?.last_name}
            </p>
            <p className="text-xs text-white/60 capitalize">{user?.role}</p>
          </div>
        </div>
        <Button
          variant="ghost"
          className="mt-2 w-full justify-start text-white/70 hover:text-white hover:bg-white/5"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  )
}