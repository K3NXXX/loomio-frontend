import { notificationService } from '@/services/notification.service'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'

export const useMarkAllPersonalRead = (onDone?: () => void) => {
	const queryClient = useQueryClient()
	const t = useTranslations('toast')

	const { mutate: markAllPersonalRead } = useMutation({
		mutationKey: ['markAllPersonalRead'],
		mutationFn: () => notificationService.markAllPersonalRead(),

		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['getNotifications'] })
			onDone?.()
		},

		onError: () => {
			toast.error(t('genericErrorLater'))
		},
	})

	return { markAllPersonalRead }
}
