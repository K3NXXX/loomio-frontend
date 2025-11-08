import { playlistService } from '@/services/playlist.service'
import type { IEditPlaylistRequest } from '@/types/playlist.types'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export const useEditPlaylist = () => {
	const queryClient = useQueryClient()

	const { mutate: editPlaylist } = useMutation({
		mutationKey: ['editPlaylist'],
		mutationFn: ({ id, ...editData }: { id: string } & IEditPlaylistRequest) =>
			playlistService.editPlaylist(id, editData),
		onSuccess: () => {
			toast.success('Playlist updated successfully')
			queryClient.invalidateQueries({ queryKey: ['getMyPlaylists'] })
		},
		onError: () => {
			toast.error('Failed to update playlist. Try again later.')
		},
	})

	return { editPlaylist }
}
