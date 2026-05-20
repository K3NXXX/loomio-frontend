import { videoService } from '@/services/video.service'
import { useMutation } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'

export const useDeleteTempVideo = () => {
	const t = useTranslations('toast')
	const { mutateAsync: deleteTempVideo, isPending } = useMutation({
		mutationKey: ['deleteTempVideo'],
		mutationFn: (videoId: string) => videoService.deleteTempVideo(videoId),

		onError: () => {
			toast.error(t('deleteTempVideoFailed'))
		},
	})

	return {
		deleteTempVideo,
		isDeletingTemp: isPending,
	}
}
