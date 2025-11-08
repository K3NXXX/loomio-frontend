import { playlistService } from '@/services/playlist.service'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export const useDeletePlaylist = () => {
	const queryClient = useQueryClient()
	const { mutate: deletePlaylist } = useMutation({
		mutationKey: ['deletePlaylist'],
		mutationFn: (playlistId: string) =>
			playlistService.deletePlaylist(playlistId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['getMyPlaylists'] })
		},
		onError: () => {
			toast.error('Something went wrong. Try later')
		},
	})

	return { deletePlaylist }
}
