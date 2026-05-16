import { videoService } from '@/services/video.service'
import type { IPublicVideosPage } from '@/types/video.types'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useGetMe } from '@/hooks/auth/useGetMe'

const HOME_FEED_PAGE_SIZE = 24

export const useGetPublicVideos = () => {
	const { userData, authReady } = useGetMe()

	const q = useInfiniteQuery({
		queryKey: ['getPublicVideos', userData?.id ?? 'guest', HOME_FEED_PAGE_SIZE],
		queryFn: ({ pageParam }) =>
			videoService.getAllVideos(pageParam, HOME_FEED_PAGE_SIZE),
		initialPageParam: 1,
		getNextPageParam: (last: IPublicVideosPage) =>
			last.hasMore ? last.page + 1 : undefined,
		enabled: authReady,
	})

	const videos = q.data?.pages.flatMap((p) => p.items) ?? []

	return {
		videos,
		isError: q.isError,
		isLoading: q.isLoading,
		isFetchingNextPage: q.isFetchingNextPage,
		hasNextPage: q.hasNextPage,
		fetchNextPage: q.fetchNextPage,
	}
}
