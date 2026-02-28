'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { WelcomeBanner } from '@/components/dashboard/welcome-banner'
import { StatsCard } from '@/components/dashboard/stats-card'
import { RecentActivities } from '@/components/dashboard/recent-activities'
import { QuickActions } from '@/components/dashboard/quick-actions'
import { Notifications } from '@/components/dashboard/notifications'
import { NotificationCenter } from '@/components/notifications/notification-center'
import { Badge } from '@/components/ui/badge'
import { Users, BookOpen, Award, Calendar, TrendingUp, Clock, GraduationCap, FileText } from 'lucide-react'

interface UserProfile {
  id: string
  role: 'student' | 'staff' | 'admin'
  first_name?: string
  last_name?: string
  email?: string
  student?: {
    id: string
    class_id: string
  }
  staff?: {
    id: string
    department?: string
  }
}

interface StudentStats {
  results: number
  gpa: string
  pendingAssignments: number
  upcomingExams: number
}

interface StaffStats {
  classes: number
  subjects: number
  pendingResults: number
  totalStudents: number
}

interface AdminStats {
  students: number
  staff: number
  pendingResults: number
  classes: number
  activeUsers: number
}

type StatsType = StudentStats | StaffStats | AdminStats | null

export default function DashboardPage() {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [stats, setStats] = useState<StatsType>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient()
      
      // Get current user
      const { data: { user: authUser } } = await supabase.auth.getUser()
      
      if (authUser) {
        // Get user profile with role
        const { data: profile } = await supabase
          .from('users')
          .select('*, student:students(*), staff:staff(*)')
          .eq('id', authUser.id)
          .single()
        
        if (profile) {
          setUser(profile as UserProfile)

          // Get role-specific stats
          if (profile?.role === 'student') {
            const { data: results } = await supabase
              .from('results')
              .select('*')
              .eq('student_id', profile.student?.id)
              .eq('status', 'published')
            
            const { data: assignments } = await supabase
              .from('assignments')
              .select('*')
              .eq('class_id', profile.student?.class_id)
              .gte('due_date', new Date().toISOString())
            
            const { data: cbtExams } = await supabase
              .from('cbt_exams')
              .select('*')
              .eq('class_id', profile.student?.class_id)
              .gte('scheduled_end', new Date().toISOString())

            const calculateGPA = (results: any[]) => {
              if (!results?.length) return '0.00'
              const total = results.reduce((sum, r) => sum + (r.total_score || 0), 0)
              const percentage = total / (results.length * 100)
              const gpa = (percentage * 4).toFixed(2)
              return gpa
            }

            setStats({
              results: results?.length || 0,
              gpa: calculateGPA(results || []),
              pendingAssignments: assignments?.length || 0,
              upcomingExams: cbtExams?.length || 0,
            })
          } else if (profile?.role === 'staff') {
            const { data: classSubjects } = await supabase
              .from('class_subjects')
              .select('class_id, subject_id')
              .eq('teacher_id', profile.staff?.id)
            
            const uniqueClasses = new Set(classSubjects?.map(c => c.class_id))
            
            const { count: pendingResults } = await supabase
              .from('results')
              .select('*', { count: 'exact', head: true })
              .eq('status', 'draft')
              .eq('entered_by', authUser.id)

            setStats({
              classes: uniqueClasses.size,
              subjects: classSubjects?.length || 0,
              pendingResults: pendingResults || 0,
              totalStudents: 0, // Calculate from classes
            })
          } else if (profile?.role === 'admin') {
            const { count: students } = await supabase
              .from('students')
              .select('*', { count: 'exact', head: true })
            
            const { count: staff } = await supabase
              .from('staff')
              .select('*', { count: 'exact', head: true })
            
            const { count: pendingResults } = await supabase
              .from('results')
              .select('*', { count: 'exact', head: true })
              .eq('status', 'pending')
            
            const { count: classes } = await supabase
              .from('classes')
              .select('*', { count: 'exact', head: true })
            
            const { count: activeUsers } = await supabase
              .from('users')
              .select('*', { count: 'exact', head: true })
              .eq('is_active', true)

            setStats({
              students: students || 0,
              staff: staff || 0,
              pendingResults: pendingResults || 0,
              classes: classes || 0,
              activeUsers: activeUsers || 0,
            })
          }
        }
      }
      
      setLoading(false)
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    )
  }

  const renderStats = () => {
    if (!user?.role || !stats) return null

    switch (user.role) {
      case 'student':
        const studentStats = stats as StudentStats
        return (
          <>
            <StatsCard
              title="Current GPA"
              value={studentStats.gpa}
              icon={TrendingUp}
              description="Overall performance"
              trend={parseFloat(studentStats.gpa) > 3.0 ? 'up' : 'neutral'}
            />
            <StatsCard
              title="Published Results"
              value={studentStats.results}
              icon={Award}
              description="Across all subjects"
            />
            <StatsCard
              title="Pending Assignments"
              value={studentStats.pendingAssignments}
              icon={FileText}
              description="Due this week"
            />
            <StatsCard
              title="Upcoming CBT Exams"
              value={studentStats.upcomingExams}
              icon={GraduationCap}
              description="Scheduled exams"
            />
          </>
        )

      case 'staff':
        const staffStats = stats as StaffStats
        return (
          <>
            <StatsCard
              title="Classes"
              value={staffStats.classes}
              icon={Users}
              description="Assigned classes"
            />
            <StatsCard
              title="Subjects"
              value={staffStats.subjects}
              icon={BookOpen}
              description="Teaching subjects"
            />
            <StatsCard
              title="Pending Results"
              value={staffStats.pendingResults}
              icon={Award}
              description="Awaiting entry"
            />
            <StatsCard
              title="Total Students"
              value={staffStats.totalStudents}
              icon={Users}
              description="Across all classes"
            />
          </>
        )

      case 'admin':
        const adminStats = stats as AdminStats
        return (
          <>
            <StatsCard
              title="Total Students"
              value={adminStats.students}
              icon={Users}
              description="Enrolled students"
              trend="up"
            />
            <StatsCard
              title="Staff Members"
              value={adminStats.staff}
              icon={Users}
              description="Teaching & non-teaching"
            />
            <StatsCard
              title="Active Classes"
              value={adminStats.classes}
              icon={BookOpen}
              description="Current session"
            />
            <StatsCard
              title="Pending Approvals"
              value={adminStats.pendingResults}
              icon={Clock}
              description="Results awaiting approval"
              trend={adminStats.pendingResults > 0 ? 'down' : 'neutral'}
            />
          </>
        )

      default:
        return null
    }
  }

  // Get user role as a non-undefined string or default to 'student'
  const userRole = user?.role || 'student'

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <WelcomeBanner user={user} />
        <NotificationCenter />
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {renderStats()}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>Your latest activities and updates</CardDescription>
          </CardHeader>
          <CardContent>
            {/* FIXED: Use userRole prop (not role) */}
            <RecentActivities userRole={userRole} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Frequently used tasks</CardDescription>
          </CardHeader>
          <CardContent>
            {/* QuickActions uses role prop - this one is correct */}
            <QuickActions role={userRole} />
          </CardContent>
        </Card>
      </div>

      {/* Notifications Section */}
      <Card>
        <CardHeader>
          <CardTitle>Important Notifications</CardTitle>
          <CardDescription>Stay updated with important announcements</CardDescription>
        </CardHeader>
        <CardContent>
          {/* FIXED: Use userRole prop (not role) */}
          <Notifications userRole={userRole} />
        </CardContent>
      </Card>

      {/* Additional Role-Specific Sections */}
      {user?.role === 'admin' && (
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>System Health</CardTitle>
              <CardDescription>Overview of system status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Database Status</span>
                  <Badge variant="success">Operational</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Storage Usage</span>
                  <span className="text-sm font-medium">45% used</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Active Users</span>
                  <span className="text-sm font-medium">{stats && (stats as AdminStats).activeUsers || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Last Backup</span>
                  <span className="text-sm text-muted-foreground">Today, 2:00 AM</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
              <CardDescription>Important dates and deadlines</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Result Entry Deadline</p>
                    <p className="text-xs text-muted-foreground">June 10, 2024</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-secondary/10 rounded-lg flex items-center justify-center">
                    <Award className="h-5 w-5 text-secondary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">PTA Meeting</p>
                    <p className="text-xs text-muted-foreground">June 15, 2024 • 4:00 PM</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-accent/10 rounded-lg flex items-center justify-center">
                    <GraduationCap className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">End of Term Exams</p>
                    <p className="text-xs text-muted-foreground">June 20 - July 5, 2026</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}