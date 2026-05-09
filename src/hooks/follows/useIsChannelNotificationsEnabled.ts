import { useGetMe } from '@/hooks/auth/useGetMe'
import { followService } from '@/services/follow.service'
import { useQuery } from '@tanstack/react-query'

export const useIsChannelNotificationsEnabled = (channelId: string) => {
	const { userData } = useGetMe()

	const { data, isLoading, isError } = useQuery<boolean>({
		queryKey: ['channelNotificationsStatus', channelId],
		queryFn: () => followService.getChannelNotificationsStatus(channelId),
		enabled: Boolean(channelId && userData),
	})

	return {
		isNotificationsEnabled: data ?? false,
		isLoading,
		isError,
	}
}
