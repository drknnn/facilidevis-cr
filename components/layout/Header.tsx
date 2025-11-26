'use client'

import React from 'react'
import Logo from '@/components/ui/Logo'
import { useRouter } from 'next/navigation'
import { FiArrowLeft } from 'react-icons/fi'

interface HeaderProps {
  title?: string
  showBack?: boolean
  rightAction?: React.ReactNode
}

export default function Header({ title, showBack = false, rightAction }: HeaderProps) {
  const router = useRouter()

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
      <div className="max-w-md mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {showBack && (
              <button
                onClick={() => router.back()}
                className="flex-shrink-0 p-2 -ml-2 rounded-xl hover:bg-gray-100 active:bg-gray-200 transition-colors tap-target"
                aria-label="Retour"
              >
                <FiArrowLeft size={20} className="text-gray-700" />
              </button>
            )}
            {title ? (
              <h1 className="text-xl font-bold text-gray-900 truncate">{title}</h1>
            ) : (
              <Logo size="sm" />
            )}
          </div>
          {rightAction && (
            <div className="flex-shrink-0 ml-3">
              {rightAction}
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

