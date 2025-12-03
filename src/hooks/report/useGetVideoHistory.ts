import { reportService } from '@/services/report.service'
import { useQuery } from '@tanstack/react-query'

export const useGetVideoHistory = () => {
	const { data, isLoading, error } = useQuery({
		queryKey: ['videoHistory'],
		queryFn: () => reportService.getVideoHistory(),
	})

	return {
		videoHistory: data,
		isLoading,
		error,
	}
}
