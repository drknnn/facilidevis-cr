import React from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  showText?: boolean
  className?: string
  variant?: 'default' | 'monochrome'
}

export default function Logo({ 
  size = 'md', 
  showText = true, 
  className = '',
  variant = 'default'
}: LogoProps) {
  const sizes = {
    sm: { icon: 32, text: 'text-base font-bold' },
    md: { icon: 40, text: 'text-xl font-bold' },
    lg: { icon: 56, text: 'text-2xl font-bold' },
  }

  const { icon: iconSize, text: textSize } = sizes[size]

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <div className="relative flex-shrink-0">
        {/* Logo FaciliDevis */}
        <div 
          className={cn(
            'rounded-xl flex items-center justify-center overflow-hidden',
            variant === 'default' ? 'bg-primary-500' : 'bg-gray-900'
          )}
          style={{ width: iconSize, height: iconSize }}
        >
          {/* Placeholder - sera remplacé par l'image réelle */}
          <svg
            width={iconSize * 0.6}
            height={iconSize * 0.6}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {/* TODO: Remplacer par <Image src="/facilidevis-logo.png" width={iconSize} height={iconSize} alt="FaciliDevis" className="object-contain" /> */}
        </div>
      </div>
      {showText && (
        <span className={cn('font-bold text-gray-900', textSize)}>
          FaciliDevis
        </span>
      )}
    </div>
  )
}
