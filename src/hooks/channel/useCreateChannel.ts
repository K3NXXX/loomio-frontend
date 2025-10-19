import { channelService } from '@/services/channel.service'
import type { ICreateChannelRequest } from '@/types/channel.types'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export const useCreateChannel = () => {
	const queryClient = useQueryClient()
	const { mutate: createChannel } = useMutation({
		mutationKey: ['createChannel'],
		mutationFn: (data: ICreateChannelRequest) =>
			channelService.createChannel(data),

		onSuccess: () => {
			toast.success('Channel created!')
			queryClient.invalidateQueries({ queryKey: ['getUserChannels'] })
		},

		onError: () => {
			toast.error('Something went wrong. Try later')
		},
	})

	return { createChannel }
}
