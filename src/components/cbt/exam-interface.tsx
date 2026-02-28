// src/components/cbt/exam-interface.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Clock, ArrowLeft, ArrowRight, Flag } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { useToast } from '@/hooks/use-toast'

interface ExamInterfaceProps {
  examId: string
}

interface Question {
  id: string
  question_text: string
  question_type: 'objective' | 'theory'
  options?: string[]
  correct_answer?: string
  marks: number
}

interface Exam {
  id: string
  title: string
  description: string
  duration_minutes: number
  total_marks: number
  passing_score: number
  questions: Question[]
}

export function ExamInterface({ examId }: ExamInterfaceProps) {
  const router = useRouter()
  const { user, isLoading: authLoading } = useAuth()
  const { success, error } = useToast()
  
  const [exam, setExam] = useState<Exam | null>(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [timeLeft, setTimeLeft] = useState<number>(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Fetch exam data
    const fetchExam = async () => {
      setIsLoading(true)
      try {
        // Mock exam data - replace with actual API call
        const mockExam: Exam = {
          id: examId,
          title: 'Mathematics Mid-Term Examination',
          description: 'Answer all questions. Duration: 1 hour',
          duration_minutes: 60,
          total_marks: 100,
          passing_score: 50,
          questions: [
            {
              id: 'q1',
              question_text: 'What is the value of π (pi) approximately?',
              question_type: 'objective',
              options: ['3.14', '3.41', '3.04', '3.41'],
              correct_answer: '3.14',
              marks: 5,
            },
            {
              id: 'q2',
              question_text: 'Solve for x: 2x + 5 = 15',
              question_type: 'objective',
              options: ['x = 5', 'x = 10', 'x = 7.5', 'x = 5.5'],
              correct_answer: 'x = 5',
              marks: 5,
            },
            {
              id: 'q3',
              question_text: 'Explain the Pythagorean theorem and provide an example.',
              question_type: 'theory',
              marks: 10,
            },
          ],
        }
        
        setExam(mockExam)
        setTimeLeft(mockExam.duration_minutes * 60) // Convert to seconds
      } catch (err) {
        console.error('Error fetching exam:', err)
        error?.('Failed to load exam')
      } finally {
        setIsLoading(false)
      }
    }

    fetchExam()
  }, [examId, error])

  // Timer effect
  useEffect(() => {
    if (!timeLeft || isSubmitting) return

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          handleAutoSubmit()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft, isSubmitting])

  const handleAutoSubmit = async () => {
    await handleSubmitExam()
  }

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer,
    }))
  }

  const handleNext = () => {
    if (exam && currentQuestionIndex < exam.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1)
    }
  }

  const handleSubmitExam = async () => {
    setIsSubmitting(true)
    try {
      // Calculate score for objective questions
      let score = 0
      let totalPossible = 0

      exam?.questions.forEach(question => {
        totalPossible += question.marks
        if (question.question_type === 'objective') {
          const userAnswer = answers[question.id]
          if (userAnswer === question.correct_answer) {
            score += question.marks
          }
        }
      })

      // Submit to API
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      success?.('Exam submitted successfully')
      router.push(`/cbt/results/${examId}`)
    } catch (err) {
      console.error('Error submitting exam:', err)
      error?.('Failed to submit exam')
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`
  }

  if (authLoading || isLoading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    )
  }

  if (!user) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Please log in to access the exam.
        </AlertDescription>
      </Alert>
    )
  }

  if (!exam) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Exam not found.
        </AlertDescription>
      </Alert>
    )
  }

  const currentQuestion = exam.questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / exam.questions.length) * 100

  return (
    <div className="container max-w-4xl py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-serif font-bold">{exam.title}</h1>
          <p className="text-sm text-muted-foreground">{exam.description}</p>
        </div>
        <div className="flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-lg">
          <Clock className="h-4 w-4 text-primary" />
          <span className={`font-mono font-bold ${timeLeft < 300 ? 'text-destructive' : ''}`}>
            {formatTime(timeLeft)}
          </span>
        </div>
      </div>

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Question {currentQuestionIndex + 1} of {exam.questions.length}</span>
          <span>{Math.round(progress)}% Complete</span>
        </div>
        <Progress value={progress} />
      </div>

      {/* Question Card */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-lg">
                Question {currentQuestionIndex + 1}
              </CardTitle>
              <CardDescription>
                {currentQuestion.question_type === 'objective' ? 'Choose the correct answer' : 'Provide a detailed explanation'}
                {' • '}{currentQuestion.marks} marks
              </CardDescription>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {}} // Flag for review
            >
              <Flag className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-lg font-medium">
            {currentQuestion.question_text}
          </div>

          {currentQuestion.question_type === 'objective' ? (
            <RadioGroup
              value={answers[currentQuestion.id] || ''}
              onValueChange={(value) => handleAnswerChange(currentQuestion.id, value)}
              className="space-y-3"
            >
              {currentQuestion.options?.map((option, index) => (
                <div key={index} className="flex items-center space-x-2 rounded-lg border p-3 hover:bg-muted/50">
                  <RadioGroupItem value={option} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          ) : (
            <Textarea
              placeholder="Type your answer here..."
              value={answers[currentQuestion.id] || ''}
              onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
              rows={8}
            />
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>
          {currentQuestionIndex === exam.questions.length - 1 ? (
            <Button 
              onClick={handleSubmitExam}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Exam'}
            </Button>
          ) : (
            <Button onClick={handleNext}>
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </CardFooter>
      </Card>

      {/* Question Navigation */}
      <div className="grid grid-cols-8 gap-2">
        {exam.questions.map((_, index) => (
          <Button
            key={index}
            variant={index === currentQuestionIndex ? 'default' : answers[exam.questions[index].id] ? 'secondary' : 'outline'}
            className="w-full"
            onClick={() => setCurrentQuestionIndex(index)}
          >
            {index + 1}
          </Button>
        ))}
      </div>
    </div>
  )
}