'use client'

import { reportService } from '@/services/report.service'
import { useMutation } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'

export const useConfirmReviewVideo = () => {
	const t = useTranslations('moderation.videoReviews')

	const { mutate: confirmReview, isPending } = useMutation({
		mutationKey: ['confirmReviewVideo'],
		mutationFn: (reportId: string) =>
			reportService.confirmVideoReview(reportId),

		onSuccess: () => toast.success(t('toastApproveSuccess')),

		onError: (error: any) => {
			const message =
				error?.response?.data?.message ||
				error?.message ||
				t('toastApproveErrorFallback')

			toast.error(Array.isArray(message) ? message[0] : message)
		},
	})

	return { confirmReview, isPending }
}
