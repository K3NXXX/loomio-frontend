import { reportService } from '@/services/report.service'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

export const useReportVideo = () => {
	const { mutate: reportVideo, isPending } = useMutation({
		mutationKey: ['reportVideo'],
		mutationFn: (data: {
			videoId: string
			reason: string
			message?: string | null
		}) => reportService.reportVideo(data),

		onError: (error: any) => {
			const message =
				error?.response?.data?.message ||
				error?.message ||
				'Failed to send report'

			const finalMessage = Array.isArray(message) ? message[0] : message
			toast.error(finalMessage)
		},
	})

	return { reportVideo, isPending }
}
