import { playlistService } from '@/services/playlist.service'
import type { IPlaylist } from '@/types/playlist.types'
import { useQuery } from '@tanstack/react-query'

export const useGetPublicPlaylist = (playlistId?: string) => {
	const {
		data: playlist,
		isLoading,
		isError,
	} = useQuery<IPlaylist>({
		queryKey: ['public-playlist', playlistId],
		queryFn: () => playlistService.getPublicPlaylistById(playlistId!),
		enabled: !!playlistId,
	})

	return { playlist, isLoading, isError }
}
