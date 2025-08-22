import React from 'react'
import { cn } from '@quantinuum/quantinuum-ui'

const SectionTitle = React.forwardRef<
HTMLHeadingElement,
React.InputHTMLAttributes<HTMLParagraphElement>
>(({ className, type, ...props }, ref) => {
return (
  <h1
    className={cn('text-5xl font-semibold tracking-tighter', className)}
    ref={ref}
  >
    {props.children}
  </h1>
)
})
SectionTitle.displayName = 'SectionTitle'