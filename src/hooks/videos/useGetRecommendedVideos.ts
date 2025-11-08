import { videoService } from '@/services/video.service'
import type { IVideo } from '@/types/video.types'
import { useQuery } from '@tanstack/react-query'

export const useGetRecommendedVideos = (videoId: string) => {
	const {
		data: recommendedVideos,
		isError,
		isLoading,
	} = useQuery<IVideo[]>({
		queryKey: ['getRecommendedVideos', videoId],
		queryFn: () => videoService.getRecommendedVideos(videoId),
	})

	return { recommendedVideos, isError, isLoading }
}
