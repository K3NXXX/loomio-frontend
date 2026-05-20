import { playlistService } from '@/services/playlist.service'
import { videoService } from '@/services/video.service'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'

export const useAddVideoToPlaylist = () => {
	const queryClient = useQueryClient()
	const t = useTranslations('toast')

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
			queryClient.invalidateQueries({ queryKey: ['getMyPlaylists'] })
		},
		onError: () => {
			toast.error(t('addVideoToPlaylistFailed'))
		},
	})

	return { addVideoToPlaylist, isPending }
}
