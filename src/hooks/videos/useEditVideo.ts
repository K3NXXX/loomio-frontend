import { videoService } from '@/services/video.service'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export const useEditVideo = () => {
	const queryClient = useQueryClient()
	const { mutate: editVideo } = useMutation({
		mutationKey: ['editVideo'],
		mutationFn: ({ videoId, data }: { videoId: string; data: FormData }) =>
			videoService.editVideo(videoId, data),
		onSuccess: (_data, variables) => {
			queryClient.invalidateQueries({ queryKey: ['getPublicVideos'] })
			queryClient.invalidateQueries({ queryKey: ['channelStudioVideos'] })
			queryClient.invalidateQueries({
				queryKey: ['getOnePublicVideo', variables.videoId],
			})
		},
	})

	return { editVideo }
}
