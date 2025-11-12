import { videoService } from '@/services/video.service'
import type { IVideo } from '@/types/video.types'
import { useQuery } from '@tanstack/react-query'

export const useGetChannelStudioVideos = (channelId: string) => {
	const {
		data: videos,
		isLoading,
		isError,
		refetch,
	} = useQuery<IVideo[]>({
		queryKey: ['channelStudioVideos', channelId],
		queryFn: () => videoService.getChannelStudioVideos(channelId),
		enabled: !!channelId,
	})

	return { videos, isLoading, isError, refetch }
}
