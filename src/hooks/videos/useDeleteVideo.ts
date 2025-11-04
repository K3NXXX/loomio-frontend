import { videoService } from '@/services/video.service'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export const useDeleteVideo = () => {
	const queryClient = useQueryClient()
	const { mutate: deleteVideo } = useMutation({
		mutationKey: ['deleteVideo'],
		mutationFn: (videoId: string) => videoService.deleteVideo(videoId),
		onSuccess: () => {
			toast.success('Video deleted successfully')
			queryClient.invalidateQueries({ queryKey: ['getPublicVideos'] })
		},
	})

	return { deleteVideo }
}
