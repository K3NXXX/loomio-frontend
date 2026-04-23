import { playlistService } from '@/services/playlist.service'
import type { ICreatePlaylistRequest } from '@/types/playlist.types'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export const useCreatePlaylist = () => {
	const queryClient = useQueryClient()

	const { mutate: createPlaylist, isPending } = useMutation({
		mutationKey: ['createPlaylist'],
		mutationFn: (data: ICreatePlaylistRequest) =>
			playlistService.createPlaylist(data),

		onSuccess: (_, variables) => {
			if (variables.channelId) {
				queryClient.invalidateQueries({
					queryKey: ['getChannelPlaylists', variables.channelId],
				})
			} else {
				queryClient.invalidateQueries({
					queryKey: ['getMyPlaylists'],
				})
			}
		},

		onError: () => {
			toast.error('Something went wrong. Try later')
		},
	})

	return { createPlaylist, isPending }
}
