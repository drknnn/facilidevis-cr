'use client'

import { useEffect } from 'react'
import { CheckCircle2, XCircle, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ToastProps {
  message: string
  type?: 'success' | 'error'
  onClose: () => void
  duration?: number
}

export default function Toast({ message, type = 'success', onClose, duration = 4000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  return (
    <div className="w-full animate-slide-down">
      <div
        className={cn(
          'flex items-center justify-between p-4 rounded-xl shadow-premium-lg border-2 transition-all duration-300',
          type === 'success'
            ? 'bg-success-50 border-success-200 text-success-900'
            : 'bg-error-50 border-error-200 text-error-900'
        )}
      >
        <div className="flex items-center gap-3 flex-1">
          {type === 'success' ? (
            <CheckCircle2 className="text-success-600 flex-shrink-0" size={20} strokeWidth={2.5} />
          ) : (
            <XCircle className="text-error-600 flex-shrink-0" size={20} strokeWidth={2.5} />
          )}
          <p className={cn('text-sm font-bold flex-1', type === 'success' ? 'text-success-900' : 'text-error-900')}>
            {message}
          </p>
        </div>
        <button
          onClick={onClose}
          className={cn(
            'ml-3 p-1 rounded-lg transition-colors flex-shrink-0',
            type === 'success' 
              ? 'text-success-700 hover:bg-success-100' 
              : 'text-error-700 hover:bg-error-100'
          )}
        >
          <X size={18} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  )
}
