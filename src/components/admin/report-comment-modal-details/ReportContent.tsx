'use client'

import { Badge } from '@/components/ui/badge'
import { ModerationReportPanel } from '@/components/admin/moderation-report/ModerationReportPanel'
import { reportReasonBadgeClass } from '@/components/admin/moderation-report/reportReasonBadgeClass'
import { cn } from '@/lib/utils'
import { useTranslations } from 'next-intl'
import { RightSidebar } from './RightSidebar'

export function ReportContent({ report }: any) {
	const tLabels = useTranslations('moderation.modals.labels')
	const tReason = useTranslations('moderation.enums.reason')
	const tModals = useTranslations('moderation.modals')

	const isDeleted = !report.comment || !report.comment.content

	return (
		<div className='grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[1fr_340px] xl:grid-cols-[1fr_360px]'>
			<div className='min-h-0 space-y-7 overflow-y-auto p-6 md:p-8'>
				<ModerationReportPanel label={tLabels('comment')}>
					<div
						className={cn(
							'text-[15px] leading-[1.7]',
							'max-h-[240px] overflow-y-auto pr-1 scrollbar-thin',
							isDeleted ? 'text-muted-foreground italic' : 'text-foreground',
						)}
					>
						{isDeleted ? tModals('commentDeleted') : report.comment.content}
					</div>
				</ModerationReportPanel>

				{report.message ? (
					<ModerationReportPanel label={tLabels('reporterNote')}>
						<p className='text-[14px] leading-relaxed text-muted-foreground whitespace-pre-wrap'>
							{report.message}
						</p>
					</ModerationReportPanel>
				) : null}

				<div className='space-y-3'>
					<div className='text-[11px] uppercase tracking-wider text-muted-foreground font-semibold'>
						{tLabels('reason')}
					</div>
					<Badge variant='outline' className={reportReasonBadgeClass(report.reason)}>
						{tReason(report.reason)}
					</Badge>
				</div>
			</div>

			<RightSidebar report={report} />
		</div>
	)
}
