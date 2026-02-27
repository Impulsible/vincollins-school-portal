'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, ArrowRight, ChevronRight } from 'lucide-react'
import { footerNavItems } from '@/lib/constants/navigation'
import { siteConfig } from '@/lib/constants/site'
import { cn } from '@/lib/utils/cn'
import Image from 'next/image'

export function Footer() {
  const pathname = usePathname()
  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative bg-[#0A2472] text-white overflow-hidden">
      {/* Subtle background texture */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent" />
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" />
      
      {/* Simple static gradient line at top */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-secondary/30 to-transparent" />

      <div className="container relative py-16 md:py-20">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-12">
          {/* Brand Column */}
          <div className="lg:col-span-3 space-y-6">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-white/10 to-white/5 ring-2 ring-white/20 group-hover:ring-white/40 transition-all duration-500 shadow-xl">
                <Image
                  src="/images/logo.png"
                  alt="Vincollins Schools Badge"
                  fill
                  className="object-contain p-2 transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-xl font-bold text-white leading-none tracking-tight">
                  Vincollins
                </span>
                <span className="font-script text-sm bg-gradient-to-r from-secondary to-secondary/80 bg-clip-text text-transparent leading-tight">
                  Geared Towards Success
                </span>
              </div>
            </Link>
            
            <p className="text-sm text-white/60 leading-relaxed max-w-xs">
              Providing quality education since 1995. Nurturing future leaders with excellence, integrity, and innovation.
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-3">
              {[
                { href: siteConfig.links.facebook, icon: Facebook, label: 'Facebook' },
                { href: siteConfig.links.twitter, icon: Twitter, label: 'Twitter' },
                { href: siteConfig.links.instagram, icon: Instagram, label: 'Instagram' }
              ].map((social) => (
                <Link 
                  key={social.label}
                  href={social.href} 
                  className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 text-white/50 hover:bg-secondary/20 hover:text-secondary transition-all duration-300"
                  aria-label={social.label}
                >
                  <social.icon className="h-4 w-4" />
                </Link>
              ))}
            </div>
          </div>

          {/* Navigation Columns */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-3 gap-8">
            {/* Academics */}
            <div>
              <h3 className="font-serif text-base font-semibold text-white/90 mb-4 tracking-wide flex items-center gap-2">
                <span className="w-1 h-4 bg-secondary rounded-full" />
                Academics
              </h3>
              <ul className="space-y-3">
                {footerNavItems.academics.map((item) => (
                  <li key={item.href}>
                    <Link 
                      href={item.href} 
                      className="group flex items-center gap-2 text-sm text-white/50 hover:text-secondary transition-colors duration-300"
                    >
                      <ChevronRight className="h-3 w-3 text-secondary/0 group-hover:text-secondary transition-all duration-300 group-hover:translate-x-1" />
                      <span>{item.title}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* About */}
            <div>
              <h3 className="font-serif text-base font-semibold text-white/90 mb-4 tracking-wide flex items-center gap-2">
                <span className="w-1 h-4 bg-secondary rounded-full" />
                About
              </h3>
              <ul className="space-y-3">
                {footerNavItems.about.map((item) => (
                  <li key={item.href}>
                    <Link 
                      href={item.href} 
                      className="group flex items-center gap-2 text-sm text-white/50 hover:text-secondary transition-colors duration-300"
                    >
                      <ChevronRight className="h-3 w-3 text-secondary/0 group-hover:text-secondary transition-all duration-300 group-hover:translate-x-1" />
                      <span>{item.title}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Portal Access */}
            <div>
              <h3 className="font-serif text-base font-semibold text-white/90 mb-4 tracking-wide flex items-center gap-2">
                <span className="w-1 h-4 bg-secondary rounded-full" />
                Portal
              </h3>
              <ul className="space-y-3">
                {footerNavItems.portal.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <li key={item.href}>
                      <Link 
                        href={item.href} 
                        className={cn(
                          'group flex items-center gap-2 text-sm transition-colors duration-300',
                          isActive ? 'text-secondary' : 'text-white/50 hover:text-secondary'
                        )}
                      >
                        <ChevronRight className={cn(
                          'h-3 w-3 transition-all duration-300 group-hover:translate-x-1',
                          isActive ? 'text-secondary' : 'text-secondary/0 group-hover:text-secondary'
                        )} />
                        <span>{item.title}</span>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>

          {/* Contact Column */}
          <div className="lg:col-span-3">
            <h3 className="font-serif text-base font-semibold text-white/90 mb-4 tracking-wide flex items-center gap-2">
              <span className="w-1 h-4 bg-secondary rounded-full" />
              Contact Us
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3 text-sm text-white/50 group hover:text-secondary/80 transition-colors duration-300">
                <MapPin className="h-4 w-4 shrink-0 mt-0.5 text-secondary/70 group-hover:text-secondary transition-colors" />
                <span>{siteConfig.contact.address}</span>
              </li>
              <li className="flex items-center space-x-3 text-sm text-white/50 group hover:text-secondary/80 transition-colors duration-300">
                <Phone className="h-4 w-4 shrink-0 text-secondary/70 group-hover:text-secondary transition-colors" />
                <span>{siteConfig.contact.phone}</span>
              </li>
              <li className="flex items-center space-x-3 text-sm text-white/50 group hover:text-secondary/80 transition-colors duration-300">
                <Mail className="h-4 w-4 shrink-0 text-secondary/70 group-hover:text-secondary transition-colors" />
                <span>{siteConfig.contact.email}</span>
              </li>
            </ul>

            {/* Contact Button */}
            <div className="mt-6">
              <Link 
                href="/contact" 
                className="group inline-flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-secondary/20 text-white/80 hover:text-secondary rounded-lg transition-all duration-300 text-sm"
              >
                <span>Send us a message</span>
                <ArrowRight className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-6 border-t border-white/5">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-white/40 text-center md:text-left">
              © {currentYear} Vincollins Schools, Lagos. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              {[
                { href: '/privacy', label: 'Privacy' },
                { href: '/terms', label: 'Terms' },
                { href: '/sitemap', label: 'Sitemap' }
              ].map((link) => (
                <Link 
                  key={link.href}
                  href={link.href} 
                  className="group flex items-center gap-1 text-xs text-white/30 hover:text-white/50 transition-colors duration-300"
                >
                  <span>{link.label}</span>
                  <ArrowRight className="h-2 w-2 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}