import { channelService } from '@/services/channel.service'
import type { IChannel } from '@/types/channel.types'
import { useQuery } from '@tanstack/react-query'

export type GetChannelScope = 'full' | 'studio'

export const useGetChannel = (
	username: string,
	opts?: { scope?: 'studio' },
) => {
	const scope: GetChannelScope = opts?.scope ?? 'full'

	const query = useQuery<IChannel>({
		queryKey: ['getChannel', username, scope],
		queryFn: () =>
			scope === 'studio'
				? channelService.getChannel(username, { scope: 'studio' })
				: channelService.getChannel(username),
		enabled: Boolean(username),
		staleTime: scope === 'studio' ? 60_000 : 0,
	})

	return {
		channel: query.data,
		isLoading: query.isPending,
		isError: query.isError,
		refetch: query.refetch,
	}
}
