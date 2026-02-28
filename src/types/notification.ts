// src/types/notification.ts
export interface Notification {
  id: string
  user_id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  read: boolean
  created_at: string
  link?: string
}

export interface Announcement {
  id: string
  title: string
  content: string
  audience: ('students' | 'staff' | 'parents' | 'all')[]
  published_at: string
  expires_at?: string
  created_by: string
}

export interface NotificationPreferences {
  email_notifications: boolean
  push_notifications: boolean
  sms_notifications: boolean
  result_notifications: boolean
  assignment_notifications: boolean
  announcement_notifications: boolean
  cbt_notifications: boolean
}