'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, LogIn } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { mainNavItems } from '@/lib/constants/navigation'
import { cn } from '@/lib/utils/cn'
import Image from 'next/image'

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 w-full bg-[#0A2472] text-white shadow-2xl">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
      
      <div className="container relative flex h-20 items-center justify-between px-4 md:px-6">
        {/* Logo with Badge */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-md ring-2 ring-white/30 group-hover:ring-white/60 transition-all shadow-xl flex-shrink-0">
            <Image
              src="/images/logo.png"
              alt="Vincollins Schools Badge"
              fill
              className="object-contain p-2 transition-transform duration-300 group-hover:scale-110"
              priority
            />
          </div>
          
          <div className="flex flex-col justify-center">
            <span className="font-serif text-xl font-bold text-white leading-none tracking-tight">
              Vincollins Schools
            </span>
            <span className="font-script text-sm bg-gradient-to-r from-secondary to-secondary/80 bg-clip-text text-transparent leading-tight mt-0.5">
              Geared Towards Success
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex md:items-center md:space-x-1">
          {mainNavItems.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(item.href + '/')
            
            return (
              <Link
                key={item.href} // Using href as key - ensure these are unique
                href={item.href}
                className={cn(
                  'relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200',
                  'hover:bg-white hover:text-[#0A2472]',
                  isActive 
                    ? 'text-white bg-white/20 shadow-lg font-semibold' 
                    : 'text-white/80'
                )}
              >
                {item.title}
                {isActive && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-secondary rounded-full" />
                )}
              </Link>
            )
          })}
        </nav>

        {/* Desktop Login Button - This is NOT part of mainNavItems */}
        <div className="hidden items-center md:flex">
          <Button 
            className="relative overflow-hidden bg-white text-[#0A2472] hover:bg-secondary hover:text-white font-semibold px-6 py-2.5 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 border-2 border-white group"
            asChild
          >
            <Link href="/login" className="flex items-center gap-2.5">
              <LogIn className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
              <span className="text-sm tracking-wide">Portal Login</span>
              <div className="absolute inset-0 -z-10 bg-gradient-to-r from-secondary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </Link>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden text-white hover:bg-white hover:text-[#0A2472] transition-all rounded-xl h-12 w-12"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? 
            <X className="h-6 w-6 transition-transform duration-300 rotate-90" /> : 
            <Menu className="h-6 w-6 transition-transform duration-300" />
          }
        </Button>
      </div>

      {/* Mobile Navigation */}
      <div
        className={cn(
          'fixed inset-0 top-20 z-50 bg-[#0A2472]/98 backdrop-blur-xl p-6 transition-all duration-500 md:hidden',
          isMenuOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
        )}
      >
        <nav className="flex flex-col h-full">
          {/* Mobile Logo Section */}
          <div className="flex items-center gap-3 pb-6 border-b border-white/20">
            <div className="relative h-12 w-12 overflow-hidden rounded-xl bg-gradient-to-br from-white/20 to-white/5 flex-shrink-0 shadow-lg">
              <Image
                src="/images/logo.png"
                alt="Vincollins Schools Badge"
                fill
                className="object-contain p-2"
              />
            </div>
            <div className="flex flex-col justify-center">
              <span className="font-serif text-lg font-bold text-white leading-tight">
                Vincollins Schools
              </span>
              <span className="font-script text-sm text-secondary leading-tight">
                Geared Towards Success
              </span>
            </div>
          </div>
          
          {/* Mobile Navigation Items */}
          <div className="flex-1 py-8 space-y-2">
            {mainNavItems.map((item, index) => {
              const isActive = pathname === item.href || pathname?.startsWith(item.href + '/')
              
              return (
                <Link
                  key={`mobile-${item.href}`} // Using mobile- prefix to ensure uniqueness
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-4 py-4 text-lg font-medium rounded-xl transition-all duration-200',
                    'hover:bg-white hover:text-[#0A2472]',
                    isActive 
                      ? 'bg-white/20 text-white shadow-lg font-semibold' 
                      : 'text-white/80'
                  )}
                  style={{ 
                    transitionDelay: `${index * 50}ms`,
                    animation: isMenuOpen ? `slideIn 0.5s ease-out ${index * 0.05}s forwards` : 'none',
                    opacity: 0,
                    transform: 'translateX(-20px)'
                  }}
                >
                  <span className={cn(
                    'w-1.5 h-1.5 rounded-full transition-all',
                    isActive ? 'bg-secondary w-6' : 'bg-white/30'
                  )} />
                  {item.title}
                </Link>
              )
            })}
          </div>

          {/* Mobile Login Button - Separate from navigation items */}
          <div className="pt-4">
            <Button 
              className="w-full bg-white text-[#0A2472] hover:bg-secondary hover:text-white font-semibold py-6 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] border-2 border-white group"
              asChild
            >
              <Link 
                href="/login" 
                onClick={() => setIsMenuOpen(false)} 
                className="flex items-center justify-center gap-3"
              >
                <LogIn className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                <span className="text-base">Portal Login</span>
              </Link>
            </Button>
          </div>
        </nav>
      </div>

      {/* Add keyframe animation for mobile menu items */}
      <style jsx>{`
        @keyframes slideIn {
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </header>
  )
}