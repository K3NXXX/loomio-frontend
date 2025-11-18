import { notificationService } from '@/services/notification.service'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export const useDeletePersonalNotifications = (onDone?: () => void) => {
	const queryClient = useQueryClient()

	const { mutate: deletePersonalNotifications } = useMutation({
		mutationKey: ['deletePersonalNotifications'],
		mutationFn: () => notificationService.deletePersonal(),

		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['getNotifications'] })
			onDone?.()
		},

		onError: () => {
			toast.error('Something went wrong. Try again later')
		},
	})

	return { deletePersonalNotifications }
}
