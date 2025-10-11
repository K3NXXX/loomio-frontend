import { videoService } from '@/services/video.service'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export const useAddVideo = () => {
	const queryClient = useQueryClient()
	const { mutate: addVideo } = useMutation({
		mutationKey: ['addVideo'],
		mutationFn: (data: FormData) => videoService.addVideo(data),
		onSuccess: () => {
			toast.success('Video added successfully')
			queryClient.invalidateQueries({ queryKey: ['getPublicVideos'] })
		},
	})

	return { addVideo }
}
