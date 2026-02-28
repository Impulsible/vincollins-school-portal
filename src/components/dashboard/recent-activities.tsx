'use client'

import { useState, useEffect } from 'react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { formatDistanceToNow } from 'date-fns'
import { FileText, Award, ClipboardList, BookOpen } from 'lucide-react'

interface Activity {
  id: string
  type: 'result' | 'assignment' | 'resource' | 'cbt'
  title: string
  description: string
  timestamp: string
  user: {
    name: string
    avatar?: string
  }
}

interface RecentActivitiesProps {
  userRole?: string
}

export function RecentActivities({ userRole }: RecentActivitiesProps) {
  const [activities, setActivities] = useState<Activity[]>([])

  // Define fetchActivities before using it in useEffect
  const fetchActivities = async () => {
    // Mock activities - replace with actual API call
    const mockActivities: Activity[] = [
      {
        id: '1',
        type: 'result',
        title: 'Results Published',
        description: 'Mathematics results have been published',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        user: { name: 'System' },
      },
      {
        id: '2',
        type: 'assignment',
        title: 'Assignment Submitted',
        description: 'English Literature assignment submitted',
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        user: { name: 'John Doe' },
      },
      {
        id: '3',
        type: 'resource',
        title: 'New Resource Available',
        description: 'Physics notes uploaded',
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        user: { name: 'Dr. Smith' },
      },
      {
        id: '4',
        type: 'cbt',
        title: 'CBT Exam Scheduled',
        description: 'Chemistry CBT exam scheduled for Friday',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        user: { name: 'System' },
      },
    ]

    setActivities(mockActivities)
  }

  useEffect(() => {
    fetchActivities()
  }, [userRole])

  const getIcon = (type: string) => {
    switch (type) {
      case 'result': return Award
      case 'assignment': return ClipboardList
      case 'resource': return BookOpen
      case 'cbt': return FileText
      default: return FileText
    }
  }

  const getIconColor = (type: string) => {
    switch (type) {
      case 'result': return 'text-success'
      case 'assignment': return 'text-info'
      case 'resource': return 'text-accent'
      case 'cbt': return 'text-warning'
      default: return 'text-primary'
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <ScrollArea className="h-[300px] pr-4">
      <div className="space-y-4">
        {activities.map((activity) => {
          const Icon = getIcon(activity.type)
          return (
            <div key={activity.id} className="flex items-start gap-3">
              <Avatar className="h-9 w-9">
                <AvatarFallback className={getIconColor(activity.type)}>
                  <Icon className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium">{activity.title}</p>
                <p className="text-xs text-muted-foreground">
                  {activity.description}
                </p>
                <p className="text-xs text-muted-foreground/60">
                  {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </ScrollArea>
  )
}