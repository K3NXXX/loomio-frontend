import { followService } from '@/services/follow.service'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'

export const useToggleChannelNotifications = () => {
	const queryClient = useQueryClient()
	const t = useTranslations('toast')

	const { mutate: toggleChannelNotifications } = useMutation({
		mutationKey: ['toggleChannelNotifications'],

		mutationFn: (channelId: string) =>
			followService.toggleChannelNotifications(channelId),

		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['channelNotificationsStatus'],
			})
		},

		onError: () => {
			toast.error(t('updateNotificationsFailed'))
		},
	})

	return { toggleChannelNotifications }
}
