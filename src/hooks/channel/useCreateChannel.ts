import { PAGES } from '@/constants/pages.constants'
import { channelService } from '@/services/channel.service'
import {
	extractApiErrorMessage,
	getToastApiMessage,
} from '@/utils/toastMessage'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export const useCreateChannel = () => {
	const queryClient = useQueryClient()
	const router = useRouter()
	const t = useTranslations('toast')
	const { mutate: createChannel, isPending: channelCreatingLoading } =
		useMutation({
			mutationKey: ['createChannel'],
			mutationFn: (data: FormData) =>
				channelService.createChannel(data),

			onSuccess: (channel) => {
				queryClient.invalidateQueries({ queryKey: ['getUserChannels'] })
				queryClient.refetchQueries({ queryKey: ['getUserChannels'] })
				router.push(PAGES.CHANNEL(channel.username))
			},

			onError: (error: unknown) => {
				toast.error(
					getToastApiMessage(extractApiErrorMessage(error), t),
				)
			},
		})

	return { createChannel, channelCreatingLoading }
}
