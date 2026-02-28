/**
 * Format a date to a readable string
 * @param date - Date to format (Date object, string, or timestamp)
 * @returns Formatted date string (e.g., "Jan 1, 2024")
 */
export function formatDate(date: Date | string | number): string {
  const d = new Date(date)
  return d.toLocaleDateString('en-NG', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

/**
 * Format a date and time to a readable string
 * @param date - Date to format (Date object, string, or timestamp)
 * @returns Formatted date and time string (e.g., "Jan 1, 2024, 2:30 PM")
 */
export function formatDateTime(date: Date | string | number): string {
  const d = new Date(date)
  return d.toLocaleString('en-NG', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

/**
 * Format a time to a readable string
 * @param date - Date to format (Date object, string, or timestamp)
 * @returns Formatted time string (e.g., "2:30 PM")
 */
export function formatTime(date: Date | string | number): string {
  const d = new Date(date)
  return d.toLocaleTimeString('en-NG', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

/**
 * Format a number as currency (Nigerian Naira)
 * @param amount - Amount to format
 * @returns Formatted currency string (e.g., "₦1,500.00")
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

/**
 * Format a phone number to a readable format
 * @param phone - Phone number string
 * @returns Formatted phone number (e.g., "+234 801 234 5678")
 */
export function formatPhoneNumber(phone: string): string {
  // Remove all non-numeric characters
  const cleaned = phone.replace(/\D/g, '')
  
  // Check if it's a Nigerian number
  if (cleaned.length === 11 && cleaned.startsWith('0')) {
    return `+234 ${cleaned.slice(1, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7)}`
  }
  
  if (cleaned.length === 13 && cleaned.startsWith('234')) {
    return `+234 ${cleaned.slice(3, 6)} ${cleaned.slice(6, 9)} ${cleaned.slice(9)}`
  }
  
  // Return original if no format matches
  return phone
}

/**
 * Format a file size in bytes to a human-readable string
 * @param bytes - File size in bytes
 * @returns Formatted file size (e.g., "1.5 MB")
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * Format a number with commas as thousand separators
 * @param num - Number to format
 * @returns Formatted number (e.g., "1,234,567")
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-NG').format(num)
}

/**
 * Format a percentage
 * @param value - Number to format as percentage
 * @param decimals - Number of decimal places (default: 0)
 * @returns Formatted percentage (e.g., "75%")
 */
export function formatPercentage(value: number, decimals: number = 0): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value / 100)
}

/**
 * Truncate text to a specified length
 * @param text - Text to truncate
 * @param length - Maximum length
 * @returns Truncated text with ellipsis if needed
 */
export function truncateText(text: string, length: number): string {
  if (text.length <= length) return text
  return text.slice(0, length) + '...'
}

/**
 * Capitalize the first letter of a string
 * @param text - Text to capitalize
 * @returns Capitalized text
 */
export function capitalizeFirst(text: string): string {
  if (!text) return text
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
}

/**
 * Convert a string to title case
 * @param text - Text to convert
 * @returns Title case text
 */
export function toTitleCase(text: string): string {
  return text.replace(
    /\w\S*/g,
    (txt) => txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase()
  )
}

/**
 * Format a duration in seconds to a readable string
 * @param seconds - Duration in seconds
 * @returns Formatted duration (e.g., "2h 30m")
 */
export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60
  
  const parts = []
  if (hours > 0) parts.push(`${hours}h`)
  if (minutes > 0) parts.push(`${minutes}m`)
  if (secs > 0 && hours === 0) parts.push(`${secs}s`)
  
  return parts.join(' ') || '0s'
}

/**
 * Format a date to a relative time string (e.g., "2 hours ago")
 * @param date - Date to format
 * @returns Relative time string
 */
export function formatRelativeTime(date: Date | string | number): string {
  const now = new Date()
  const then = new Date(date)
  const diffInSeconds = Math.floor((now.getTime() - then.getTime()) / 1000)
  
  if (diffInSeconds < 60) {
    return 'just now'
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes === 1 ? '' : 's'} ago`
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours === 1 ? '' : 's'} ago`
  }
  
  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 30) {
    return `${diffInDays} day${diffInDays === 1 ? '' : 's'} ago`
  }
  
  const diffInMonths = Math.floor(diffInDays / 30)
  if (diffInMonths < 12) {
    return `${diffInMonths} month${diffInMonths === 1 ? '' : 's'} ago`
  }
  
  const diffInYears = Math.floor(diffInMonths / 12)
  return `${diffInYears} year${diffInYears === 1 ? '' : 's'} ago`
}