import { playlistService } from '@/services/playlist.service'
import type { IPlaylist } from '@/types/playlist.types'
import { useQuery } from '@tanstack/react-query'

export const useGetMyPlaylists = () => {
	const { data: allMyPlaylists, isLoading } = useQuery<IPlaylist[]>({
		queryKey: ['getMyPlaylists'],
		queryFn: () => playlistService.getMyPlaylists(),
	})

	return { allMyPlaylists, isLoading }
}
