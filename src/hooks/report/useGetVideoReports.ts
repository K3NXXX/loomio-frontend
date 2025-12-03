import { reportService } from '@/services/report.service'
import { useQuery } from '@tanstack/react-query'

export const useGetVideoReports = () => {
	const {
		data: videoReports,
		isLoading,
		isError,
		refetch,
	} = useQuery({
		queryKey: ['videoReports'],
		queryFn: () => reportService.getVideoReports(),
	})

	return { videoReports, isLoading, isError, refetch }
}
