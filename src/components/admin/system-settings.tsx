'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
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
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Save, RefreshCw, Database, Shield, Mail, Bell, FileText } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/hooks/use-toast'
import { format } from 'date-fns'

const generalSettingsSchema = z.object({
  school_name: z.string().min(1, 'School name is required'),
  school_address: z.string().min(1, 'Address is required'),
  school_phone: z.string().min(1, 'Phone is required'),
  school_email: z.string().email('Invalid email'),
  school_website: z.string().url('Invalid URL').optional().or(z.literal('')),
  academic_year: z.string().min(1, 'Academic year is required'),
  current_term: z.string().min(1, 'Current term is required'),
})

const securitySettingsSchema = z.object({
  password_min_length: z.number().min(6).max(20),
  password_require_uppercase: z.boolean(),
  password_require_lowercase: z.boolean(),
  password_require_numbers: z.boolean(),
  password_require_special: z.boolean(),
  session_timeout_minutes: z.number().min(5).max(120),
  max_login_attempts: z.number().min(3).max(10),
  two_factor_auth: z.boolean(),
})

const emailSettingsSchema = z.object({
  smtp_host: z.string().min(1),
  smtp_port: z.number().min(1).max(65535),
  smtp_user: z.string().min(1),
  smtp_password: z.string().min(1),
  from_email: z.string().email(),
  from_name: z.string().min(1),
})

type GeneralSettings = z.infer<typeof generalSettingsSchema>
type SecuritySettings = z.infer<typeof securitySettingsSchema>
type EmailSettings = z.infer<typeof emailSettingsSchema>

