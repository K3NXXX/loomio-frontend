import { videoService } from '@/services/video.service'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export const useRemoveVideoFromPlaylist = () => {
	const queryClient = useQueryClient()

	const { mutate: removeVideoFromPlaylist, isPending } = useMutation({
		mutationKey: ['removeVideoFromPlaylist'],
		mutationFn: ({
			videoId,
			playlistId,
		}: {
			videoId: string
			playlistId: string
		}) => videoService.removeVideoFromUserPlaylist(videoId, playlistId),
		onSuccess: (_, { playlistId }) => {
			queryClient.invalidateQueries({ queryKey: ['getMyPlaylists'] })
			queryClient.invalidateQueries({ queryKey: ['getOneUserPlaylist'] })
			queryClient.invalidateQueries({
				queryKey: ['channel-playlist', playlistId],
			})
		},
		onError: () => {
			toast.error('Failed to remove video from playlist')
		},
	})

	return { removeVideoFromPlaylist, isPending }
}
