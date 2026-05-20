import { playlistService } from '@/services/playlist.service'
import type { IEditPlaylistRequest } from '@/types/playlist.types'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'

export const useEditPlaylist = () => {
	const queryClient = useQueryClient()
	const t = useTranslations('toast')

	const { mutate: editPlaylist, isPending } = useMutation({
		mutationKey: ['editPlaylist'],
		mutationFn: ({ id, ...editData }: { id: string } & IEditPlaylistRequest) =>
			playlistService.editPlaylist(id, editData),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['getMyPlaylists'] })
			queryClient.invalidateQueries({ queryKey: ['getOneUserPlaylist'] })
			queryClient.invalidateQueries({ queryKey: ['getChannelPlaylists'] })
		},
		onError: () => {
			toast.error(t('updatePlaylistFailed'))
		},
	})

	return { editPlaylist, isPending }
}
