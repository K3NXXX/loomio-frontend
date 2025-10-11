import { videoService } from '@/services/video.service'
import type { IAddVideoRequest } from '@/types/video.types'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

export const useAddVideo = () => {
	const { mutate: addVideo } = useMutation({
		mutationKey: ['addVideo'],
		mutationFn: (data: FormData) => videoService.addVideo(data),
		onSuccess: () => {
			toast.success('Video added successfully')
		},
	})

	return { addVideo }
}
