import { videoService } from '@/services/video.service'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

export const useDeleteTempVideo = () => {
	const { mutateAsync: deleteTempVideo, isPending } = useMutation({
		mutationKey: ['deleteTempVideo'],
		mutationFn: (videoId: string) => videoService.deleteTempVideo(videoId),

		onError: () => {
			toast.error('Failed to delete temp video')
		},
	})

	return {
		deleteTempVideo,
		isDeletingTemp: isPending,
	}
}
