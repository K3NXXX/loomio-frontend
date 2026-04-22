import { playlistService } from '@/services/playlist.service'
import type { IPlaylist } from '@/types/playlist.types'
import { useQuery } from '@tanstack/react-query'

export const useGetChannelPlaylists = (channelId?: string) => {
	const {
		data: channelPlaylists,
		isLoading,
		refetch,
		isError,
	} = useQuery<IPlaylist[]>({
		queryKey: ['getChannelPlaylists', channelId],
		queryFn: () => playlistService.getChannelPlaylists(channelId!),
		enabled: !!channelId,
	})

	return { channelPlaylists, isLoading, refetch, isError }
}
