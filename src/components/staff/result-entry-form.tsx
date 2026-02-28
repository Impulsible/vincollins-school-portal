// src/components/staff/result-entry-form.tsx
'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useToast } from '@/hooks/use-toast'
import { createClient } from '@/lib/supabase/client'
import { Loader2, Save, CheckCircle2 } from 'lucide-react'

const resultEntrySchema = z.object({
  classId: z.string().min(1, 'Class is required'),
  subjectId: z.string().min(1, 'Subject is required'),
  term: z.string().min(1, 'Term is required'),
  academicYear: z.string().min(1, 'Academic year is required'),
  assessmentType: z.string().min(1, 'Assessment type is required'),
  maxScore: z.number().min(1, 'Max score is required'),
})

type ResultEntryFormData = z.infer<typeof resultEntrySchema>

interface Student {
  id: string
  student_number: string
  first_name: string
  last_name: string
  class_id: string
}

interface StudentScore {
  studentId: string
  score: number
  remarks?: string
}

interface Class {
  id: string
  name: string
  code: string
}

interface Subject {
  id: string
  name: string
  code: string
  class_id: string
}

export function ResultEntryForm() {
  const router = useRouter()
  const { success, error } = useToast()
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [classes, setClasses] = useState<Class[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [scores, setScores] = useState<StudentScore[]>([])
  const [selectedClass, setSelectedClass] = useState<string>('')
  const [selectedSubject, setSelectedSubject] = useState<string>('')

  const supabase = createClient()

  const form = useForm<ResultEntryFormData>({
    resolver: zodResolver(resultEntrySchema),
    defaultValues: {
      term: new Date().getMonth() < 4 ? 'First Term' : new Date().getMonth() < 8 ? 'Second Term' : 'Third Term',
      academicYear: new Date().getFullYear().toString(),
      assessmentType: 'CA1',
      maxScore: 20,
    },
  })

  // Fetch classes for the teacher
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        setLoading(true)
        
        // Get current user
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        // Get teacher's classes from class_subjects
        const { data, error: fetchError } = await supabase
          .from('class_subjects')
          .select(`
            class:classes!inner (
              id,
              name,
              code
            )
          `)
          .eq('teacher_id', user.id)

        if (fetchError) throw fetchError

        if (data) {
          // FIXED: Properly extract unique classes from the response
          const classMap = new Map<string, Class>()
          data.forEach((item: any) => {
            if (item.class) {
              classMap.set(item.class.id, {
                id: item.class.id,
                name: item.class.name,
                code: item.class.code,
              })
            }
          })
          setClasses(Array.from(classMap.values()))
        }
      } catch (err) {
        console.error('Error fetching classes:', err)
        error?.('Failed to load classes')
      } finally {
        setLoading(false)
      }
    }

    fetchClasses()
  }, [supabase, error])

  // Fetch subjects when class is selected
  useEffect(() => {
    const fetchSubjects = async () => {
      if (!selectedClass) return

      try {
        setLoading(true)
        
        // Get current user
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { data, error: fetchError } = await supabase
          .from('class_subjects')
          .select(`
            subject:subjects!inner (
              id,
              name,
              code
            )
          `)
          .eq('class_id', selectedClass)
          .eq('teacher_id', user.id)

        if (fetchError) throw fetchError

        if (data) {
          // FIXED: Properly extract subjects from the response
          const subjectsList = data
            .map((item: any) => item.subject)
            .filter(Boolean)
            .map((subject: any) => ({
              id: subject.id,
              name: subject.name,
              code: subject.code,
              class_id: selectedClass,
            }))
          setSubjects(subjectsList)
        }
      } catch (err) {
        console.error('Error fetching subjects:', err)
        error?.('Failed to load subjects')
      } finally {
        setLoading(false)
      }
    }

    fetchSubjects()
  }, [selectedClass, supabase, error])

  // Fetch students when class is selected
  useEffect(() => {
    const fetchStudents = async () => {
      if (!selectedClass) return

      try {
        setLoading(true)
        
        const { data, error: fetchError } = await supabase
          .from('students')
          .select('id, student_number, first_name, last_name, class_id')
          .eq('class_id', selectedClass)
          .order('first_name')

        if (fetchError) throw fetchError

        if (data) {
          setStudents(data)
          // Initialize scores array
          setScores(data.map(student => ({
            studentId: student.id,
            score: 0,
            remarks: '',
          })))
        }
      } catch (err) {
        console.error('Error fetching students:', err)
        error?.('Failed to load students')
      } finally {
        setLoading(false)
      }
    }

    fetchStudents()
  }, [selectedClass, supabase, error])

  const handleScoreChange = (studentId: string, score: number) => {
    setScores(prev => 
      prev.map(s => 
        s.studentId === studentId ? { ...s, score } : s
      )
    )
  }

  const handleRemarkChange = (studentId: string, remarks: string) => {
    setScores(prev => 
      prev.map(s => 
        s.studentId === studentId ? { ...s, remarks } : s
      )
    )
  }

  const onSubmit = async (data: ResultEntryFormData) => {
    try {
      setSubmitting(true)

      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      // Prepare results data
      const results = scores.map(score => ({
        student_id: score.studentId,
        subject_id: data.subjectId,
        class_id: data.classId,
        term: data.term,
        academic_year: data.academicYear,
        assessment_type: data.assessmentType,
        score: score.score,
        remarks: score.remarks,
        entered_by: user.id,
        status: 'draft',
      }))

      // Insert results
      const { error: insertError } = await supabase
        .from('results')
        .insert(results)

      if (insertError) throw insertError

      success?.('Results saved successfully')
      
      // Reset form
      setScores([])
      form.reset()
      
      // Redirect after short delay
      setTimeout(() => {
        router.push('/staff/results')
      }, 2000)

    } catch (err) {
      console.error('Error saving results:', err)
      error?.(err instanceof Error ? err.message : 'Failed to save results')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading && classes.length === 0) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Result Entry Form</CardTitle>
          <CardDescription>
            Enter student scores for assessments and exams
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <FormField
                  control={form.control}
                  name="classId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Class</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value)
                          setSelectedClass(value)
                          setSelectedSubject('')
                        }}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select class" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {classes.map((cls) => (
                            <SelectItem key={cls.id} value={cls.id}>
                              {cls.name} ({cls.code})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="subjectId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subject</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value)
                          setSelectedSubject(value)
                        }}
                        value={field.value}
                        disabled={!selectedClass}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select subject" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {subjects.map((subject) => (
                            <SelectItem key={subject.id} value={subject.id}>
                              {subject.name} ({subject.code})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="assessmentType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Assessment Type</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="CA1">CA 1 (20%)</SelectItem>
                          <SelectItem value="CA2">CA 2 (20%)</SelectItem>
                          <SelectItem value="CA3">CA 3 (20%)</SelectItem>
                          <SelectItem value="EXAM">Examination (40%)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="maxScore"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Maximum Score</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          {...field}
                          onChange={e => field.onChange(parseInt(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="academicYear"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Academic Year</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="term"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Term</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select term" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="First Term">First Term</SelectItem>
                          <SelectItem value="Second Term">Second Term</SelectItem>
                          <SelectItem value="Third Term">Third Term</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {students.length > 0 && (
                <div className="space-y-4">
                  <h3 className="font-medium">Student Scores</h3>
                  <div className="border rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>#</TableHead>
                          <TableHead>Student Number</TableHead>
                          <TableHead>Student Name</TableHead>
                          <TableHead>Score</TableHead>
                          <TableHead>Remarks</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {students.map((student, index) => {
                          const studentScore = scores.find(s => s.studentId === student.id)
                          return (
                            <TableRow key={student.id}>
                              <TableCell>{index + 1}</TableCell>
                              <TableCell className="font-mono text-xs">
                                {student.student_number}
                              </TableCell>
                              <TableCell className="font-medium">
                                {student.first_name} {student.last_name}
                              </TableCell>
                              <TableCell>
                                <Input
                                  type="number"
                                  min="0"
                                  max={form.getValues('maxScore')}
                                  value={studentScore?.score || 0}
                                  onChange={(e) => handleScoreChange(student.id, parseInt(e.target.value) || 0)}
                                  className="w-24"
                                />
                              </TableCell>
                              <TableCell>
                                <Input
                                  placeholder="Remarks (optional)"
                                  value={studentScore?.remarks || ''}
                                  onChange={(e) => handleRemarkChange(student.id, e.target.value)}
                                />
                              </TableCell>
                            </TableRow>
                          )
                        })}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}

              <div className="flex gap-4">
                <Button type="submit" disabled={submitting || students.length === 0}>
                  {submitting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="mr-2 h-4 w-4" />
                  )}
                  Save Results
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push('/staff/results')}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {students.length === 0 && selectedClass && (
        <Alert>
          <AlertDescription>
            No students found in this class.
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}