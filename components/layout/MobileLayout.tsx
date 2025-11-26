'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Users, FileText, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'

interface MobileLayoutProps {
  children: React.ReactNode
  showHeader?: boolean
  headerTitle?: string
  headerRightAction?: React.ReactNode
}

export default function MobileLayout({ 
  children, 
  showHeader = false,
  headerTitle,
  headerRightAction
}: MobileLayoutProps) {
  const pathname = usePathname()

  const navItems = [
    { href: '/dashboard', icon: Home, label: 'Accueil' },
    { href: '/clients', icon: Users, label: 'Clients' },
    { href: '/quotes', icon: FileText, label: 'Devis' },
    { href: '/settings', icon: Settings, label: 'Paramètres' },
  ]

  // Don't show nav on auth pages
  const hideNav = pathname === '/login' || 
                  pathname === '/register' || 
                  pathname === '/forgot-password' || 
                  pathname?.startsWith('/quote/')

  return (
    <div className="min-h-screen bg-gray-50">
      {showHeader && (
        <header className="sticky top-0 z-40 bg-white border-b border-gray-200 backdrop-blur-sm bg-white/95">
          <div className="max-w-md mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              {headerTitle ? (
                <h1 className="text-xl font-bold text-gray-900">{headerTitle}</h1>
              ) : (
                <div className="w-8 h-8" />
              )}
              {headerRightAction && (
                <div>{headerRightAction}</div>
              )}
            </div>
          </div>
        </header>
      )}
      
      <main className="max-w-md mx-auto px-4 py-6 pb-28">
        {children}
      </main>
      
      {!hideNav && (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 shadow-premium-lg max-w-md mx-auto z-50">
          <div className="flex justify-around items-center py-2 px-2">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex flex-col items-center justify-center py-3 px-4 rounded-xl',
                    'transition-all duration-200 min-w-[64px]',
                    isActive 
                      ? 'text-primary-500 bg-primary-50' 
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  )}
                >
                  <Icon 
                    size={22} 
                    className={cn(
                      'transition-transform duration-200',
                      isActive && 'scale-110'
                    )} 
                  />
                  <span className={cn(
                    'text-xs font-semibold mt-1 transition-all',
                    isActive ? 'text-primary-600' : 'text-gray-600'
                  )}>
                    {item.label}
                  </span>
                </Link>
              )
            })}
          </div>
        </nav>
      )}
    </div>
  )
}
