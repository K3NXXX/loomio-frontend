'use client'

import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { useGetMe } from '@/hooks/auth/useGetMe'
import { useGetReport } from '@/hooks/report/useGetReport'
import { ReportContent } from './ReportContent'
import { ReportFooter } from './ReportFooter'
import { ReportHeader } from './ReportHeader'

interface Props {
	id: string | null
	open: boolean
	onOpenChange: (v: boolean) => void
}

export function ReportCommentDetailsModal({ id, open, onOpenChange }: Props) {
	const { data: report } = useGetReport(id)
	const { userData } = useGetMe()

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent
				className='
					!max-w-[1000px]
					w-[90vw]
					min-h-[85vh]
					p-0 rounded-xl overflow-hidden
					bg-background border border-border/40 shadow-2xl
				'
			>
				<DialogTitle></DialogTitle>
				{report && (
					<>
						<ReportHeader report={report} userData={userData} />
						<ReportContent report={report} />
						<ReportFooter
							report={report}
							userData={userData}
							onOpenChange={onOpenChange}
						/>
					</>
				)}
			</DialogContent>
		</Dialog>
	)
}
