'use client'

import { moderationReportModalContentClass } from '@/components/admin/moderation-report/moderationModalShell'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { useGetMe } from '@/hooks/auth/useGetMe'
import { useGetReport } from '@/hooks/report/useGetReport'
import { useTranslations } from 'next-intl'
import { ReportContent } from './ReportContent'
import { ReportFooter } from './ReportFooter'
import { ReportHeader } from './ReportHeader'

interface Props {
	id: string | null
	open: boolean
	onOpenChange: (v: boolean) => void
}

export function ReportVideoReviewsModal({ id, open, onOpenChange }: Props) {
	const { data: report } = useGetReport(id)
	const { userData } = useGetMe()
	const t = useTranslations('moderation.modals')

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className={moderationReportModalContentClass}>
				<DialogTitle className='sr-only'>{t('headers.videoReview')}</DialogTitle>
				{report ? (
					<div className='flex min-h-0 flex-1 flex-col'>
						<ReportHeader report={report} userData={userData} />
						<ReportContent report={report} />
						<ReportFooter
							report={report}
							userData={userData}
							onOpenChange={() => onOpenChange(false)}
						/>
					</div>
				) : null}
			</DialogContent>
		</Dialog>
	)
}
