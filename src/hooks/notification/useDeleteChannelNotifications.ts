import { notificationService } from '@/services/notification.service'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'

export const useDeleteChannelNotifications = (onDone?: () => void) => {
	const queryClient = useQueryClient()
	const t = useTranslations('toast')

	const { mutate: deleteChannelNotifications } = useMutation({
		mutationKey: ['deleteChannelNotifications'],
		mutationFn: (channelId: string) =>
			notificationService.deleteAllForChannel(channelId),

		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['getNotifications'] })
			onDone?.()
		},

		onError: () => {
			toast.error(t('genericErrorLater'))
		},
	})

	return { deleteChannelNotifications }
}
