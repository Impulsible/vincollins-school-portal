'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Download, Eye } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { createClient } from '@/lib/supabase/client'
import { formatDate } from '@/lib/utils/format'

interface Result {
  id: string
  student_id: string
  subject_id: string
  class_id: string
  term: string
  academic_year: string
  assessment_type: string
  score: number
  grade: string
  remarks: string
  status: string
  created_at: string
  subject?: {
    id: string
    name: string
    code: string
  }
}

interface ResultSummary {
  studentName: string
  className: string
  term: string
  academicYear: string
  gpa: number
  totalScore: number
  totalSubjects: number
  results: Result[]
}

export function ResultView() {
  const router = useRouter()
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [results, setResults] = useState<Result[]>([])
  const [summary, setSummary] = useState<ResultSummary | null>(null)
  const [selectedTerm, setSelectedTerm] = useState<string>('')
  const [availableTerms, setAvailableTerms] = useState<string[]>([])
  const [studentId, setStudentId] = useState<string>('')

  const supabase = createClient()

  useEffect(() => {
    const fetchStudentData = async () => {
      if (!user?.id) return

      try {
        // Get student profile
        const { data: student, error: studentError } = await supabase
          .from('students')
          .select('id')
          .eq('user_id', user.id)
          .single()

        if (studentError) throw studentError

        setStudentId(student.id)

        // Fetch results
        const { data: resultsData, error: resultsError } = await supabase
          .from('results')
          .select(`
            *,
            subject:subjects!inner (
              id,
              name,
              code
            )
          `)
          .eq('student_id', student.id)
          .order('created_at', { ascending: false })

        if (resultsError) throw resultsError

        setResults(resultsData || [])

        // Extract unique terms
        const terms = [...new Set(resultsData?.map(r => `${r.term} ${r.academic_year}`) || [])]
        setAvailableTerms(terms)
        
        if (terms.length > 0) {
          setSelectedTerm(terms[0])
        }

      } catch (error) {
        console.error('Error fetching results:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStudentData()
  }, [user, supabase])

  useEffect(() => {
    const generateSummary = async () => {
      if (!selectedTerm || !studentId) return

      try {
        // Filter results by term
        const [term, academicYear] = selectedTerm.split(' ')
        const termResults = results.filter(
          r => r.term === term && r.academic_year === academicYear
        )

        // Get student and class info
        const { data: student, error: studentError } = await supabase
          .from('students')
          .select(`
            first_name,
            last_name,
            class:classes (
              name
            )
          `)
          .eq('id', studentId)
          .single()

        if (studentError) throw studentError

        // FIXED: Handle case where class might be an array
        let className = 'N/A'
        if (student.class) {
          // Check if class is an array
          if (Array.isArray(student.class) && student.class.length > 0) {
            className = student.class[0]?.name || 'N/A'
          } 
          // Check if class is an object
          else if (typeof student.class === 'object' && student.class !== null) {
            className = (student.class as any).name || 'N/A'
          }
        }

        // Calculate summary
        const totalScore = termResults.reduce((sum, r) => sum + r.score, 0)
        const totalSubjects = termResults.length
        const averageScore = totalSubjects > 0 ? totalScore / totalSubjects : 0
        const gpa = (averageScore / 100) * 4 // Convert percentage to 4.0 scale

        setSummary({
          studentName: `${student.first_name} ${student.last_name}`,
          className,
          term,
          academicYear,
          gpa: parseFloat(gpa.toFixed(2)),
          totalScore,
          totalSubjects,
          results: termResults,
        })

      } catch (error) {
        console.error('Error generating summary:', error)
      }
    }

    generateSummary()
  }, [selectedTerm, studentId, results, supabase])

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A': return 'success'
      case 'B': return 'info'
      case 'C': return 'warning'
      case 'D': return 'warning'
      case 'E': return 'destructive'
      case 'F': return 'destructive'
      default: return 'default'
    }
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
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-serif font-bold">My Results</h1>
        {summary && (
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Download Report
          </Button>
        )}
      </div>

      {availableTerms.length > 0 ? (
        <>
          <div className="flex items-center gap-4">
            <Select value={selectedTerm} onValueChange={setSelectedTerm}>
              <SelectTrigger className="w-[250px]">
                <SelectValue placeholder="Select term" />
              </SelectTrigger>
              <SelectContent>
                {availableTerms.map((term) => (
                  <SelectItem key={term} value={term}>
                    {term}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {summary && (
            <>
              {/* Summary Cards */}
              <div className="grid gap-4 md:grid-cols-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Student Name</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xl font-bold">{summary.studentName}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Class</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xl font-bold">{summary.className}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">GPA</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xl font-bold">{summary.gpa}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Total Score</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xl font-bold">{summary.totalScore}</p>
                  </CardContent>
                </Card>
              </div>

              {/* Results Table */}
              <Card>
                <CardHeader>
                  <CardTitle>Subject Results</CardTitle>
                  <CardDescription>
                    {summary.term} Term - {summary.academicYear} Academic Year
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Subject</TableHead>
                        <TableHead>Code</TableHead>
                        <TableHead>Score</TableHead>
                        <TableHead>Grade</TableHead>
                        <TableHead>Remarks</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {summary.results.map((result) => (
                        <TableRow key={result.id}>
                          <TableCell className="font-medium">
                            {result.subject?.name}
                          </TableCell>
                          <TableCell>{result.subject?.code}</TableCell>
                          <TableCell>{result.score}</TableCell>
                          <TableCell>
                            <Badge variant={getGradeColor(result.grade) as any}>
                              {result.grade}
                            </Badge>
                          </TableCell>
                          <TableCell>{result.remarks || '-'}</TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => router.push(`/student/results/${result.id}`)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </>
          )}
        </>
      ) : (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <p className="text-muted-foreground">No results found.</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}