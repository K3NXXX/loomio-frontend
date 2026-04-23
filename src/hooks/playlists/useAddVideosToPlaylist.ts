import { playlistService } from '@/services/playlist.service'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export const useAddVideosToPlaylist = () => {
	const queryClient = useQueryClient()

	const { mutateAsync: addVideosToPlaylist, isPending } = useMutation({
		mutationFn: ({
			playlistId,
			videoIds,
		}: {
			playlistId: string
			videoIds: string[]
		}) => playlistService.addVideosToPlaylist(playlistId, videoIds),
		onSuccess: (_, { playlistId }) => {
			queryClient.invalidateQueries({
				queryKey: ['channel-playlist', playlistId],
			})
			queryClient.invalidateQueries({ queryKey: ['getMyPlaylists'] })
		},
		onError: () => {
			toast.error('Failed to add videos. Try again later.')
		},
	})

	return { addVideosToPlaylist, isPending }
}
