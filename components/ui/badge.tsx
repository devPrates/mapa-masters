import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-wider',
  {
    variants: {
      variant: {
        navy: 'border-ccd-navy/15 bg-ccd-navy/5 text-ccd-navy',
        teal: 'border-ccd-teal/20 bg-ccd-teal/10 text-ccd-teal',
        gold: 'border-ccd-gold/25 bg-ccd-gold/10 text-ccd-gold',
        inverted: 'border-white/15 bg-white/10 text-white',
      },
    },
    defaultVariants: {
      variant: 'navy',
    },
  },
)

interface BadgeProps
  extends React.ComponentProps<'span'>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span
      data-slot="badge"
      className={cn(badgeVariants({ variant, className }))}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
