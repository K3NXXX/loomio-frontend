import { playlistService } from '@/services/playlist.service'
import type { ICreatePlaylistRequest } from '@/types/playlist.types'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'

export const useCreatePlaylist = () => {
	const queryClient = useQueryClient()
	const t = useTranslations('toast')

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
			toast.error(t('createPlaylistFailed'))
		},
	})

	return { createPlaylist, isPending }
}
