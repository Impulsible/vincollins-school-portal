// src/components/notifications/notification-center.tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Bell, CheckCheck, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils/cn'
import { useAuth } from '@/hooks/use-auth'
import { useToast } from '@/hooks/use-toast'
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

export function NotificationCenter() {
  const [open, setOpen] = useState(false)
  const { user, isAuthenticated } = useAuth()
  const { success, error } = useToast()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  // Mock notifications for now
  useEffect(() => {
    if (!isAuthenticated) return

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
        title: 'CBT Exam Scheduled',
        message: 'You have a CBT exam in Physics on Friday.',
        type: 'info',
        read: true,
        created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        link: '/student/cbt',
      },
    ]

    setNotifications(mockNotifications)
    setUnreadCount(mockNotifications.filter(n => !n.read).length)
  }, [isAuthenticated])

  const markAsRead = async (notificationId: string) => {
    try {
      // In a real app, you would call an API here
      setNotifications(prev =>
        prev.map(n =>
          n.id === notificationId ? { ...n, read: true } : n
        )
      )
      setUnreadCount(prev => Math.max(0, prev - 1))
      success?.('Notification marked as read')
    } catch (err) {
      error?.('Failed to mark notification as read')
    }
  }

  const markAllAsRead = async () => {
    try {
      setNotifications(prev =>
        prev.map(n => ({ ...n, read: true }))
      )
      setUnreadCount(0)
      success?.('All notifications marked as read')
    } catch (err) {
      error?.('Failed to mark all as read')
    }
  }

  const deleteNotification = async (notificationId: string) => {
    try {
      const notification = notifications.find(n => n.id === notificationId)
      setNotifications(prev => prev.filter(n => n.id !== notificationId))
      if (notification && !notification.read) {
        setUnreadCount(prev => Math.max(0, prev - 1))
      }
      success?.('Notification deleted')
    } catch (err) {
      error?.('Failed to delete notification')
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-success/10 text-success'
      case 'warning':
        return 'bg-warning/10 text-warning'
      case 'error':
        return 'bg-error/10 text-error'
      default:
        return 'bg-info/10 text-info'
    }
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-destructive text-[10px] font-medium text-white flex items-center justify-center animate-pulse">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[380px] p-0">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-semibold">Notifications</h3>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              className="h-8 text-xs"
            >
              <CheckCheck className="mr-1 h-3 w-3" />
              Mark all as read
            </Button>
          )}
        </div>

        <ScrollArea className="h-[400px]">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full py-8 text-center">
              <Bell className="h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">No notifications</p>
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={cn(
                    'relative p-4 hover:bg-muted/50 transition-colors',
                    !notification.read && 'bg-muted/30'
                  )}
                >
                  <div className="flex gap-3">
                    <div className={cn(
                      'h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0',
                      getNotificationIcon(notification.type)
                    )}>
                      <Bell className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-sm font-medium">
                            {notification.title}
                          </p>
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
                  {!notification.read && (
                    <span className="absolute left-2 top-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-secondary" />
                  )}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        <div className="border-t p-2">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-center text-xs"
            asChild
          >
            <Link href="/notifications">View all notifications</Link>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}