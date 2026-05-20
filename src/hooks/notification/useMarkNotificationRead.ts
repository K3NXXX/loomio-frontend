import { notificationService } from '@/services/notification.service'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'

export const useMarkNotificationRead = () => {
	const queryClient = useQueryClient()
	const t = useTranslations('toast')

	const { mutate: markRead, isPending: loading } = useMutation({
		mutationKey: ['markOneNotificationRead'],
		mutationFn: (id: string) => notificationService.markOneRead(id),

		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['getNotifications'] })
		},

		onError: () => {
			toast.error(t('markNotificationReadFailed'))
		},
	})

	return { markRead, loading }
}
