'use client'

import {
	ModerationSidebarMetaBlock,
	ModerationSidebarUserBlock,
} from '@/components/admin/moderation-report/ModerationSidebarBlocks'
import { getDateLocaleTag } from '@/utils/date-locale'
import { useLocale, useTranslations } from 'next-intl'

export function RightSidebar({ report }: any) {
	const tLabels = useTranslations('moderation.modals.labels')
	const locale = useLocale()
	const dateLocale = getDateLocaleTag(locale)

	return (
		<div
			className='
				min-h-0 space-y-5 overflow-y-auto border-l border-border/50 
				bg-gradient-to-b from-muted/25 via-muted/10 to-background/90 
				p-6 md:p-8 
				backdrop-blur-md
			'
		>
			<ModerationSidebarUserBlock
				label={tLabels('assignedTo')}
				user={report.assignedTo}
				noneText={tLabels('none')}
			/>
			<ModerationSidebarUserBlock
				label={tLabels('videoAuthor')}
				user={report.video?.channel}
				noneText={tLabels('none')}
			/>
			<ModerationSidebarUserBlock
				label={tLabels('reportedBy')}
				user={report.author}
				noneText={tLabels('none')}
			/>

			<ModerationSidebarMetaBlock
				label={tLabels('reportedAt')}
				value={new Date(report.createdAt).toLocaleString(dateLocale)}
			/>
		</div>
	)
}
