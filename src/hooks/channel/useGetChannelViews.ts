import { channelService } from '@/services/channel.service'
import { useQuery } from '@tanstack/react-query'

export const useGetChannelViews = (username?: string) => {
	const { data, isError } = useQuery({
		queryKey: ['getChannelViews', username],
		queryFn: () => channelService.getChannelViews(username!),
		enabled: !!username,
	})

	return {
		totalViews: data?.totalViews ?? 0,
		isError,
	}
}
