import { playlistService } from '@/services/playlist.service'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'

export const useDeletePlaylist = () => {
	const queryClient = useQueryClient()
	const t = useTranslations('toast')
	const { mutate: deletePlaylist } = useMutation({
		mutationKey: ['deletePlaylist'],
		mutationFn: (playlistId: string) =>
			playlistService.deletePlaylist(playlistId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['getMyPlaylists'] })
			queryClient.invalidateQueries({ queryKey: ['getChannelPlaylists'] })
			toast.success(t('playlistDeleted'))
		},
		onError: () => {
			toast.error(t('genericErrorLater'))
		},
	})

	return { deletePlaylist }
}
