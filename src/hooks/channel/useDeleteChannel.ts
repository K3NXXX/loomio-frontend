import { channelService } from '@/services/channel.service'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export const useDeleteChannel = (onDone?: () => void) => {
	const queryClient = useQueryClient()

	const { mutate: deleteChannel, isPending: deleteChannelLoading } =
		useMutation({
			mutationKey: ['deleteChannel'],
			mutationFn: (channelId: string) =>
				channelService.deleteChannel(channelId),

			onSuccess: () => {
				toast.success('Channel deleted')
				queryClient.invalidateQueries({ queryKey: ['getUserChannels'] })
				onDone?.()
			},

			onError: () => {
				toast.error('Failed to delete channel. Try again later.')
			},
		})

	return { deleteChannel, deleteChannelLoading }
}
