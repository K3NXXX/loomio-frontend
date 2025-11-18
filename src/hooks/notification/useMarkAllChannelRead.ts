import { notificationService } from '@/services/notification.service'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export const useMarkAllChannelRead = (onDone?: () => void) => {
	const queryClient = useQueryClient()

	const { mutate: markAllChannelRead } = useMutation({
		mutationKey: ['markAllChannelRead'],
		mutationFn: (channelId: string) =>
			notificationService.markAllChannelRead(channelId),

		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['getNotifications'] })
			onDone?.()
		},

		onError: () => {
			toast.error('Something went wrong. Try again later')
		},
	})

	return { markAllChannelRead }
}
