import { notificationService } from '@/services/notification.service'
import { PERSONAL_ACTIVITY_NOTIFICATION_TYPES } from '@/types/notification.types'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'

async function deletePersonalActivityOrphans(): Promise<void> {
	const { notifications } = await notificationService.getNotifications()
	const orphanIds = notifications
		.filter((n) => PERSONAL_ACTIVITY_NOTIFICATION_TYPES.includes(n.type))
		.map((n) => n.id)
	await Promise.allSettled(
		orphanIds.map((id) => notificationService.deleteNotification(id)),
	)
}

export const useDeletePersonalNotifications = (onDone?: () => void) => {
	const queryClient = useQueryClient()
	const t = useTranslations('toast')

	const { mutate: deletePersonalNotifications } = useMutation({
		mutationKey: ['deletePersonalNotifications'],
		mutationFn: async () => {
			await notificationService.deletePersonal()
			await deletePersonalActivityOrphans()
		},

		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['getNotifications'] })
			onDone?.()
		},

		onError: () => {
			toast.error(t('genericErrorLater'))
		},
	})

	return { deletePersonalNotifications }
}
