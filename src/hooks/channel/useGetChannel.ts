import { channelService } from '@/services/channel.service'
import type { IChannel } from '@/types/channel.types'
import { useQuery } from '@tanstack/react-query'

export const useGetChannel = (username: string) => {
	const {
		data: channel,
		isError,
		isLoading,
	} = useQuery<IChannel>({
		queryKey: ['getChannel'],
		queryFn: () => channelService.getChannel(username),
	})

	return { channel, isLoading, isError }
}
