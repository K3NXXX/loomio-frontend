import { reportService } from '@/services/report.service'
import { useQuery } from '@tanstack/react-query'

export const useGetCommentHistory = () => {
	const { data, isLoading, error } = useQuery({
		queryKey: ['commentHistory'],
		queryFn: () => reportService.getCommentHistory(),
	})

	return {
		commentHistory: data,
		isLoading,
		error,
	}
}
