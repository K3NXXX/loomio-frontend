import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export function ModerationReportPanel({
	label,
	children,
	className,
	contentClassName,
}: {
	label: string
	children: ReactNode
	className?: string
	contentClassName?: string
}) {
	return (
		<div className={cn('space-y-3', className)}>
			<div className='text-[11px] uppercase tracking-wider text-muted-foreground font-semibold'>
				{label}
			</div>
			<div
				className={cn(
					'rounded-2xl border border-border/50 bg-card/55 p-4 md:p-5 shadow-sm',
					'ring-1 ring-border/40',
					contentClassName,
				)}
			>
				{children}
			</div>
		</div>
	)
}
