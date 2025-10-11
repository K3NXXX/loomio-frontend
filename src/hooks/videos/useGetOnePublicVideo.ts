import { videoService } from '@/services/video.service'
import type { IVideo } from '@/types/video.types'
import { useQuery } from '@tanstack/react-query'

export const useGetOnePublicVideo = (videoId: string) => {
	const {
		data: video,
		isLoading,
		isError,
	} = useQuery<IVideo>({
		queryKey: ['getOnePublicVideo'],
		queryFn: () => videoService.getOneVideo(videoId),
	})

	return { video, isLoading, isError }
}
