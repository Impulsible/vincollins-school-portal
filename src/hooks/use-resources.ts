import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/hooks/use-toast'

interface Resource {
  id: string
  title: string
  description: string
  type: 'document' | 'video' | 'link' | 'image'
  url: string
  class_id: string
  subject_id: string
  uploaded_by: string
  status: 'published' | 'draft' | 'archived'
  created_at: string
  updated_at: string
}

interface ResourceFilters {
  classId?: string
  subjectId?: string
  type?: string
  status?: string
}

export function useResources() {
  const [resources, setResources] = useState<Resource[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { success, error: toastError } = useToast()
  const supabase = createClient()

  const fetchResources = async (filters?: ResourceFilters) => {
    setLoading(true)
    setError(null)

    try {
      let query = supabase
        .from('resources')
        .select('*')
        .order('created_at', { ascending: false })

      if (filters?.classId) {
        query = query.eq('class_id', filters.classId)
      }

      if (filters?.subjectId) {
        query = query.eq('subject_id', filters.subjectId)
      }

      if (filters?.type) {
        query = query.eq('type', filters.type)
      }

      if (filters?.status) {
        query = query.eq('status', filters.status)
      }

      const { data, error } = await query

      if (error) throw error

      setResources(data || [])
    } catch (err) {
      console.error('Error fetching resources:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch resources')
      toastError?.('Failed to load resources')
    } finally {
      setLoading(false)
    }
  }

  const getResource = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('resources')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error

      return data
    } catch (err) {
      console.error('Error fetching resource:', err)
      toastError?.('Failed to load resource')
      return null
    }
  }

  const createResource = async (resource: Omit<Resource, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('resources')
        .insert([resource])
        .select()
        .single()

      if (error) throw error

      setResources(prev => [data, ...prev])
      success?.('Resource created successfully')
      return data
    } catch (err) {
      console.error('Error creating resource:', err)
      toastError?.('Failed to create resource')
      return null
    }
  }

  const updateResource = async (id: string, updates: Partial<Resource>) => {
    try {
      const { data, error } = await supabase
        .from('resources')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      setResources(prev => prev.map(r => r.id === id ? data : r))
      success?.('Resource updated successfully')
      return data
    } catch (err) {
      console.error('Error updating resource:', err)
      toastError?.('Failed to update resource')
      return null
    }
  }

  const deleteResource = async (id: string) => {
    try {
      const { error } = await supabase
        .from('resources')
        .delete()
        .eq('id', id)

      if (error) throw error

      setResources(prev => prev.filter(r => r.id !== id))
      success?.('Resource deleted successfully')
      return true
    } catch (err) {
      console.error('Error deleting resource:', err)
      toastError?.('Failed to delete resource')
      return false
    }
  }

  // Get resource statistics by type
  const getResourceStats = async () => {
    try {
      const { data, error } = await supabase
        .from('resources')
        .select('type')

      if (error) throw error

      // Manually aggregate by type
      const stats: Record<string, number> = {}
      data?.forEach((item: any) => {
        const type = item.type || 'other'
        stats[type] = (stats[type] || 0) + 1
      })

      return Object.entries(stats).map(([type, count]) => ({
        type,
        count,
      }))
    } catch (err) {
      console.error('Error getting resource stats:', err)
      return []
    }
  }

  useEffect(() => {
    fetchResources()
  }, [])

  return {
    resources,
    loading,
    error,
    fetchResources,
    getResource,
    createResource,
    updateResource,
    deleteResource,
    getResourceStats,
  }
}