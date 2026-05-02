'use client'

import { ModerationReportModalHeader } from '@/components/admin/moderation-report/ModerationReportModalHeader'
import type { IGetUserData } from '@/types/auth.types'
import type { IReportItem } from '@/types/report.types'

interface IReportHeaderProps {
	report: IReportItem
	userData?: IGetUserData
}

export function ReportHeader({ report, userData }: IReportHeaderProps) {
	return (
		<ModerationReportModalHeader kind='video' report={report} userData={userData} />
	)
}
