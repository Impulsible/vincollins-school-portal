import type { Metadata } from 'next'
import { Open_Sans, Playfair_Display, Dancing_Script } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { AuthProvider } from '@/components/providers/auth-provider'
import { QueryProvider } from '@/components/providers/query-provider'
import { ToastProvider } from '@/components/providers/toast-provider'
import { siteConfig } from '@/lib/constants/site'
import { cn } from '@/lib/utils/cn'

const openSans = Open_Sans({ 
  subsets: ['latin'],
  variable: '--font-sans',
})

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-serif',
})

const dancingScript = Dancing_Script({ 
  subsets: ['latin'],
  variable: '--font-script',
})

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  // ... rest of your metadata
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${openSans.variable} ${playfair.variable} ${dancingScript.variable} scroll-smooth`}>
      <body className={cn('flex min-h-screen flex-col')}>
        <AuthProvider>
          <QueryProvider>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
            <ToastProvider />
          </QueryProvider>
        </AuthProvider>
      </body>
    </html>
  )
}