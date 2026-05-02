'use client'

import { ModerationVideoReportMainColumn } from '@/components/admin/moderation-report/ModerationVideoReportMainColumn'
import { RightSidebar } from './RightSidebar'

export function ReportContent({ report }: any) {
	return (
		<div className='grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[1fr_340px] xl:grid-cols-[1fr_360px]'>
			<div className='min-h-0 overflow-y-auto p-6 md:p-8'>
				<ModerationVideoReportMainColumn report={report} />
			</div>

			<RightSidebar report={report} />
		</div>
	)
}
