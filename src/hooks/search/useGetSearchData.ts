import { searchService } from '@/services/search.service'
import type { ISearchResponse } from '@/types/search.types'
import type { IChannel } from '@/types/channel.types'
import type { IVideo } from '@/types/video.types'
import { useInfiniteQuery } from '@tanstack/react-query'

const SEARCH_PAGE_SIZE = 20

export const useGetSearchData = (searchQuery: string) => {
	const trimmed = searchQuery.trim()

	const q = useInfiniteQuery({
		queryKey: ['getSearchData', trimmed, SEARCH_PAGE_SIZE],
		queryFn: ({ pageParam }) =>
			searchService.getSearchData(trimmed, pageParam, SEARCH_PAGE_SIZE),
		initialPageParam: 1,
		getNextPageParam: (last: ISearchResponse) =>
			last.hasMore ? last.page + 1 : undefined,
		enabled: Boolean(trimmed),
	})

	const channels: IChannel[] = q.data?.pages[0]?.channels ?? []
	const videos: IVideo[] = (() => {
		const seen = new Set<string>()
		const merged: IVideo[] = []
		for (const page of q.data?.pages ?? []) {
			for (const video of page.videos) {
				if (seen.has(video.id)) continue
				seen.add(video.id)
				merged.push(video)
			}
		}
		return merged
	})()

	return {
		videos,
		channels,
		isLoading: q.isLoading,
		isError: q.isError,
		isFetchingNextPage: q.isFetchingNextPage,
		hasNextPage: q.hasNextPage,
		fetchNextPage: q.fetchNextPage,
	}
}
