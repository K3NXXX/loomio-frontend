import { channelService } from '@/services/channel.service'
import axios from 'axios'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

function axiosErrorMessage(error: unknown, fallback: string): string {
	if (!axios.isAxiosError(error)) return fallback
	const data = error.response?.data as { message?: string | string[] } | undefined
	const m = data?.message
	if (Array.isArray(m) && m[0]) return m[0]
	if (typeof m === 'string' && m) return m
	return fallback
}

type EditArgs = { channelId: string; fd: FormData }

export const useEditChannel = () => {
	const queryClient = useQueryClient()

	const { mutate: editChannel, isPending } = useMutation({
		mutationKey: ['editChannel'],
		mutationFn: ({ channelId, fd }: EditArgs) =>
			channelService.editChannel(channelId, fd),

		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['getChannel'] })
			queryClient.invalidateQueries({ queryKey: ['getUserChannels'] })
			toast.success('Канал успішно оновлено')
		},
		onError: (error) => {
			toast.error(
				axiosErrorMessage(error, 'Something went wrong. Try later'),
			)
		},
	})

	return { editChannel, isPending }
}
