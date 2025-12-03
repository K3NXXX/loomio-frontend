import { reportService } from '@/services/report.service'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export const useDeleteCommentReport = (reportId: string | undefined) => {
	const queryClient = useQueryClient()

	const { mutate: deleteCommentReport, isPending } = useMutation({
		mutationKey: ['deleteCommentReport'],

		mutationFn: () => reportService.deleteComment(reportId!), // 🔥 тут reportId

		onSuccess: () => {
			toast.success('Comment deleted successfully')

			queryClient.invalidateQueries({ queryKey: ['report', reportId] })
			queryClient.invalidateQueries({ queryKey: ['commentReports'] })
			queryClient.invalidateQueries({ queryKey: ['videoReports'] })
		},

		onError: (error: any) => {
			const msg =
				error?.response?.data?.message ||
				error?.message ||
				'Failed to delete comment'

			toast.error(Array.isArray(msg) ? msg[0] : msg)
		},
	})

	return { deleteCommentReport, isPending }
}
