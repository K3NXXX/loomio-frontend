'use client'

import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { IReportItem } from '@/types/report.types'
import { getPriorModerationRestriction } from '@/utils/getPriorModerationRestriction'
import { useTranslations } from 'next-intl'
import { HiOutlineShieldExclamation } from 'react-icons/hi2'

export function PriorRestrictionSidebarCard({
	report,
}: {
	report: IReportItem | Record<string, unknown>
}) {
	const tLabels = useTranslations('moderation.modals.labels')
	const tReason = useTranslations('moderation.enums.reason')
	const { reason: priorReason, note: priorNote } =
		getPriorModerationRestriction(report as IReportItem)

	if (!priorReason && !priorNote) return null

	return (
		<div className='rounded-2xl border border-amber-500/20 bg-gradient-to-b from-amber-500/[0.07] to-transparent p-4 shadow-[0_0_0_1px_rgba(0,0,0,0.03)_inset] space-y-4'>
			<div className='flex gap-2.5'>
				<div className='flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 ring-1 ring-amber-500/20'>
					<HiOutlineShieldExclamation className='size-5' aria-hidden />
				</div>
				<div className='min-w-0 space-y-1 pt-0.5'>
					<p className='text-[11px] font-semibold uppercase tracking-wide text-amber-700/90 dark:text-amber-400/90'>
						{tLabels('priorRestrictionCardTitle')}
					</p>
					<p className='text-[12px] leading-snug text-muted-foreground'>
						{tLabels('priorRestrictionHint')}
					</p>
				</div>
			</div>

			<div className='h-px w-full bg-border/40' />

			{priorReason ? (
				<div className='space-y-2'>
					<div className='text-[10px] uppercase tracking-wide text-muted-foreground/80 font-semibold'>
						{tLabels('priorRestrictionReason')}
					</div>
					<Badge
						variant='outline'
						className={cn(
							'rounded-full px-3 py-1 text-[11px] font-medium',
							priorReason === 'HATE_SPEECH' &&
								'border-red-400/55 text-red-500 bg-red-500/10',
							priorReason === 'SPAM' &&
								'border-blue-400/55 text-blue-500 bg-blue-500/10',
							priorReason !== 'HATE_SPEECH' &&
								priorReason !== 'SPAM' &&
								'border-red-500/40 text-red-600 dark:text-red-400 bg-red-500/10',
						)}
					>
						{tReason(priorReason)}
					</Badge>
				</div>
			) : null}

			{priorNote ? (
				<div className='space-y-2'>
					<div className='text-[10px] uppercase tracking-wide text-muted-foreground/80 font-semibold'>
						{tLabels('priorModeratorComment')}
					</div>
					<div className='rounded-xl border border-border/50 bg-background/60 px-3 py-2.5 text-[13px] leading-relaxed text-muted-foreground whitespace-pre-wrap shadow-sm'>
						{priorNote}
					</div>
				</div>
			) : null}
		</div>
	)
}
