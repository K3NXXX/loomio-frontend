import { useGetMe } from '@/hooks/auth/useGetMe'
import { notificationService } from '@/services/notification.service'
import type { INotification } from '@/types/notification.types'
import { useQuery } from '@tanstack/react-query'

export const useGetNotifications = () => {
	const { userData } = useGetMe()

	const { data, isError, isLoading } = useQuery<INotification>({
		queryKey: ['getNotifications'],
		queryFn: () => notificationService.getNotifications(),
		enabled: Boolean(userData),
	})
 
	return {
		notifications: data?.notifications ?? [],
		unreadCount: data?.unreadCount ?? 0,
		isLoading,
		isError,
	}
}
