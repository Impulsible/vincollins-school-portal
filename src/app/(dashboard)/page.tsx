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
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Users, BookOpen, Award, Calendar, TrendingUp, Clock, GraduationCap, FileText, AlertCircle } from 'lucide-react'

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

// Define types for database results
interface Result {
  total_score?: number
}

interface Assignment {
  id: string
  due_date: string
}

interface CBTExam {
  id: string
  scheduled_end: string
}

interface ClassSubject {
  class_id: string
  subject_id: string
}

export default function DashboardPage() {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [stats, setStats] = useState<StatsType>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const supabase = createClient()
        
        // Get current user
        const { data: { user: authUser }, error: authError } = await supabase.auth.getUser()
        
        if (authError) {
          throw new Error('Authentication error: ' + authError.message)
        }
        
        if (!authUser) {
          setLoading(false)
          return
        }

        // Get user profile with role
        const { data: profile, error: profileError } = await supabase
          .from('users')
          .select('*, student:students(*), staff:staff(*)')
          .eq('id', authUser.id)
          .single()
        
        if (profileError) {
          throw new Error('Error fetching profile: ' + profileError.message)
        }
        
        if (profile) {
          setUser(profile as UserProfile)

          // Get role-specific stats
          if (profile?.role === 'student') {
            const { data: results, error: resultsError } = await supabase
              .from('results')
              .select('*')
              .eq('student_id', profile.student?.id)
              .eq('status', 'published')
              .returns<Result[]>()
            
            if (resultsError) {
              console.error('Error fetching results:', resultsError)
            }
            
            const { data: assignments, error: assignmentsError } = await supabase
              .from('assignments')
              .select('*')
              .eq('class_id', profile.student?.class_id)
              .gte('due_date', new Date().toISOString())
              .returns<Assignment[]>()
            
            if (assignmentsError) {
              console.error('Error fetching assignments:', assignmentsError)
            }
            
            const { data: cbtExams, error: cbtError } = await supabase
              .from('cbt_exams')
              .select('*')
              .eq('class_id', profile.student?.class_id)
              .gte('scheduled_end', new Date().toISOString())
              .returns<CBTExam[]>()
            
            if (cbtError) {
              console.error('Error fetching CBT exams:', cbtError)
            }

            const calculateGPA = (results: Result[]) => {
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
            const { data: classSubjects, error: subjectsError } = await supabase
              .from('class_subjects')
              .select('class_id, subject_id')
              .eq('teacher_id', profile.staff?.id)
              .returns<ClassSubject[]>()
            
            if (subjectsError) {
              console.error('Error fetching class subjects:', subjectsError)
            }
            
            const uniqueClasses = new Set(classSubjects?.map(c => c.class_id))
            
            const { count: pendingResults, error: pendingError } = await supabase
              .from('results')
              .select('*', { count: 'exact', head: true })
              .eq('status', 'draft')
              .eq('entered_by', authUser.id)

            if (pendingError) {
              console.error('Error fetching pending results:', pendingError)
            }

            setStats({
              classes: uniqueClasses.size,
              subjects: classSubjects?.length || 0,
              pendingResults: pendingResults || 0,
              totalStudents: 0, // Calculate from classes
            })
          } else if (profile?.role === 'admin') {
            const { count: students, error: studentsError } = await supabase
              .from('students')
              .select('*', { count: 'exact', head: true })
            
            if (studentsError) {
              console.error('Error fetching students count:', studentsError)
            }
            
            const { count: staff, error: staffError } = await supabase
              .from('staff')
              .select('*', { count: 'exact', head: true })
            
            if (staffError) {
              console.error('Error fetching staff count:', staffError)
            }
            
            const { count: pendingResults, error: pendingError } = await supabase
              .from('results')
              .select('*', { count: 'exact', head: true })
              .eq('status', 'pending')
            
            if (pendingError) {
              console.error('Error fetching pending results:', pendingError)
            }
            
            const { count: classes, error: classesError } = await supabase
              .from('classes')
              .select('*', { count: 'exact', head: true })
            
            if (classesError) {
              console.error('Error fetching classes:', classesError)
            }
            
            const { count: activeUsers, error: usersError } = await supabase
              .from('users')
              .select('*', { count: 'exact', head: true })
              .eq('is_active', true)

            if (usersError) {
              console.error('Error fetching active users:', usersError)
            }

            setStats({
              students: students || 0,
              staff: staff || 0,
              pendingResults: pendingResults || 0,
              classes: classes || 0,
              activeUsers: activeUsers || 0,
            })
          }
        }
      } catch (err) {
        console.error('Error in fetchData:', err)
        setError(err instanceof Error ? err.message : 'An unexpected error occurred')
      } finally {
        setLoading(false)
      }
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

  if (error) {
    return (
      <div className="container max-w-4xl py-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load dashboard: {error}
          </AlertDescription>
        </Alert>
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
            <RecentActivities userRole={userRole} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Frequently used tasks</CardDescription>
          </CardHeader>
          <CardContent>
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
                  <span className="text-sm font-medium">
                    {stats && (stats as AdminStats).activeUsers || 0}
                  </span>
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