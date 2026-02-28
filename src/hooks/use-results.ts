import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/hooks/use-toast'

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
  status: 'draft' | 'submitted' | 'approved' | 'published'
  entered_by: string
  approved_by?: string
  published_at?: string
  created_at: string
  updated_at: string
}

interface ResultWithDetails extends Result {
  student?: {
    id: string
    first_name: string
    last_name: string
    student_number: string
  }
  subject?: {
    id: string
    name: string
    code: string
  }
  class?: {
    id: string
    name: string
    code: string
  }
}

interface StudentResultSummary {
  studentId: string
  studentName: string
  className: string
  term: string
  academicYear: string
  subjects: {
    name: string
    score: number
    grade: string
    remarks: string
  }[]
  totalScore: number
  averageScore: number
  gpa: number
}

export function useResults() {
  const [results, setResults] = useState<ResultWithDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { success, error: toastError } = useToast()
  const supabase = createClient()

  const fetchResults = async (filters?: {
    classId?: string
    subjectId?: string
    studentId?: string
    term?: string
    academicYear?: string
    status?: string
  }) => {
    setLoading(true)
    setError(null)

    try {
      let query = supabase
        .from('results')
        .select(`
          *,
          student:students!inner (
            id,
            first_name,
            last_name,
            student_number
          ),
          subject:subjects!inner (
            id,
            name,
            code
          ),
          class:classes!inner (
            id,
            name,
            code
          )
        `)
        .order('created_at', { ascending: false })

      if (filters?.classId) {
        query = query.eq('class_id', filters.classId)
      }

      if (filters?.subjectId) {
        query = query.eq('subject_id', filters.subjectId)
      }

      if (filters?.studentId) {
        query = query.eq('student_id', filters.studentId)
      }

      if (filters?.term) {
        query = query.eq('term', filters.term)
      }

      if (filters?.academicYear) {
        query = query.eq('academic_year', filters.academicYear)
      }

      if (filters?.status) {
        query = query.eq('status', filters.status)
      }

      const { data, error } = await query

      if (error) throw error

      setResults(data || [])
    } catch (err) {
      console.error('Error fetching results:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch results')
      toastError?.('Failed to load results')
    } finally {
      setLoading(false)
    }
  }

  const getStudentResults = async (studentId: string): Promise<ResultWithDetails[]> => {
    try {
      const { data, error } = await supabase
        .from('results')
        .select(`
          *,
          subject:subjects!inner (
            id,
            name,
            code
          ),
          class:classes!inner (
            id,
            name,
            code
          )
        `)
        .eq('student_id', studentId)
        .order('created_at', { ascending: false })

      if (error) throw error

      return data || []
    } catch (err) {
      console.error('Error fetching student results:', err)
      toastError?.('Failed to load student results')
      return []
    }
  }

  const getClassResults = async (classId: string, term?: string, academicYear?: string) => {
    try {
      let query = supabase
        .from('results')
        .select(`
          *,
          student:students!inner (
            id,
            first_name,
            last_name,
            student_number
          ),
          subject:subjects!inner (
            id,
            name,
            code
          )
        `)
        .eq('class_id', classId)
        .order('student_id')

      if (term) {
        query = query.eq('term', term)
      }

      if (academicYear) {
        query = query.eq('academic_year', academicYear)
      }

      const { data, error } = await query

      if (error) throw error

      return data || []
    } catch (err) {
      console.error('Error fetching class results:', err)
      toastError?.('Failed to load class results')
      return []
    }
  }

  const generateResultSummary = async (studentId: string, term: string): Promise<StudentResultSummary | null> => {
    try {
      const [termName, academicYear] = term.split(' ')

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

      const results = await getStudentResults(studentId)
      const termResults = results.filter(
        r => r.term === termName && r.academic_year === academicYear
      )

      const subjects = termResults.map(r => ({
        name: r.subject?.name || 'Unknown',
        score: r.score,
        grade: r.grade,
        remarks: r.remarks,
      }))

      const totalScore = termResults.reduce((sum, r) => sum + r.score, 0)
      const averageScore = termResults.length > 0 ? totalScore / termResults.length : 0
      const gpa = (averageScore / 100) * 4 // Convert to 4.0 scale

      return {
        studentId,
        studentName: `${student.first_name} ${student.last_name}`,
        className,
        term: termName,
        academicYear,
        subjects,
        totalScore,
        averageScore: parseFloat(averageScore.toFixed(2)),
        gpa: parseFloat(gpa.toFixed(2)),
      }
    } catch (err) {
      console.error('Error generating result summary:', err)
      toastError?.('Failed to generate result summary')
      return null
    }
  }

  const createResult = async (result: Omit<Result, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('results')
        .insert([result])
        .select()
        .single()

      if (error) throw error

      setResults(prev => [data, ...prev])
      success?.('Result created successfully')
      return data
    } catch (err) {
      console.error('Error creating result:', err)
      toastError?.('Failed to create result')
      return null
    }
  }

  const updateResult = async (id: string, updates: Partial<Result>) => {
    try {
      const { data, error } = await supabase
        .from('results')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      setResults(prev => prev.map(r => r.id === id ? data : r))
      success?.('Result updated successfully')
      return data
    } catch (err) {
      console.error('Error updating result:', err)
      toastError?.('Failed to update result')
      return null
    }
  }

  const deleteResult = async (id: string) => {
    try {
      const { error } = await supabase
        .from('results')
        .delete()
        .eq('id', id)

      if (error) throw error

      setResults(prev => prev.filter(r => r.id !== id))
      success?.('Result deleted successfully')
      return true
    } catch (err) {
      console.error('Error deleting result:', err)
      toastError?.('Failed to delete result')
      return false
    }
  }

  const submitForApproval = async (id: string) => {
    return updateResult(id, { status: 'submitted' })
  }

  const approveResult = async (id: string, approvedBy: string) => {
    return updateResult(id, { 
      status: 'approved', 
      approved_by: approvedBy 
    })
  }

  const publishResult = async (id: string) => {
    return updateResult(id, { 
      status: 'published',
      published_at: new Date().toISOString()
    })
  }

  useEffect(() => {
    fetchResults()
  }, [])

  return {
    results,
    loading,
    error,
    fetchResults,
    getStudentResults,
    getClassResults,
    generateResultSummary,
    createResult,
    updateResult,
    deleteResult,
    submitForApproval,
    approveResult,
    publishResult,
  }
}