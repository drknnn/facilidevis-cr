import * as React from 'react'
import { cn } from '@/lib/utils'

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  helperText?: string
  containerClassName?: string
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, helperText, containerClassName, ...props }, ref) => {
    return (
      <div className={cn('w-full space-y-2', containerClassName)}>
        {label && (
          <label className="block text-sm font-semibold text-gray-900">
            {label}
          </label>
        )}
        <textarea
          className={cn(
            'input-base min-h-[100px] resize-none',
            error 
              ? 'border-error-500 focus:border-error-500 focus:ring-error-500/20' 
              : '',
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="text-sm font-medium text-error-600 flex items-center gap-1.5">
            <span className="text-error-500">⚠</span>
            {error}
          </p>
        )}
        {helperText && !error && (
          <p className="text-xs text-gray-500">{helperText}</p>
        )}
      </div>
    )
  }
)
Textarea.displayName = 'Textarea'

export { Textarea }
