import { reportService } from '@/services/report.service'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export const useApproveReport = (reportId: string | undefined) => {
	const queryClient = useQueryClient()

	const { mutate: approveReport, isPending } = useMutation({
		mutationFn: () => reportService.approveReport(reportId!),

		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['report', reportId] })
			queryClient.invalidateQueries({ queryKey: ['commentReports'] })
			queryClient.invalidateQueries({ queryKey: ['videoReports'] })
		},

		onError: (err: any) => {
			const msg =
				err?.response?.data?.message || err?.message || 'Failed to approve'
			toast.error(msg)
		},
	})

	return { approveReport, isPending }
}
