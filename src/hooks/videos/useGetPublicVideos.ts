import { videoService } from '@/services/video.service'
import type { IVideo } from '@/types/video.types'
import { useQuery } from '@tanstack/react-query'

export const useGetPublicVideos = () => {
	const {
		data: videos,
		isError,
		isLoading,
	} = useQuery<IVideo[]>({
		queryKey: ['getPublicVideos'],
		queryFn: () => videoService.getAllVideos(),
	})

	return { videos, isError, isLoading }
}
