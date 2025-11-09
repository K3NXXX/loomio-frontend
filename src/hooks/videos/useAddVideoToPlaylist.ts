import { playlistService } from '@/services/playlist.service'
import { videoService } from '@/services/video.service'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export const useAddVideoToPlaylist = () => {
	const queryClient = useQueryClient()

	const { mutate: addVideoToPlaylist, isPending } = useMutation({
		mutationKey: ['addVideoToPlaylist'],
		mutationFn: ({
			videoId,
			playlistId,
		}: {
			videoId: string
			playlistId: string
		}) => videoService.addVideoToUserPlaylist(videoId, playlistId),
		onSuccess: () => {
			toast.success('Video added to playlist')
			queryClient.invalidateQueries({ queryKey: ['getMyPlaylists'] })
		},
		onError: () => {
			toast.error('Failed to add video. Try again later.')
		},
	})

	return { addVideoToPlaylist, isPending }
}
