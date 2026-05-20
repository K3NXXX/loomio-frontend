import { channelService } from '@/services/channel.service'
import type { IChannel } from '@/types/channel.types'
import {
	extractApiErrorMessage,
	getToastApiMessage,
} from '@/utils/toastMessage'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'

type EditArgs = { channelId: string; fd: FormData }

export const useEditChannel = () => {
	const queryClient = useQueryClient()
	const t = useTranslations('toast')

	const { mutate: editChannel, isPending } = useMutation({
		mutationKey: ['editChannel'],
		mutationFn: ({ channelId, fd }: EditArgs) =>
			channelService.editChannel(channelId, fd),

		onSuccess: (data: IChannel) => {
			queryClient.setQueryData(['getChannel', data.username, 'studio'], data)
			queryClient.invalidateQueries({ queryKey: ['getChannel'] })
			queryClient.invalidateQueries({ queryKey: ['getUserChannels'] })
			toast.success(t('channelUpdated'))
		},
		onError: (error: unknown) => {
			toast.error(
				getToastApiMessage(
					extractApiErrorMessage(error),
					t,
					'genericErrorLater',
				),
			)
		},
	})

	return { editChannel, isPending }
}
