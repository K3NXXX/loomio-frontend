import { reportService } from '@/services/report.service'
import type { IReportItem } from '@/types/report.types'
import { useQuery } from '@tanstack/react-query'

export const useGetReport = (id: string | null) => {
	return useQuery<IReportItem>({
		queryKey: ['report', id],
		queryFn: () => reportService.getReport(id!),
		enabled: !!id,
	})
}
