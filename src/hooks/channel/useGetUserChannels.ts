import { channelService } from '@/services/channel.service'
import type { IChannel } from '@/types/channel.types'
import { useQuery } from '@tanstack/react-query'

export const useGetUserChannels = (options?: { enabled?: boolean }) => {
	const enabled = options?.enabled ?? true

	const {
		data: userChannels,
		isError,
		isLoading,
	} = useQuery<IChannel[]>({
		queryKey: ['getUserChannels'],
		queryFn: () => channelService.getUserChannels(),
		enabled,
	})

	return { userChannels, isLoading, isError }
}
