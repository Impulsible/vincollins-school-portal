'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { StudentIdGenerator } from '@/components/student/student-id-generator'
import { useStudentId } from '@/hooks/use-student-id'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/hooks/use-toast'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ArrowLeft, Loader2, RefreshCw } from 'lucide-react'
import Link from 'next/link'

const studentSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  studentNumber: z.string().min(1, 'Student number is required'),
  section: z.enum(['creche', 'nursery', 'primary', 'college']),
  classId: z.string().min(1, 'Class is required'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  gender: z.enum(['male', 'female', 'other']),
  address: z.string().optional(),
  guardianName: z.string().min(2, 'Guardian name is required'),
  guardianPhone: z.string().min(10, 'Guardian phone is required'),
  guardianEmail: z.string().email('Invalid email address').optional().or(z.literal('')),
  enrollmentDate: z.string().min(1, 'Enrollment date is required'),
})

type StudentFormData = z.infer<typeof studentSchema>

export default function CreateStudentPage() {
  const router = useRouter()
  const { success, error } = useToast()
  const { 
    generateNewStudentId, 
    generateStudentCredentials,
    getClassOptions,
    getClassesBySection,
    getSectionOptions,
    isLoading: studentIdLoading 
  } = useStudentId()
  const [isLoading, setIsLoading] = useState(false)
  const [generatedCredentials, setGeneratedCredentials] = useState<{
    email: string
    studentId: string
    tempPassword: string
  } | null>(null)

  const form = useForm<StudentFormData>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      gender: 'male',
      section: 'primary',
      enrollmentDate: new Date().toISOString().split('T')[0],
    },
  })

  const selectedSection = form.watch('section')
  const classOptions = selectedSection ? getClassesBySection(selectedSection) : []
  const sectionOptions = getSectionOptions ? getSectionOptions() : []

  const refreshStudentId = async () => {
    const section = form.getValues('section')
    if (!section) {
      error?.('Please select a section first')
      return
    }
    
    const newId = await generateNewStudentId(section)
    if (newId) {
      form.setValue('studentNumber', newId)
      success?.('New student ID generated')
    }
  }

  const onSubmit = async (data: StudentFormData) => {
    setIsLoading(true)
    try {
      const supabase = createClient()

      // Check if student number already exists
      const { data: existingStudent } = await supabase
        .from('students')
        .select('student_number')
        .eq('student_number', data.studentNumber)
        .maybeSingle()

      if (existingStudent) {
        error?.('Student number already exists')
        setIsLoading(false)
        return
      }

      // Generate credentials
      const credentials = await generateStudentCredentials(data.studentNumber)

      // Create auth user if email is provided
      let authData = null
      if (data.email) {
        const { data: authResult, error: authError } = await supabase.auth.admin.createUser({
          email: data.email,
          password: credentials.password,
          email_confirm: true,
          user_metadata: {
            first_name: data.firstName,
            last_name: data.lastName,
            role: 'student',
          },
        })

        if (authError) throw authError
        authData = authResult
      }

      // Create user record
      if (authData) {
        const { error: userError } = await supabase
          .from('users')
          .insert({
            id: authData.user.id,
            email: data.email,
            first_name: data.firstName,
            last_name: data.lastName,
            role: 'student',
            phone: data.phone,
            is_active: true,
          })

        if (userError) throw userError
      }

      // Create student record
      const { error: studentError } = await supabase
        .from('students')
        .insert({
          user_id: authData?.user.id || null,
          student_number: data.studentNumber,
          first_name: data.firstName,
          last_name: data.lastName,
          class_id: data.classId,
          date_of_birth: data.dateOfBirth,
          gender: data.gender,
          address: data.address,
          guardian_name: data.guardianName,
          guardian_phone: data.guardianPhone,
          guardian_email: data.guardianEmail,
          enrollment_date: data.enrollmentDate,
        })

      if (studentError) throw studentError

      setGeneratedCredentials({
        email: data.email || credentials.email,
        studentId: data.studentNumber,
        tempPassword: credentials.password,
      })
      
      success?.('Student account created successfully')

      // Reset form after 3 seconds
      setTimeout(() => {
        router.push('/admin/users/students')
      }, 3000)

    } catch (err) {
      error?.(err instanceof Error ? err.message : 'Failed to create student')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container max-w-4xl py-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/users/students">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-2xl font-serif font-bold">Create New Student</h1>
      </div>

      <Tabs defaultValue="create" className="space-y-4">
        <TabsList>
          <TabsTrigger value="create">Create Student</TabsTrigger>
          <TabsTrigger value="generate">Generate Student ID</TabsTrigger>
        </TabsList>

        <TabsContent value="create">
          <Card>
            <CardHeader>
              <CardTitle>Student Information</CardTitle>
              <CardDescription>
                Enter the student details to create their account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address (Optional)</FormLabel>
                          <FormControl>
                            <Input 
                              type="email" 
                              placeholder="john.doe@example.com" 
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            If provided, student will have portal access
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input placeholder="+234 XXX XXX XXXX" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="studentNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Student Number</FormLabel>
                          <div className="flex gap-2">
                            <FormControl>
                              <Input 
                                placeholder="VSP-24-PR-0001" 
                                {...field} 
                                className="font-mono"
                              />
                            </FormControl>
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              onClick={refreshStudentId}
                              disabled={studentIdLoading}
                              title="Generate new student ID"
                            >
                              <RefreshCw className={`h-4 w-4 ${studentIdLoading ? 'animate-spin' : ''}`} />
                            </Button>
                          </div>
                          <FormDescription>
                            Unique student identification number
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="section"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Section</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select section" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {sectionOptions.map((section: any) => (
                                <SelectItem key={section.value} value={section.value}>
                                  {section.label}
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
                      name="classId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Class</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                            disabled={!selectedSection}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select class" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {classOptions.map((cls: any) => (
                                <SelectItem key={cls.value} value={cls.value}>
                                  {cls.label}
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
                      name="dateOfBirth"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date of Birth</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="gender"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Gender</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select gender" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="male">Male</SelectItem>
                              <SelectItem value="female">Female</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="guardianName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Guardian Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Parent/Guardian full name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="guardianPhone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Guardian Phone</FormLabel>
                          <FormControl>
                            <Input placeholder="+234 XXX XXX XXXX" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="guardianEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Guardian Email (Optional)</FormLabel>
                          <FormControl>
                            <Input 
                              type="email" 
                              placeholder="parent@example.com" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="enrollmentDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Enrollment Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel>Address</FormLabel>
                          <FormControl>
                            <Input placeholder="Residential address" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Create Student Account
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="generate">
          <StudentIdGenerator />
        </TabsContent>
      </Tabs>

      {/* Generated Credentials Display */}
      {generatedCredentials && (
        <Card className="border-success">
          <CardHeader>
            <CardTitle className="text-success">Student Account Created Successfully!</CardTitle>
            <CardDescription>
              Please save these credentials. They will not be shown again.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
              <div>
                <p className="text-sm font-medium">Student ID</p>
                <p className="font-mono">{generatedCredentials.studentId}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Email</p>
                <p className="font-mono">{generatedCredentials.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Temporary Password</p>
                <p className="font-mono">{generatedCredentials.tempPassword}</p>
              </div>
            </div>
            <Alert>
              <AlertDescription>
                The student will be required to change their password on first login.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}
    </div>
  )
}