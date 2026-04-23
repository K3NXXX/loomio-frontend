import { reportService } from '@/services/report.service'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export const useRequestReview = () => {
	const queryClient = useQueryClient()

	const { mutate: requestReview, isPending } = useMutation({
		mutationFn: ({ videoId, data }: { videoId: string; data: FormData }) =>
			reportService.requestReview(videoId, data),

		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['videoHistory'] })
		},

		onError: (error: any) => {
			const msg =
				error?.response?.data?.message ||
				error?.message ||
				'Failed to request review'
			toast.error(Array.isArray(msg) ? msg[0] : msg)
		},
	})

	return { requestReview, isPending }
}
