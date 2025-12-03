import { reportService } from '@/services/report.service'
import { useQuery } from '@tanstack/react-query'

export const useGetCommentReports = () => {
	const {
		data: commentReports,
		isLoading,
		isError,
		refetch,
	} = useQuery({
		queryKey: ['commentReports'],
		queryFn: () => reportService.getCommentReports(),
	})

	return { commentReports, isLoading, isError, refetch }
}
