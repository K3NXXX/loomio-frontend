import { reportService } from '@/services/report.service'
import type { IReportStats } from '@/types/report.types'
import { useQuery } from '@tanstack/react-query'

export const useReportStats = () => {
	return useQuery<IReportStats>({
		queryKey: ['report-stats'],
		queryFn: () => reportService.getStats(),
	})
}
