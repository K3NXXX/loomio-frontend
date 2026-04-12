import { PAGES } from '@/constants/pages.constants'
import { channelService } from '@/services/channel.service'
import type { ICreateChannelRequest } from '@/types/channel.types'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export const useCreateChannel = () => {
	const queryClient = useQueryClient()
	const router = useRouter()
	const { mutate: createChannel, isPending: channelCreatingLoading } =
		useMutation({
			mutationKey: ['createChannel'],
			mutationFn: (data: ICreateChannelRequest) =>
				channelService.createChannel(data),

			onSuccess: (channel) => {
				toast.success('Channel created!')
				queryClient.invalidateQueries({ queryKey: ['getUserChannels'] })
				queryClient.refetchQueries({ queryKey: ['getUserChannels'] })
				router.push(PAGES.CHANNEL(channel.username))
			},

			onError: (error: any) => {
				toast.error(error.response.data.message)
			},
		})

	return { createChannel, channelCreatingLoading }
}
