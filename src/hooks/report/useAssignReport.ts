import { reportService } from '@/services/report.service'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export const useAssignReport = (reportId?: string) => {
	const queryClient = useQueryClient()

	const { mutate: assignReport, isPending } = useMutation({
		mutationKey: ['assignReport', reportId],

		mutationFn: () => reportService.assignReport(reportId!),

		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['report', reportId] })
			queryClient.invalidateQueries({ queryKey: ['commentReports'] })
			queryClient.invalidateQueries({ queryKey: ['videoReports'] })
		},

		onError: (error: any) => {
			const msg =
				error?.response?.data?.message ||
				error?.message ||
				'Failed to assign report'

			toast.error(Array.isArray(msg) ? msg[0] : msg)
		},
	})

	return { assignReport, isPending }
}
