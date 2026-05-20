import { playlistService } from '@/services/playlist.service'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'

export const useRemoveVideosFromPlaylist = () => {
	const queryClient = useQueryClient()
	const t = useTranslations('toast')

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
			toast.error(t('removeVideosFromPlaylistFailed'))
		},
	})

	return { removeVideosFromPlaylist, isPending }
}
