import { userService } from '@/services/user.service'
import type { IChannel } from '@/types/channel.types'
import { useQuery } from '@tanstack/react-query'

export const useGetFollowedChannels = () => {
	const {
		data: followedChannels,
		isLoading,
		isError,
	} = useQuery<IChannel[]>({
		queryKey: ['getFollowedChannels'],
		queryFn: () => userService.getFollowedChannels(),
	})

	return { followedChannels, isLoading, isError }
}
