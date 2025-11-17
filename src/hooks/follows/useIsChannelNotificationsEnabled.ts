import { followService } from '@/services/follow.service'
import { useQuery } from '@tanstack/react-query'

export const useIsChannelNotificationsEnabled = (channelId: string) => {
	const { data, isLoading, isError } = useQuery<boolean>({
		queryKey: ['channelNotificationsStatus', channelId],
		queryFn: () => followService.getChannelNotificationsStatus(channelId),
		enabled: !!channelId,
	})

	return {
		isNotificationsEnabled: data ?? false,
		isLoading,
		isError,
	}
}
