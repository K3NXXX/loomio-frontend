import { playlistService } from '@/services/playlist.service'
import { useQuery } from '@tanstack/react-query'

export const useGetOneChannelPlaylist = (playlistId: string) => {
	const {
		data: playlist,
		isLoading,
		isError,
	} = useQuery({
		queryKey: ['channel-playlist', playlistId],
		queryFn: () => playlistService.getChannelPlaylistById(playlistId),
		enabled: !!playlistId,
	})

	return { playlist, isLoading, isError }
}
