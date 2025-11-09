import { playlistService } from '@/services/playlist.service'
import type { IPlaylist } from '@/types/playlist.types'
import { useQuery } from '@tanstack/react-query'

export const useGetOneUserPlaylist = (playlistId: string | undefined) => {
	const {
		data: playlist,
		isLoading,
		isError,
		error,
	} = useQuery<IPlaylist>({
		queryKey: ['getOneUserPlaylist', playlistId],
		queryFn: () => playlistService.getOneUserPlaylist(playlistId!),
		enabled: Boolean(playlistId),
		staleTime: 1000 * 60 * 2,
		retry: 1,
	})

	return { playlist, isLoading, isError, error }
}
