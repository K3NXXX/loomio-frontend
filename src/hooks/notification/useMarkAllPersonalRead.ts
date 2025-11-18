import { notificationService } from '@/services/notification.service'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export const useMarkAllPersonalRead = (onDone?: () => void) => {
	const queryClient = useQueryClient()

	const { mutate: markAllPersonalRead } = useMutation({
		mutationKey: ['markAllPersonalRead'],
		mutationFn: () => notificationService.markAllPersonalRead(),

		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['getNotifications'] })
			onDone?.()
		},

		onError: () => {
			toast.error('Something went wrong. Try again later')
		},
	})

	return { markAllPersonalRead }
}