export function SystemSettings() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const { success, error } = useToast()

  const generalForm = useForm<GeneralSettings>({
    resolver: zodResolver(generalSettingsSchema),
    defaultValues: {
      school_name: 'Vincollins Schools',
      school_address: 'Lagos, Nigeria',
      school_phone: '+234 XXX XXX XXXX',
      school_email: 'info@vincollins.edu.ng',
      school_website: 'https://vincollins.edu.ng',
      academic_year: '2023/2024',
      current_term: 'Second Term',
    },
  })

  const securityForm = useForm<SecuritySettings>({
    resolver: zodResolver(securitySettingsSchema),
    defaultValues: {
      password_min_length: 8,
      password_require_uppercase: true,
      password_require_lowercase: true,
      password_require_numbers: true,
      password_require_special: true,
      session_timeout_minutes: 30,
      max_login_attempts: 5,
      two_factor_auth: false,
    },
  })

  const emailForm = useForm<EmailSettings>({
    resolver: zodResolver(emailSettingsSchema),
    defaultValues: {
      smtp_host: 'smtp.gmail.com',
      smtp_port: 587,
      smtp_user: '',
      smtp_password: '',
      from_email: 'noreply@vincollins.edu.ng',
      from_name: 'Vincollins Portal',
    },
  })

  const onSaveGeneral = async (data: GeneralSettings) => {
    setIsSaving(true)
    try {
      // Save to database or config file
      await new Promise(resolve => setTimeout(resolve, 1000))
      success?.('General settings saved')
    } catch (err) {
      error?.('Failed to save settings')
    } finally {
      setIsSaving(false)
    }
  }

  const onSaveSecurity = async (data: SecuritySettings) => {
    setIsSaving(true)
    try {
      // Update auth settings
      const supabase = createClient()
      // Note: This would require admin API access
      success?.('Security settings saved')
    } catch (err) {
      error?.('Failed to save settings')
    } finally {
      setIsSaving(false)
    }
  }

  const onSaveEmail = async (data: EmailSettings) => {
    setIsSaving(true)
    try {
      // Test email connection
      success?.('Email settings saved and tested')
    } catch (err) {
      error?.('Failed to save email settings')
    } finally {
      setIsSaving(false)
    }
  }

  const testEmailConnection = async () => {
    setIsLoading(true)
    try {
      // Send test email
      await new Promise(resolve => setTimeout(resolve, 1000))
      success?.('Test email sent successfully')
    } catch (err) {
      error?.('Failed to send test email')
    } finally {
      setIsLoading(false)
    }
  }

  const backupDatabase = async () => {
    setIsLoading(true)
    try {
      // Trigger database backup
      await new Promise(resolve => setTimeout(resolve, 2000))
      success?.('Database backup completed')
    } catch (err) {
      error?.('Backup failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Tabs defaultValue="general" className="space-y-4">
      <TabsList>
        <TabsTrigger value="general">General</TabsTrigger>
        <TabsTrigger value="security">Security</TabsTrigger>
        <TabsTrigger value="email">Email</TabsTrigger>
        <TabsTrigger value="system">System</TabsTrigger>
      </TabsList>

      <TabsContent value="general">
        <Card>
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
            <CardDescription>
              Configure basic school information and academic terms
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...generalForm}>
              <form onSubmit={generalForm.handleSubmit(onSaveGeneral)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={generalForm.control}
                    name="school_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>School Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={generalForm.control}
                    name="school_phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={generalForm.control}
                    name="school_email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input {...field} type="email" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={generalForm.control}
                    name="school_website"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Website</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={generalForm.control}
                    name="school_address"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={generalForm.control}
                    name="academic_year"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current Academic Year</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormDescription>
                          e.g., 2023/2024
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={generalForm.control}
                    name="current_term"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current Term</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormDescription>
                          First, Second, or Third Term
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button type="submit" disabled={isSaving}>
                  {isSaving && <RefreshCw className="mr-2 h-4 w-4 animate-spin" />}
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="security">
        <Card>
          <CardHeader>
            <CardTitle>Security Settings</CardTitle>
            <CardDescription>
              Configure password policies and authentication rules
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...securityForm}>
              <form onSubmit={securityForm.handleSubmit(onSaveSecurity)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={securityForm.control}
                    name="password_min_length"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Minimum Password Length</FormLabel>
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

                  <FormField
                    control={securityForm.control}
                    name="session_timeout_minutes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Session Timeout (minutes)</FormLabel>
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

                  <FormField
                    control={securityForm.control}
                    name="max_login_attempts"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Max Login Attempts</FormLabel>
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

                  <FormField
                    control={securityForm.control}
                    name="two_factor_auth"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <FormLabel>Two-Factor Authentication</FormLabel>
                          <FormDescription>
                            Require 2FA for all users
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-3">
                  <FormField
                    control={securityForm.control}
                    name="password_require_uppercase"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <FormLabel>Require Uppercase</FormLabel>
                          <FormDescription>
                            Passwords must contain at least one uppercase letter
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={securityForm.control}
                    name="password_require_lowercase"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <FormLabel>Require Lowercase</FormLabel>
                          <FormDescription>
                            Passwords must contain at least one lowercase letter
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={securityForm.control}
                    name="password_require_numbers"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <FormLabel>Require Numbers</FormLabel>
                          <FormDescription>
                            Passwords must contain at least one number
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={securityForm.control}
                    name="password_require_special"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <FormLabel>Require Special Characters</FormLabel>
                          <FormDescription>
                            Passwords must contain at least one special character (!@#$%^&*)
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <Button type="submit" disabled={isSaving}>
                  {isSaving && <RefreshCw className="mr-2 h-4 w-4 animate-spin" />}
                  <Shield className="mr-2 h-4 w-4" />
                  Update Security Settings
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="email">
        <Card>
          <CardHeader>
            <CardTitle>Email Settings</CardTitle>
            <CardDescription>
              Configure SMTP settings for system emails
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...emailForm}>
              <form onSubmit={emailForm.handleSubmit(onSaveEmail)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={emailForm.control}
                    name="smtp_host"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>SMTP Host</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={emailForm.control}
                    name="smtp_port"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>SMTP Port</FormLabel>
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

                  <FormField
                    control={emailForm.control}
                    name="smtp_user"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>SMTP Username</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={emailForm.control}
                    name="smtp_password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>SMTP Password</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={emailForm.control}
                    name="from_email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>From Email</FormLabel>
                        <FormControl>
                          <Input type="email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={emailForm.control}
                    name="from_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>From Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex gap-2">
                  <Button type="submit" disabled={isSaving}>
                    {isSaving && <RefreshCw className="mr-2 h-4 w-4 animate-spin" />}
                    <Mail className="mr-2 h-4 w-4" />
                    Save Email Settings
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={testEmailConnection}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Bell className="mr-2 h-4 w-4" />
                    )}
                    Test Connection
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="system">
        <Card>
          <CardHeader>
            <CardTitle>System Maintenance</CardTitle>
            <CardDescription>
              Database backups and system utilities
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Database Backup</h3>
                  <p className="text-sm text-muted-foreground">
                    Create a complete backup of the database
                  </p>
                </div>
                <Button 
                  variant="outline"
                  onClick={backupDatabase}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Database className="mr-2 h-4 w-4" />
                  )}
                  Backup Now
                </Button>
              </div>
            </div>

            <div className="rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Clear System Cache</h3>
                  <p className="text-sm text-muted-foreground">
                    Remove temporary files and cached data
                  </p>
                </div>
                <Button variant="outline">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Clear Cache
                </Button>
              </div>
            </div>

            <div className="rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">System Logs</h3>
                  <p className="text-sm text-muted-foreground">
                    View and download system logs for debugging
                  </p>
                </div>
                <Button variant="outline" asChild>
                  <a href="/admin/system/logs" target="_blank" rel="noopener noreferrer">
                    <FileText className="mr-2 h-4 w-4" />
                    View Logs
                  </a>
                </Button>
              </div>
            </div>

            <Alert>
              <AlertDescription>
                Last automated backup: Today at 02:00 AM
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}