import { notificationService } from '@/services/notification.service'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export const useDeleteChannelNotifications = () => {
	const queryClient = useQueryClient()

	const { mutate: deleteChannelNotifications } = useMutation({
		mutationKey: ['deleteChannelNotifications'],
		mutationFn: (channelId: string) =>
			notificationService.deleteAllForChannel(channelId),

		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['getNotifications'] })
		},

		onError: () => {
			toast.error('Something went wrong. Try again later')
		},
	})

	return { deleteChannelNotifications }
}
