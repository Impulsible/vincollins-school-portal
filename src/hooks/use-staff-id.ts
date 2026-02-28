import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export interface StaffGenerationData {
  format: 'standard' | 'department' | 'simplified'
  count: number
  year?: string
  departmentCode?: string
  startingNumber?: number
}

export type BulkGenerationData = StaffGenerationData

export function useStaffId() {
  const [isLoading, setIsLoading] = useState(false)
  const [generatedIds, setGeneratedIds] = useState<string[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const supabase = createClient()

  // Mock departments data
  const departments = [
    { value: 'SCI', label: 'Science', code: 'SCI' },
    { value: 'ART', label: 'Arts', code: 'ART' },
    { value: 'COM', label: 'Commercial', code: 'COM' },
    { value: 'TEC', label: 'Technical', code: 'TEC' },
    { value: 'ADM', label: 'Administration', code: 'ADM' },
    { value: 'FAC', label: 'Faculty', code: 'FAC' },
  ]

  const getDepartmentOptions = () => {
    return departments
  }

  const generateStaffId = async (data: StaffGenerationData): Promise<string> => {
    setIsLoading(true)
    try {
      // Get the latest sequence number from the database
      const { data: latestStaff, error } = await supabase
        .from('staff')
        .select('staff_id')
        .order('staff_id', { ascending: false })
        .limit(1)

      if (error) throw error

      let sequence = 1
      if (latestStaff && latestStaff.length > 0) {
        const lastId = latestStaff[0].staff_id
        const lastSequence = parseInt(lastId.split('-').pop() || '0', 10)
        sequence = lastSequence + 1
      }

      // Generate ID based on format
      let staffId = ''
      const year = data.year || new Date().getFullYear().toString().slice(-2)

      switch (data.format) {
        case 'standard':
          staffId = `VSP-STF-${year}-${sequence.toString().padStart(4, '0')}`
          break
        case 'department':
          staffId = `VSP-${data.departmentCode || 'GEN'}-${sequence.toString().padStart(4, '0')}`
          break
        case 'simplified':
          staffId = `STF-${sequence.toString().padStart(5, '0')}`
          break
        default:
          staffId = `VSP-STF-${sequence.toString().padStart(4, '0')}`
      }

      return staffId
    } catch (error) {
      console.error('Error generating staff ID:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const generateNewStaffId = async () => {
    return generateStaffId({ format: 'standard', count: 1 })
  }

  const generateStaffCredentials = async (staffId: string) => {
    // Generate a random password
    const password = Math.random().toString(36).slice(-8) + 
                     Math.random().toString(36).toUpperCase().slice(-2) + 
                     '!1'
    
    return {
      staffId,
      password,
      email: `${staffId.toLowerCase()}@vincollins.edu.ng`,
    }
  }

  const generateBulkStaffIds = async (data: BulkGenerationData): Promise<string[]> => {
    setIsGenerating(true)
    try {
      const ids: string[] = []
      const { count, format, year, departmentCode, startingNumber = 1 } = data

      for (let i = 0; i < count; i++) {
        const sequence = startingNumber + i
        let staffId = ''

        switch (format) {
          case 'standard':
            staffId = `VSP-STF-${year || new Date().getFullYear().toString().slice(-2)}-${sequence.toString().padStart(4, '0')}`
            break
          case 'department':
            staffId = `VSP-${departmentCode || 'GEN'}-${sequence.toString().padStart(4, '0')}`
            break
          case 'simplified':
            staffId = `STF-${sequence.toString().padStart(5, '0')}`
            break
          default:
            staffId = `VSP-STF-${sequence.toString().padStart(4, '0')}`
        }

        ids.push(staffId)
      }

      setGeneratedIds(ids)
      return ids
    } catch (error) {
      console.error('Error generating bulk staff IDs:', error)
      throw error
    } finally {
      setIsGenerating(false)
    }
  }

  const validateStaffId = (staffId: string): boolean => {
    // Standard format: VSP-STF-YY-XXXX or VSP-DEPT-XXXX or STF-XXXXX
    const patterns = [
      /^VSP-STF-\d{2}-\d{4}$/, // VSP-STF-24-0001
      /^VSP-[A-Z]{3}-\d{4}$/,   // VSP-GEN-0001
      /^STF-\d{5}$/,            // STF-00001
    ]
    return patterns.some(pattern => pattern.test(staffId))
  }

  const parseStaffId = (staffId: string) => {
    if (!validateStaffId(staffId)) {
      return null
    }

    if (staffId.startsWith('VSP-STF')) {
      const [, , year, sequence] = staffId.split('-')
      return {
        format: 'standard',
        year,
        sequence,
        department: null,
      }
    } else if (staffId.startsWith('VSP-') && !staffId.includes('STF')) {
      const [, department, sequence] = staffId.split('-')
      return {
        format: 'department',
        year: null,
        department,
        sequence,
      }
    } else if (staffId.startsWith('STF-')) {
      const [, sequence] = staffId.split('-')
      return {
        format: 'simplified',
        year: null,
        department: null,
        sequence,
      }
    }

    return null
  }

  return {
    generateStaffId,
    generateNewStaffId,
    generateBulkStaffIds,
    generateStaffCredentials,
    validateStaffId,
    parseStaffId,
    getDepartmentOptions,
    departments,
    generatedIds,
    isLoading,
    isGenerating,
  }
}