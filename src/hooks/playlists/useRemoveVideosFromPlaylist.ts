import { playlistService } from '@/services/playlist.service'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export const useRemoveVideosFromPlaylist = () => {
	const queryClient = useQueryClient()

	const { mutateAsync: removeVideosFromPlaylist, isPending } = useMutation({
		mutationFn: ({
			playlistId,
			videoIds,
		}: {
			playlistId: string
			videoIds: string[]
		}) => playlistService.removeVideosFromPlaylist(playlistId, videoIds),
		onSuccess: (_, { playlistId }) => {
			queryClient.invalidateQueries({
				queryKey: ['channel-playlist', playlistId],
			})
			queryClient.invalidateQueries({ queryKey: ['getMyPlaylists'] })
		},
		onError: () => {
			toast.error('Failed to remove videos')
		},
	})

	return { removeVideosFromPlaylist, isPending }
}
