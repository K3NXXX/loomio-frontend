import { notificationService } from '@/services/notification.service'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'

export const useMarkAllChannelRead = (onDone?: () => void) => {
	const queryClient = useQueryClient()
	const t = useTranslations('toast')

	const { mutate: markAllChannelRead } = useMutation({
		mutationKey: ['markAllChannelRead'],
		mutationFn: (channelId: string) =>
			notificationService.markAllChannelRead(channelId),

		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['getNotifications'] })
			onDone?.()
		},

		onError: () => {
			toast.error(t('genericErrorLater'))
		},
	})

	return { markAllChannelRead }
}
