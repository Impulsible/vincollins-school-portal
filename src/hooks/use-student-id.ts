import { useState } from 'react'

export interface StudentGenerationData {
  section: 'creche' | 'nursery' | 'primary' | 'college'
  year?: string
  sequence?: number
}

export interface BulkStudentGenerationData extends StudentGenerationData {
  count: number
  startingNumber?: number
}

export interface ParsedStudentId {
  year: string
  section: string
  sectionCode: string
  sequence: string
  className?: string
  sectionName?: string
}

// Section definitions
const sections = [
  { value: 'creche', label: 'Creche/Playgroup', code: 'CR' },
  { value: 'nursery', label: 'Nursery', code: 'NS' },
  { value: 'primary', label: 'Primary', code: 'PR' },
  { value: 'college', label: 'College', code: 'CL' },
]

// Class options by section
const classOptionsBySection = {
  creche: [
    { value: 'creche-1', label: 'Creche 1', section: 'creche', sectionCode: 'CR' },
    { value: 'creche-2', label: 'Creche 2', section: 'creche', sectionCode: 'CR' },
  ],
  nursery: [
    { value: 'nursery-1', label: 'Nursery 1', section: 'nursery', sectionCode: 'NS' },
    { value: 'nursery-2', label: 'Nursery 2', section: 'nursery', sectionCode: 'NS' },
  ],
  primary: [
    { value: 'primary-1', label: 'Primary 1', section: 'primary', sectionCode: 'PR' },
    { value: 'primary-2', label: 'Primary 2', section: 'primary', sectionCode: 'PR' },
    { value: 'primary-3', label: 'Primary 3', section: 'primary', sectionCode: 'PR' },
    { value: 'primary-4', label: 'Primary 4', section: 'primary', sectionCode: 'PR' },
    { value: 'primary-5', label: 'Primary 5', section: 'primary', sectionCode: 'PR' },
    { value: 'primary-6', label: 'Primary 6', section: 'primary', sectionCode: 'PR' },
  ],
  college: [
    { value: 'jss-1', label: 'JSS 1', section: 'college', sectionCode: 'CL' },
    { value: 'jss-2', label: 'JSS 2', section: 'college', sectionCode: 'CL' },
    { value: 'jss-3', label: 'JSS 3', section: 'college', sectionCode: 'CL' },
    { value: 'sss-1', label: 'SSS 1', section: 'college', sectionCode: 'CL' },
    { value: 'sss-2', label: 'SSS 2', section: 'college', sectionCode: 'CL' },
    { value: 'sss-3', label: 'SSS 3', section: 'college', sectionCode: 'CL' },
  ],
}

export function useStudentId() {
  const [isLoading, setIsLoading] = useState(false)
  const [generatedIds, setGeneratedIds] = useState<string[]>([])

  const getSectionCode = (section: string): string => {
    const codes: Record<string, string> = {
      creche: 'CR',
      nursery: 'NS',
      primary: 'PR',
      college: 'CL',
    }
    return codes[section] || 'XX'
  }

  const generateStudentId = async (data: StudentGenerationData): Promise<string> => {
    setIsLoading(true)
    try {
      const year = data.year || new Date().getFullYear().toString().slice(-2)
      const sectionCode = getSectionCode(data.section)
      const sequence = (data.sequence || 1).toString().padStart(4, '0')
      
      return `VSP-${year}-${sectionCode}-${sequence}`
    } finally {
      setIsLoading(false)
    }
  }

  // NEW: Generate a new student ID (wrapper for generateStudentId)
  const generateNewStudentId = async (section?: string): Promise<string> => {
    const sectionValue = (section as any) || 'primary'
    return generateStudentId({
      section: sectionValue,
      year: new Date().getFullYear().toString().slice(-2),
      sequence: Math.floor(Math.random() * 1000) + 1
    })
  }

  // NEW: Generate student credentials
  const generateStudentCredentials = async (studentId: string) => {
    // Generate a random password
    const password = Math.random().toString(36).slice(-8) + 
                     Math.random().toString(36).toUpperCase().slice(-2) + 
                     '!1'
    
    return {
      studentId,
      password,
      email: `${studentId.toLowerCase()}@student.vincollins.edu.ng`,
    }
  }

  // NEW: Get class options
  const getClassOptions = () => {
    return Object.values(classOptionsBySection).flat()
  }

  // NEW: Get classes by section
  const getClassesBySection = (section: string) => {
    return classOptionsBySection[section as keyof typeof classOptionsBySection] || []
  }

  // NEW: Get section options
  const getSectionOptions = () => {
    return sections
  }

  // NEW: Validate student ID
  const validateStudentId = (studentId: string): boolean => {
    const pattern = /^VSP-\d{2}-[A-Z]{2}-\d{4}$/
    return pattern.test(studentId)
  }

  // NEW: Parse student ID
  const parseStudentId = (studentId: string): ParsedStudentId | null => {
    if (!validateStudentId(studentId)) return null

    const [, year, sectionCode, sequence] = studentId.split('-')
    
    const sectionMap: Record<string, { name: string; className: string }> = {
      CR: { name: 'Creche', className: 'Creche/Playgroup' },
      NS: { name: 'Nursery', className: 'Nursery' },
      PR: { name: 'Primary', className: 'Primary' },
      CL: { name: 'College', className: 'College' },
    }

    const section = sectionMap[sectionCode] || { name: 'Unknown', className: 'Unknown' }

    return {
      year,
      section: section.name,
      sectionCode,
      sequence,
      className: section.className,
      sectionName: section.name,
    }
  }

  // NEW: Generate bulk student IDs
  const generateBulkStudentIds = async (data: BulkStudentGenerationData): Promise<string[]> => {
    setIsLoading(true)
    try {
      const ids: string[] = []
      const year = data.year || new Date().getFullYear().toString().slice(-2)
      const sectionCode = getSectionCode(data.section)
      const startingNumber = data.startingNumber || 1

      for (let i = 0; i < data.count; i++) {
        const sequence = (startingNumber + i).toString().padStart(4, '0')
        ids.push(`VSP-${year}-${sectionCode}-${sequence}`)
      }

      setGeneratedIds(ids)
      return ids
    } finally {
      setIsLoading(false)
    }
  }

  return {
    generateStudentId,
    generateNewStudentId, // Added
    generateStudentCredentials, // Added
    generateBulkStudentIds,
    validateStudentId,
    parseStudentId,
    getClassOptions, // Added
    getClassesBySection, // Added
    getSectionOptions, // Added
    generatedIds,
    isLoading,
  }
}