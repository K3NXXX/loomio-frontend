import { channelService } from '@/services/channel.service'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

type EditArgs = { channelId: string; fd: FormData }

export const useEditChannel = () => {
	const queryClient = useQueryClient()

	const { mutate: editChannel, isPending } = useMutation({
		mutationKey: ['editChannel'],
		mutationFn: ({ channelId, fd }: EditArgs) =>
			channelService.editChannel(channelId, fd),

		onSuccess: () => {
			toast.success('Channel updated!')
			queryClient.invalidateQueries({ queryKey: ['getChannel'] })
		},
		onError: () => {
			toast.error('Something went wrong. Try later')
		},
	})

	return { editChannel, isPending }
}
