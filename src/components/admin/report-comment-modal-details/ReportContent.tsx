'use client'

import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { RightSidebar } from './RightSidebar'

export function ReportContent({ report }: any) {
	const isDeleted = !report.comment || !report.comment.content

	return (
		<div className='grid grid-cols-[1fr_360px] h-full'>
			<div className='p-8 space-y-8 overflow-y-auto'>
				<div className='space-y-2'>
					<div className='text-xs uppercase tracking-wide text-muted-foreground font-semibold'>
						Comment
					</div>

					<div
						className={cn(
							'bg-muted/10 p-4 rounded-lg border border-border/20 shadow-sm',
							'text-[15px] leading-[1.7]',
							'max-h-[220px] overflow-y-auto scrollbar-thin',
							isDeleted ? 'text-muted-foreground italic' : 'text-foreground',
						)}
					>
						{isDeleted ? 'Comment was deleted' : report.comment.content}
					</div>
				</div>

				{report.message && (
					<div className='space-y-2'>
						<div className='text-xs uppercase tracking-wide text-muted-foreground font-semibold'>
							Reporter Note
						</div>
						<div className='bg-muted/5 p-4 rounded-lg border border-border/20 text-[14px] leading-[1.6] text-muted-foreground'>
							{report.message}
						</div>
					</div>
				)}

				<div className='space-y-2'>
					<div className='text-xs uppercase tracking-wide text-muted-foreground font-semibold'>
						Reason
					</div>

					<Badge
						variant='outline'
						className={cn(
							'px-3 py-1 rounded-full text-[12px] font-medium',
							report.reason === 'HATE_SPEECH' &&
								'border-red-400/60 text-red-400',
							report.reason === 'SPAM' && 'border-blue-400/60 text-blue-400',
						)}
					>
						{report.reason.replace('_', ' ')}
					</Badge>
				</div>
			</div>

			<RightSidebar report={report} />
		</div>
	)
}
