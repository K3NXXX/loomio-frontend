import { reportService } from '@/services/report.service'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

export const useReportComment = () => {
	const { mutate: reportComment, isPending } = useMutation({
		mutationKey: ['reportComment'],
		mutationFn: (data: {
			commentId: string
			reason: string
			message?: string | null
		}) => reportService.reportComment(data),

		onError: (error: any) => {
			const message =
				error?.response?.data?.message ||
				error?.message ||
				'Failed to send report'

			const finalMessage = Array.isArray(message) ? message[0] : message
			toast.error(finalMessage)
		},
	})

	return { reportComment, isPending }
}
