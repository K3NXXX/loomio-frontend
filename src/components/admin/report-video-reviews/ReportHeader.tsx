'use client'

import { Button } from '@/components/ui/button'
import { useAssignReport } from '@/hooks/report/useAssignReport'
import type { IGetUserData } from '@/types/auth.types'
import type { IReportItem } from '@/types/report.types'

interface IReportHeaderProps {
	report: IReportItem
	userData?: IGetUserData
}

export function ReportHeader({ report, userData }: IReportHeaderProps) {
	const { assignReport } = useAssignReport(report.id)

	const isMine = report.assignedToId === userData?.id
	const isFree = report.assignedToId === null
	const isTaken = report.assignedToId !== null && !isMine

	return (
		<div
			className='
				flex items-center justify-between
				px-12 py-6 
				border-b border-border/30 
				bg-muted/10
			'
		>
			<span className='text-[22px] font-semibold tracking-tight'>
				Report Review Details
			</span>

			{report.status !== 'RESOLVED' && isFree && (
				<Button
					onClick={() => assignReport()}
					className='bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 h-9'
				>
					Assign to me
				</Button>
			)}

			{report.status !== 'RESOLVED' && isMine && (
				<Button
					onClick={() => assignReport()}
					className='bg-emerald-700 text-white px-4 py-2 h-9'
				>
					Unassign
				</Button>
			)}

			{isTaken && report.assignedTo && (
				<Button
					disabled
					className='bg-muted text-muted-foreground px-4 py-2 h-9'
				>
					Assigned to @{report.assignedTo.username}
				</Button>
			)}
		</div>
	)
}
