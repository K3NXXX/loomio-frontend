import { notificationService } from '@/services/notification.service'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export const useMarkNotificationRead = () => {
	const queryClient = useQueryClient()

	const { mutate: markRead, isPending: loading } = useMutation({
		mutationKey: ['markOneNotificationRead'],
		mutationFn: (id: string) => notificationService.markOneRead(id),

		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['getNotifications'] })
		},

		onError: () => {
			toast.error('Failed to mark notification as read')
		},
	})

	return { markRead, loading }
}
