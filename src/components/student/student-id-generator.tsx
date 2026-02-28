'use client'

import { useState } from 'react'
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
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useToast } from '@/hooks/use-toast'
import { useStudentId } from '@/hooks/use-student-id'
import { Copy, Download, RefreshCw } from 'lucide-react'

const singleGenerationSchema = z.object({
  section: z.enum(['creche', 'nursery', 'primary', 'college']),
  format: z.enum(['standard', 'section', 'year-only', 'legacy']).default('standard'),
  year: z.string().optional(),
  customId: z.string().optional(),
})

const bulkGenerationSchema = z.object({
  section: z.enum(['creche', 'nursery', 'primary', 'college']),
  count: z.number().min(1).max(100),
  format: z.enum(['standard', 'section', 'year-only', 'legacy']).default('standard'),
  year: z.string().optional(),
  startingNumber: z.number().min(1).default(1),
})

type SingleGenerationData = z.infer<typeof singleGenerationSchema>
type BulkGenerationData = z.infer<typeof bulkGenerationSchema>

export function StudentIdGenerator() {
  const [generatedIds, setGeneratedIds] = useState<string[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const { success, error } = useToast()
  const { 
    generateStudentId, 
    generateBulkStudentIds,
    isLoading 
  } = useStudentId()

  const singleForm = useForm<SingleGenerationData>({
    resolver: zodResolver(singleGenerationSchema),
    defaultValues: {
      section: 'primary',
      format: 'standard',
      year: new Date().getFullYear().toString().slice(-2),
    },
  })

  const bulkForm = useForm<BulkGenerationData>({
    resolver: zodResolver(bulkGenerationSchema),
    defaultValues: {
      section: 'primary',
      count: 10,
      format: 'standard',
      year: new Date().getFullYear().toString().slice(-2),
      startingNumber: 1,
    },
  })

  const onGenerateSingle = async (data: SingleGenerationData) => {
    setIsGenerating(true)
    try {
      const id = await generateStudentId({
        section: data.section,
        year: data.year,
        sequence: 1,
      })
      setGeneratedIds([id])
      success?.('Student ID generated successfully')
    } catch (err) {
      error?.('Failed to generate student ID')
    } finally {
      setIsGenerating(false)
    }
  }

  const onGenerateBulk = async (data: BulkGenerationData) => {
    setIsGenerating(true)
    try {
      const ids = await generateBulkStudentIds({
        section: data.section,
        count: data.count,
        year: data.year,
        startingNumber: data.startingNumber,
      })
      setGeneratedIds(ids)
      success?.(`${ids.length} student IDs generated successfully`)
    } catch (err) {
      error?.('Failed to generate student IDs')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleCopy = async (id: string) => {
    try {
      await navigator.clipboard.writeText(id)
      success?.('Copied to clipboard')
    } catch {
      error?.('Failed to copy')
    }
  }

  const handleCopyAll = async () => {
    try {
      await navigator.clipboard.writeText(generatedIds.join('\n'))
      success?.('All IDs copied to clipboard')
    } catch {
      error?.('Failed to copy')
    }
  }

  const handleDownload = () => {
    const blob = new Blob([generatedIds.join('\n')], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `student-ids-${new Date().toISOString().split('T')[0]}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Student ID Generator</CardTitle>
        <CardDescription>
          Generate unique student IDs for new enrollments
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="single" className="space-y-4">
          <TabsList>
            <TabsTrigger value="single">Single</TabsTrigger>
            <TabsTrigger value="bulk">Bulk</TabsTrigger>
          </TabsList>

          <TabsContent value="single">
            <Form {...singleForm}>
              <form onSubmit={singleForm.handleSubmit(onGenerateSingle)} className="space-y-4">
                <FormField
                  control={singleForm.control}
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
                          <SelectItem value="creche">Creche/Playgroup</SelectItem>
                          <SelectItem value="nursery">Nursery</SelectItem>
                          <SelectItem value="primary">Primary</SelectItem>
                          <SelectItem value="college">College</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={singleForm.control}
                  name="year"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Year (2 digits)</FormLabel>
                      <FormControl>
                        <Input placeholder="24" {...field} />
                      </FormControl>
                      <FormDescription>
                        Last two digits of admission year
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" disabled={isGenerating || isLoading}>
                  {isGenerating && <RefreshCw className="mr-2 h-4 w-4 animate-spin" />}
                  Generate ID
                </Button>
              </form>
            </Form>
          </TabsContent>

          <TabsContent value="bulk">
            <Form {...bulkForm}>
              <form onSubmit={bulkForm.handleSubmit(onGenerateBulk)} className="space-y-4">
                <FormField
                  control={bulkForm.control}
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
                          <SelectItem value="creche">Creche/Playgroup</SelectItem>
                          <SelectItem value="nursery">Nursery</SelectItem>
                          <SelectItem value="primary">Primary</SelectItem>
                          <SelectItem value="college">College</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={bulkForm.control}
                  name="count"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Number of IDs</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          {...field}
                          onChange={e => field.onChange(parseInt(e.target.value))}
                        />
                      </FormControl>
                      <FormDescription>
                        Maximum 100 IDs at a time
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={bulkForm.control}
                  name="year"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Year (2 digits)</FormLabel>
                      <FormControl>
                        <Input placeholder="24" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={bulkForm.control}
                  name="startingNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Starting Number</FormLabel>
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

                <Button type="submit" disabled={isGenerating || isLoading}>
                  {isGenerating && <RefreshCw className="mr-2 h-4 w-4 animate-spin" />}
                  Generate {bulkForm.watch('count')} IDs
                </Button>
              </form>
            </Form>
          </TabsContent>
        </Tabs>

        {generatedIds.length > 0 && (
          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Generated IDs ({generatedIds.length})</h3>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleCopyAll}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy All
                </Button>
                <Button variant="outline" size="sm" onClick={handleDownload}>
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
            <div className="bg-muted rounded-lg p-4 max-h-60 overflow-y-auto">
              {generatedIds.map((id, index) => (
                <div key={index} className="flex items-center justify-between py-1 border-b last:border-0">
                  <code className="text-sm font-mono">{id}</code>
                  <Button variant="ghost" size="sm" onClick={() => handleCopy(id)}>
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}