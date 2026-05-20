import { channelService } from '@/services/channel.service'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'

export const useDeleteChannel = (onDone?: () => void) => {
	const queryClient = useQueryClient()
	const t = useTranslations('toast')

	const { mutate: deleteChannel, isPending: deleteChannelLoading } =
		useMutation({
			mutationKey: ['deleteChannel'],
			mutationFn: (channelId: string) =>
				channelService.deleteChannel(channelId),

			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: ['getUserChannels'] })
				onDone?.()
			},

			onError: () => {
				toast.error(t('deleteChannelFailed'))
			},
		})

	return { deleteChannel, deleteChannelLoading }
}
