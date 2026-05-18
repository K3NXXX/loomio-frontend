import { channelService } from '@/services/channel.service'
import type { IChannel } from '@/types/channel.types'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

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

	const status = axios.isAxiosError(query.error)
		? query.error.response?.status
		: undefined

	return {
		channel: query.data,
		isLoading: query.isPending,
		isError: query.isError,
		isForbidden: query.isError && status === 403,
		isUnauthorized: query.isError && status === 401,
		refetch: query.refetch,
	}
}
