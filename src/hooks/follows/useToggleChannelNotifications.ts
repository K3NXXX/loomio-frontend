import { followService } from '@/services/follow.service'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export const useToggleChannelNotifications = () => {
	const queryClient = useQueryClient()

	const { mutate: toggleChannelNotifications } = useMutation({
		mutationKey: ['toggleChannelNotifications'],

		mutationFn: (channelId: string) =>
			followService.toggleChannelNotifications(channelId),

		onSuccess: () => {
			toast.success('Notification settings updated')
			queryClient.invalidateQueries({
				queryKey: ['channelNotificationsStatus'],
			})
		},

		onError: () => {
			toast.error('Failed to update notifications')
		},
	})

	return { toggleChannelNotifications }
}
