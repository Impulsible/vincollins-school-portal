import { cn } from '@/lib/utils/cn'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
  showText?: boolean
  text?: string
}

export function LoadingSpinner({ 
  size = 'md', 
  className,
  showText = true,
  text = 'Vincollins'
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  }

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  }

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div role="status" className="relative">
        {/* Main spinner */}
        <svg
          aria-hidden="true"
          className={cn(
            'animate-spin',
            sizeClasses[size],
            className
          )}
          viewBox="0 0 100 101"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
            fill="currentColor"
            className="text-primary/20"
          />
          <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
            fill="currentColor"
            className="text-primary"
          />
        </svg>

        {/* Optional pulsing ring effect for larger sizes */}
        {size === 'lg' && (
          <div className="absolute inset-0 -m-2">
            <div className="h-full w-full animate-ping rounded-full bg-primary/20" />
          </div>
        )}
      </div>

      {/* Animated text */}
      {showText && (
        <div className="flex flex-col items-center gap-1">
          <div className="flex items-center gap-1">
            <span className={cn(
              'font-serif font-bold tracking-wide animate-pulse',
              textSizeClasses[size]
            )}>
              {text}
            </span>
            <span className="animate-bounce delay-100">.</span>
            <span className="animate-bounce delay-200">.</span>
            <span className="animate-bounce delay-300">.</span>
          </div>
          
          {/* Optional subtitle for lg size */}
          {size === 'lg' && (
            <p className="text-xs text-muted-foreground animate-fade-in">
              Geared Towards Excellence
            </p>
          )}
        </div>
      )}
    </div>
  )
}

// Full page loader with background
export function FullPageLoader() {
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-2xl shadow-soft flex flex-col items-center gap-4">
        <LoadingSpinner size="lg" />
        <p className="text-sm text-muted-foreground animate-pulse">
          Preparing your experience...
        </p>
      </div>
    </div>
  )
}

// Skeleton loader for content
export function ContentLoader() {
  return (
    <div className="space-y-4 p-4">
      <div className="h-8 w-48 bg-muted animate-pulse rounded-lg" />
      <div className="grid grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-32 bg-muted animate-pulse rounded-lg" />
        ))}
      </div>
      <div className="h-64 bg-muted animate-pulse rounded-lg" />
    </div>
  )
}