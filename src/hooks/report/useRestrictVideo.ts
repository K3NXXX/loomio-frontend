import { reportService } from '@/services/report.service'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export const useRestrictVideo = (reportId: string) => {
	const queryClient = useQueryClient()

	const { mutate: restrictVideo, isPending } = useMutation({
		mutationKey: ['restrictVideo', reportId],
		mutationFn: () => reportService.restrictVideo(reportId),

		onSuccess: () => {
			toast.success('Video has been restricted')

			queryClient.invalidateQueries({
				queryKey: ['videoReports'],
			})
			queryClient.invalidateQueries({
				queryKey: ['videoHistory'],
			})
		},

		onError: (error: any) => {
			const message =
				error?.response?.data?.message ||
				error?.message ||
				'Failed to restrict video'

			toast.error(Array.isArray(message) ? message[0] : message)
		},
	})

	return { restrictVideo, isPending }
}
