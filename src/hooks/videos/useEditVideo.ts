import { videoService } from '@/services/video.service'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export const useEditVideo = () => {
	const queryClient = useQueryClient()
	const { mutate: editVideo } = useMutation({
		mutationKey: ['editVideo'],
		mutationFn: ({ videoId, data }: { videoId: string; data: FormData }) =>
			videoService.editVideo(videoId, data),
		onSuccess: () => {
			toast.success('Video edited successfully')
			queryClient.invalidateQueries({ queryKey: ['getPublicVideos'] })
			queryClient.invalidateQueries({ queryKey: ['getChannel'] })
		},
	})

	return { editVideo }
}
