import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center justify-center rounded-full border font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary-500 text-white',
        secondary: 'border-transparent bg-gray-100 text-gray-900',
        outline: 'border-gray-300 text-gray-900 bg-transparent',
        draft: 'border-gray-200 bg-gray-50 text-gray-700',
        sent: 'border-primary-200 bg-primary-50 text-primary-700',
        viewed: 'border-primary-300 bg-primary-100 text-primary-800',
        reminded: 'border-warning-200 bg-warning-50 text-warning-700',
        accepted: 'border-success-200 bg-success-50 text-success-700',
        refused: 'border-error-200 bg-error-50 text-error-700',
      },
      size: {
        sm: 'px-2.5 py-1 text-xs',
        default: 'px-3 py-1.5 text-sm',
        lg: 'px-4 py-2 text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  status?: 'draft' | 'sent' | 'viewed' | 'reminded' | 'accepted' | 'refused'
}

function Badge({ className, variant, size, status, ...props }: BadgeProps) {
  // Si status est fourni, utiliser le variant correspondant
  const finalVariant = status || variant || 'default'

  return (
    <div
      className={cn(badgeVariants({ variant: finalVariant, size, className }))}
      {...props}
    />
  )
}

// Helper pour obtenir le label du statut
export function getStatusLabel(status: 'draft' | 'sent' | 'viewed' | 'reminded' | 'accepted' | 'refused'): string {
  const labels = {
    draft: 'Brouillon',
    sent: 'Envoyé',
    viewed: 'Vu',
    reminded: 'Relancé',
    accepted: 'Accepté',
    refused: 'Refusé',
  }
  return labels[status]
}

export { Badge, badgeVariants }
