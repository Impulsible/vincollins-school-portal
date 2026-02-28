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
import { StaffIdGenerator } from '@/components/staff/staff-id-generator'
import { useStaffId } from '@/hooks/use-staff-id'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/hooks/use-toast'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ArrowLeft, Loader2, RefreshCw } from 'lucide-react'
import Link from 'next/link'

const staffSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  staffNumber: z.string().min(1, 'Staff number is required'),
  department: z.string().min(1, 'Department is required'),
  designation: z.string().min(1, 'Designation is required'),
  qualification: z.string().optional(),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  gender: z.enum(['male', 'female', 'other']),
  address: z.string().optional(),
  emergencyContact: z.string().optional(),
  employmentDate: z.string().min(1, 'Employment date is required'),
})

type StaffFormData = z.infer<typeof staffSchema>

export default function CreateStaffPage() {
  const router = useRouter()
  const { success, error } = useToast()
  const { 
    generateStaffCredentials, 
    getDepartmentOptions, 
    departments,
    generateNewStaffId,
    isLoading: staffIdLoading 
  } = useStaffId()
  const [isLoading, setIsLoading] = useState(false)
  const [generatedCredentials, setGeneratedCredentials] = useState<{
    email: string
    badgeNumber: string
    tempPassword: string
    staffId: string
  } | null>(null)

  const form = useForm<StaffFormData>({
    resolver: zodResolver(staffSchema),
    defaultValues: {
      gender: 'male',
      employmentDate: new Date().toISOString().split('T')[0],
    },
  })

  const onSubmit = async (data: StaffFormData) => {
    setIsLoading(true)
    try {
      const supabase = createClient()

      // Check if staff number already exists
      const { data: existingStaff } = await supabase
        .from('staff')
        .select('staff_number')
        .eq('staff_number', data.staffNumber)
        .maybeSingle()

      if (existingStaff) {
        error?.('Staff number already exists')
        setIsLoading(false)
        return
      }

      // Generate credentials - FIXED: Pass only the staffId
      const credentials = await generateStaffCredentials(data.staffNumber)

      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: credentials.email,
        password: credentials.password, // FIXED: Use credentials.password instead of tempPassword
        email_confirm: true,
        user_metadata: {
          first_name: data.firstName,
          last_name: data.lastName,
          role: 'staff',
        },
      })

      if (authError) throw authError

      // Create user record
      const { error: userError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          email: credentials.email,
          first_name: data.firstName,
          last_name: data.lastName,
          role: 'staff',
          phone: data.phone,
          is_active: true,
        })

      if (userError) throw userError

      // Create staff record
      const { error: staffError } = await supabase
        .from('staff')
        .insert({
          user_id: authData.user.id,
          staff_number: data.staffNumber,
          department: data.department,
          designation: data.designation,
          qualification: data.qualification,
          date_of_birth: data.dateOfBirth,
          gender: data.gender,
          address: data.address,
          emergency_contact: data.emergencyContact,
          employment_date: data.employmentDate,
        })

      if (staffError) throw staffError

      setGeneratedCredentials({
        email: credentials.email,
        badgeNumber: data.staffNumber,
        tempPassword: credentials.password,
        staffId: data.staffNumber,
      })
      
      success?.('Staff account created successfully')

      // Reset form after 3 seconds
      setTimeout(() => {
        router.push('/admin/users/staff')
      }, 3000)

    } catch (err) {
      error?.(err instanceof Error ? err.message : 'Failed to create staff')
    } finally {
      setIsLoading(false)
    }
  }

  const refreshStaffId = async () => {
    const department = form.getValues('department')
    if (!department) {
      error?.('Please select a department first')
      return
    }
    
    const newId = await generateNewStaffId()
    if (newId) {
      form.setValue('staffNumber', newId)
      success?.('New staff ID generated')
    }
  }

  const departmentOptions = getDepartmentOptions ? getDepartmentOptions() : departments || []

  return (
    <div className="container max-w-4xl py-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/users/staff">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-2xl font-serif font-bold">Create New Staff</h1>
      </div>

      <Tabs defaultValue="create" className="space-y-4">
        <TabsList>
          <TabsTrigger value="create">Create Staff</TabsTrigger>
          <TabsTrigger value="generate">Generate Staff ID</TabsTrigger>
        </TabsList>

        <TabsContent value="create">
          <Card>
            <CardHeader>
              <CardTitle>Staff Information</CardTitle>
              <CardDescription>
                Enter the staff details to create their account
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
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input 
                              type="email" 
                              placeholder="john.doe@example.com" 
                              {...field} 
                            />
                          </FormControl>
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
                      name="staffNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Staff Number</FormLabel>
                          <div className="flex gap-2">
                            <FormControl>
                              <Input 
                                placeholder="VSP-STF-2024-0001" 
                                {...field} 
                                className="font-mono"
                              />
                            </FormControl>
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              onClick={refreshStaffId}
                              disabled={staffIdLoading}
                              title="Generate new staff ID"
                            >
                              <RefreshCw className={`h-4 w-4 ${staffIdLoading ? 'animate-spin' : ''}`} />
                            </Button>
                          </div>
                          <FormDescription>
                            Unique staff identification number
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="department"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Department</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select department" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {departmentOptions.map((dept: any) => (
                                <SelectItem key={dept.value || dept.code} value={dept.value || dept.code}>
                                  {dept.label || dept.name} ({dept.value || dept.code})
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
                      name="designation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Designation</FormLabel>
                          <FormControl>
                            <Input placeholder="Senior Teacher" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="qualification"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Qualification</FormLabel>
                          <FormControl>
                            <Input placeholder="B.Ed, M.Ed, etc." {...field} />
                          </FormControl>
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
                      name="employmentDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Employment Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="emergencyContact"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Emergency Contact</FormLabel>
                          <FormControl>
                            <Input placeholder="+234 XXX XXX XXXX" {...field} />
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
                    Create Staff Account
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="generate">
          <StaffIdGenerator />
        </TabsContent>
      </Tabs>

      {/* Generated Credentials Display */}
      {generatedCredentials && (
        <Card className="border-success">
          <CardHeader>
            <CardTitle className="text-success">Staff Account Created Successfully!</CardTitle>
            <CardDescription>
              Please save these credentials. They will not be shown again.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
              <div>
                <p className="text-sm font-medium">Staff ID</p>
                <p className="font-mono">{generatedCredentials.staffId}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Badge Number</p>
                <p className="font-mono">{generatedCredentials.badgeNumber}</p>
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
                The staff will be required to change their password on first login.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}
    </div>
  )
}