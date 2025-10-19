import { channelService } from '@/services/channel.service'
import type { IChannel } from '@/types/channel.types'
import { useQuery } from '@tanstack/react-query'

export const useGetUserChannels = () => {
	const {
		data: userChannels,
		isError,
		isLoading,
	} = useQuery<IChannel[]>({
		queryKey: ['getUserChannels'],
		queryFn: () => channelService.getUserChannels(),
	})

	return { userChannels, isLoading, isError }
}
