import { reportService } from '@/services/report.service'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

export const useConfirmReviewVideo = () => {
	const { mutate: confirmReview, isPending } = useMutation({
		mutationKey: ['confirmReviewVideo'],
		mutationFn: (reportId: string) =>
			reportService.confirmVideoReview(reportId),

		onSuccess: () => toast.success('Video review approved — now public!'),

		onError: (error: any) => {
			const message =
				error?.response?.data?.message ||
				error?.message ||
				'Failed to approve review'

			toast.error(Array.isArray(message) ? message[0] : message)
		},
	})

	return { confirmReview, isPending }
}
