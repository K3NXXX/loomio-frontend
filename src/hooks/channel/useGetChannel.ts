import { channelService } from '@/services/channel.service'
import type { IChannel } from '@/types/channel.types'
import { useQuery } from '@tanstack/react-query'

export const useGetChannel = (username: string) => {
	const {
		data: channel,
		isError,
		isLoading,
	} = useQuery<IChannel>({
		queryKey: ['getChannel', username],
		queryFn: () => channelService.getChannel(username),
		enabled: Boolean(username),
	})

	return { channel, isLoading, isError }
}
