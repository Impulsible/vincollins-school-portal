'use client'

import { useState, useEffect } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { Download, Users, BookOpen, Award, TrendingUp } from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'

const COLORS = ['#0A2472', '#E2725B', '#87A96B', '#2D6CDF', '#C2413A']

export function ReportsDashboard() {
  const [loading, setLoading] = useState(true)
  const [academicYear, setAcademicYear] = useState('2024')
  const [term, setTerm] = useState('first')
  const [studentsByClass, setStudentsByClass] = useState<any[]>([])
  const [studentsByGender, setStudentsByGender] = useState<any[]>([])
  const [performanceData, setPerformanceData] = useState<any[]>([])
  const [attendanceData, setAttendanceData] = useState<any[]>([])

  const supabase = createClient()

  useEffect(() => {
    fetchDashboardData()
  }, [academicYear, term])

  const fetchDashboardData = async () => {
    setLoading(true)
    try {
      // Fetch students by class - FIXED: Use proper aggregation
      const { data: classData, error: classError } = await supabase
        .from('students')
        .select(`
          class:classes!inner (
            name
          )
        `)

      if (classError) throw classError

      // Manually aggregate by class
      const classCounts: Record<string, number> = {}
      classData?.forEach((item: any) => {
        const className = item.class?.name || 'Unknown'
        classCounts[className] = (classCounts[className] || 0) + 1
      })

      const studentsByClassData = Object.entries(classCounts).map(([name, count]) => ({
        name,
        count,
      }))
      setStudentsByClass(studentsByClassData)

      // Fetch students by gender - FIXED: Use proper aggregation
      const { data: genderData, error: genderError } = await supabase
        .from('students')
        .select('gender')

      if (genderError) throw genderError

      // Manually aggregate by gender
      const genderCounts: Record<string, number> = {}
      genderData?.forEach((item: any) => {
        const gender = item.gender || 'unknown'
        genderCounts[gender] = (genderCounts[gender] || 0) + 1
      })

      const studentsByGenderData = Object.entries(genderCounts).map(([name, count]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        count,
      }))
      setStudentsByGender(studentsByGenderData)

      // Fetch performance data
      const { data: results, error: resultsError } = await supabase
        .from('results')
        .select(`
          total,
          subject:subjects!inner (
            name
          )
        `)
        .eq('status', 'published')
        .limit(1000)

      if (resultsError) throw resultsError

      // Aggregate by subject
      const subjectScores: Record<string, { total: number; count: number }> = {}
      results?.forEach((item: any) => {
        const subjectName = item.subject?.name || 'Unknown'
        if (!subjectScores[subjectName]) {
          subjectScores[subjectName] = { total: 0, count: 0 }
        }
        subjectScores[subjectName].total += item.total || 0
        subjectScores[subjectName].count += 1
      })

      const performanceData = Object.entries(subjectScores).map(([name, data]) => ({
        name,
        average: Math.round(data.total / data.count),
      }))
      setPerformanceData(performanceData)

      // Mock attendance data (since attendance table might not exist)
      setAttendanceData([
        { name: 'Present', value: 85 },
        { name: 'Absent', value: 10 },
        { name: 'Late', value: 5 },
      ])

    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleExport = (format: 'pdf' | 'excel') => {
    console.log(`Exporting as ${format}...`)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with filters */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-serif font-bold">Reports Dashboard</h2>
        <div className="flex items-center gap-4">
          <Select value={academicYear} onValueChange={setAcademicYear}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Academic Year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2024">2024</SelectItem>
              <SelectItem value="2023">2023</SelectItem>
              <SelectItem value="2022">2022</SelectItem>
            </SelectContent>
          </Select>

          <Select value={term} onValueChange={setTerm}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Term" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="first">First Term</SelectItem>
              <SelectItem value="second">Second Term</SelectItem>
              <SelectItem value="third">Third Term</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" onClick={() => handleExport('pdf')}>
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="academic">Academic</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="demographics">Demographics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {studentsByClass.reduce((sum, item) => sum + item.count, 0)}
                </div>
                <p className="text-xs text-muted-foreground">
                  +5 from last term
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Score</CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {performanceData.length > 0
                    ? Math.round(
                        performanceData.reduce((sum, item) => sum + item.average, 0) /
                          performanceData.length
                      )
                    : 0}
                  %
                </div>
                <p className="text-xs text-muted-foreground">
                  +2% from last term
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Subjects</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{performanceData.length}</div>
                <p className="text-xs text-muted-foreground">
                  Across all classes
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">85%</div>
                <p className="text-xs text-muted-foreground">
                  +3% from last term
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Students by Class</CardTitle>
                <CardDescription>
                  Distribution of students across classes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={studentsByClass}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#0A2472" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance by Subject</CardTitle>
                <CardDescription>
                  Average scores across subjects
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Bar dataKey="average" fill="#E2725B" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="demographics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Students by Gender</CardTitle>
                <CardDescription>
                  Gender distribution of students
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={studentsByGender}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="count"
                      >
                        {studentsByGender.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Students by Class</CardTitle>
                <CardDescription>
                  Class-wise distribution
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={studentsByClass}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="count"
                      >
                        {studentsByClass.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="academic">
          <Card>
            <CardHeader>
              <CardTitle>Academic Performance</CardTitle>
              <CardDescription>
                Detailed academic performance metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="average" fill="#E2725B" name="Average Score" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="attendance">
          <Card>
            <CardHeader>
              <CardTitle>Attendance Overview</CardTitle>
              <CardDescription>
                Student attendance statistics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={attendanceData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={150}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {attendanceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}