import { videoService } from '@/services/video.service'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export const useAddVideo = () => {
	const queryClient = useQueryClient()
	const { mutate: addVideo } = useMutation({
		mutationKey: ['addVideo'],
		mutationFn: (data: FormData) => videoService.addVideo(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['getPublicVideos'] })
			queryClient.invalidateQueries({ queryKey: ['channelStudioVideos'] })
			queryClient.invalidateQueries({ queryKey: ['getChannel'] })
			
		},
	})

	return { addVideo }
}
