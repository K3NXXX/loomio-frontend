import { videoService } from '@/services/video.service'
import type { PublicVideoFeed } from '@/types/public-video-feed.types'
import type { IPublicVideosPage } from '@/types/video.types'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useGetMe } from '@/hooks/auth/useGetMe'

const HOME_FEED_PAGE_SIZE = 24

export const useGetPublicVideos = (feed: PublicVideoFeed = 'home') => {
	const { userData } = useGetMe()

	const q = useInfiniteQuery({
		queryKey: [
			'getPublicVideos',
			feed,
			userData?.id ?? 'guest',
			HOME_FEED_PAGE_SIZE,
		],
		queryFn: ({ pageParam }) =>
			videoService.getAllVideos(pageParam, HOME_FEED_PAGE_SIZE, feed),
		initialPageParam: 1,
		getNextPageParam: (last: IPublicVideosPage) =>
			last.hasMore ? last.page + 1 : undefined,
		enabled: true,
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
