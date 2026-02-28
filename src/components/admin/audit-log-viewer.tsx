'use client'

import { useState, useEffect } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Download, Search, Filter } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { formatDate, formatDateTime } from '@/lib/utils/format'

type AuditLog = {
  id: string
  user_id: string
  action: string
  entity: string
  entity_id: string
  changes: any
  ip_address: string
  user_agent: string
  created_at: string
  users?: {
    email: string
    first_name: string
    last_name: string
  }
}

type DateRange = 'all' | 'today' | 'week' | 'month'

export function AuditLogViewer() {
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [actionFilter, setActionFilter] = useState<string>('all')
  const [entityFilter, setEntityFilter] = useState<string>('all')
  const [dateRange, setDateRange] = useState<DateRange>('week')
  const [page, setPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const pageSize = 50

  const supabase = createClient()

  useEffect(() => {
    fetchLogs()
  }, [actionFilter, entityFilter, dateRange, page])

  const fetchLogs = async () => {
    setLoading(true)
    try {
      let query = supabase
        .from('audit_logs')
        .select(`
          *,
          users!user_id (
            email,
            first_name,
            last_name
          )
        `, { count: 'exact' })
        .order('created_at', { ascending: false })
        .range((page - 1) * pageSize, page * pageSize - 1)

      // Apply date range filter
      if (dateRange !== 'all') {
        const now = new Date()
        const startDate = new Date()
        
        switch (dateRange) {
          case 'today':
            startDate.setHours(0, 0, 0, 0)
            break
          case 'week':
            startDate.setDate(now.getDate() - 7)
            break
          case 'month':
            startDate.setMonth(now.getMonth() - 1)
            break
        }
        
        query = query.gte('created_at', startDate.toISOString())
      }

      // Apply action filter
      if (actionFilter !== 'all') {
        query = query.eq('action', actionFilter)
      }

      // Apply entity filter
      if (entityFilter !== 'all') {
        query = query.eq('entity', entityFilter)
      }

      const { data, count, error } = await query

      if (error) throw error

      setLogs(data || [])
      setTotalCount(count || 0)
    } catch (error) {
      console.error('Error fetching audit logs:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  // FIXED: Type-safe handler for date range change
  const handleDateRangeChange = (value: string) => {
    setDateRange(value as DateRange)
  }

  const handleExport = async () => {
    // Export logic here
    console.log('Exporting logs...')
  }

  const filteredLogs = logs.filter(log => {
    if (!searchTerm) return true
    
    const searchLower = searchTerm.toLowerCase()
    return (
      log.action?.toLowerCase().includes(searchLower) ||
      log.entity?.toLowerCase().includes(searchLower) ||
      log.users?.email?.toLowerCase().includes(searchLower) ||
      log.users?.first_name?.toLowerCase().includes(searchLower) ||
      log.users?.last_name?.toLowerCase().includes(searchLower) ||
      log.ip_address?.includes(searchLower)
    )
  })

  const getActionBadge = (action: string) => {
    const variants: Record<string, string> = {
      CREATE: 'success',
      UPDATE: 'info',
      DELETE: 'destructive',
      LOGIN: 'default',
      LOGOUT: 'secondary',
      EXPORT: 'warning',
    }
    return variants[action] || 'default'
  }

  const totalPages = Math.ceil(totalCount / pageSize)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Audit Logs</CardTitle>
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export Logs
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Filters */}
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search logs..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="pl-8"
                />
              </div>
            </div>

            {/* FIXED: Using custom handler for type safety */}
            <Select value={actionFilter} onValueChange={setActionFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actions</SelectItem>
                <SelectItem value="CREATE">Create</SelectItem>
                <SelectItem value="UPDATE">Update</SelectItem>
                <SelectItem value="DELETE">Delete</SelectItem>
                <SelectItem value="LOGIN">Login</SelectItem>
                <SelectItem value="LOGOUT">Logout</SelectItem>
                <SelectItem value="EXPORT">Export</SelectItem>
              </SelectContent>
            </Select>

            <Select value={entityFilter} onValueChange={setEntityFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Entity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Entities</SelectItem>
                <SelectItem value="user">Users</SelectItem>
                <SelectItem value="student">Students</SelectItem>
                <SelectItem value="staff">Staff</SelectItem>
                <SelectItem value="result">Results</SelectItem>
                <SelectItem value="assignment">Assignments</SelectItem>
                <SelectItem value="resource">Resources</SelectItem>
                <SelectItem value="cbt">CBT Exams</SelectItem>
              </SelectContent>
            </Select>

            {/* FIXED: Using custom handler for date range */}
            <Select value={dateRange} onValueChange={handleDateRangeChange}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Date Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">Last 7 Days</SelectItem>
                <SelectItem value="month">Last 30 Days</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Entity</TableHead>
                  <TableHead>Entity ID</TableHead>
                  <TableHead>IP Address</TableHead>
                  <TableHead>Changes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : filteredLogs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      No audit logs found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-mono text-xs">
                        {formatDateTime(log.created_at)}
                      </TableCell>
                      <TableCell>
                        {log.users ? (
                          <div>
                            <div className="font-medium">
                              {log.users.first_name} {log.users.last_name}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {log.users.email}
                            </div>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">System</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getActionBadge(log.action) as any}>
                          {log.action}
                        </Badge>
                      </TableCell>
                      <TableCell>{log.entity}</TableCell>
                      <TableCell className="font-mono text-xs">
                        {log.entity_id}
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {log.ip_address}
                      </TableCell>
                      <TableCell>
                        {log.changes && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => console.log(log.changes)}
                          >
                            <Filter className="h-4 w-4" />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Showing {((page - 1) * pageSize) + 1} to {Math.min(page * pageSize, totalCount)} of {totalCount} entries
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}