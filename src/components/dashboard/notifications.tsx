'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Bell, CheckCheck, X } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils/cn'
import { formatDistanceToNow } from 'date-fns'

interface Notification {
  id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  read: boolean
  created_at: string
  link?: string
}

interface NotificationsProps {
  userRole?: string
}

export function Notifications({ userRole }: NotificationsProps) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)

  // Define fetchNotifications before using it in useEffect
  const fetchNotifications = async () => {
    // Mock notifications - replace with actual data
    const mockNotifications: Notification[] = [
      {
        id: '1',
        title: 'New Result Published',
        message: 'Your results for Mathematics are now available.',
        type: 'info',
        read: false,
        created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        link: '/student/results',
      },
      {
        id: '2',
        title: 'Assignment Deadline',
        message: 'English Literature assignment due tomorrow.',
        type: 'warning',
        read: false,
        created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        link: '/student/assignments',
      },
      {
        id: '3',
        title: 'Staff Meeting',
        message: 'All staff meeting on Friday at 2 PM.',
        type: 'info',
        read: true,
        created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '4',
        title: 'System Update',
        message: 'Portal will be down for maintenance on Saturday.',
        type: 'warning',
        read: false,
        created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ]

    // Filter by user role if needed
    setNotifications(mockNotifications)
    setUnreadCount(mockNotifications.filter(n => !n.read).length)
  }

  useEffect(() => {
    fetchNotifications()
  }, [userRole]) // Add userRole as dependency

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    )
    setUnreadCount(prev => Math.max(0, prev - 1))
  }

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, read: true }))
    )
    setUnreadCount(0)
  }

  const deleteNotification = (id: string) => {
    const notification = notifications.find(n => n.id === id)
    setNotifications(prev => prev.filter(n => n.id !== id))
    if (notification && !notification.read) {
      setUnreadCount(prev => Math.max(0, prev - 1))
    }
  }

  const getIconColor = (type: string) => {
    switch (type) {
      case 'success': return 'text-success'
      case 'warning': return 'text-warning'
      case 'error': return 'text-destructive'
      default: return 'text-info'
    }
  }

  const getIconBg = (type: string) => {
    switch (type) {
      case 'success': return 'bg-success/10'
      case 'warning': return 'bg-warning/10'
      case 'error': return 'bg-destructive/10'
      default: return 'bg-info/10'
    }
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle>Notifications</CardTitle>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllAsRead}>
              <CheckCheck className="h-4 w-4 mr-2" />
              Mark all read
            </Button>
          )}
        </div>
        <CardDescription>
          You have {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Bell className="h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">No notifications</p>
            </div>
          ) : (
            <div className="space-y-4">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={cn(
                    'flex gap-3 p-3 rounded-lg transition-colors',
                    !notification.read ? 'bg-muted/50' : 'hover:bg-muted/30'
                  )}
                >
                  <div className={cn(
                    'h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0',
                    getIconBg(notification.type)
                  )}>
                    <Bell className={cn('h-4 w-4', getIconColor(notification.type))} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-medium">{notification.title}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {notification.message}
                        </p>
                        <p className="text-xs text-muted-foreground/60 mt-2">
                          {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                        </p>
                      </div>
                      <div className="flex gap-1">
                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => markAsRead(notification.id)}
                          >
                            <CheckCheck className="h-3 w-3" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => deleteNotification(notification.id)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    {notification.link && (
                      <Button
                        variant="link"
                        size="sm"
                        className="h-auto p-0 mt-2 text-xs"
                        asChild
                      >
                        <Link href={notification.link}>View details →</Link>
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}