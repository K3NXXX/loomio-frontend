import { commentService } from '@/services/comment.service'
import type { IVideoComment, IVideoCommentsResponse } from '@/types/comment.types'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useMemo } from 'react'

const COMMENTS_PAGE_SIZE = 20

export const useGetAllComments = (videoId: string) => {
	const q = useInfiniteQuery({
		queryKey: ['getAllComments', videoId, COMMENTS_PAGE_SIZE],
		queryFn: ({ pageParam }) =>
			commentService.getComments(videoId, pageParam, COMMENTS_PAGE_SIZE),
		initialPageParam: 1,
		getNextPageParam: (last: IVideoCommentsResponse) =>
			last.hasMore ? last.page + 1 : undefined,
		enabled: Boolean(videoId),
		refetchOnWindowFocus: false,
	})

	const rootComments = useMemo<IVideoComment[]>(
		() => q.data?.pages.flatMap((p) => p.data) ?? [],
		[q.data],
	)

	const total = q.data?.pages[0]?.total ?? 0

	return {
		allComments: q.data
			? {
					data: rootComments,
					total,
					page: q.data.pages.at(-1)?.page ?? 1,
					take: COMMENTS_PAGE_SIZE,
					totalPages: q.data.pages[0]?.totalPages ?? 1,
					hasMore: Boolean(q.hasNextPage),
				}
			: undefined,
		rootComments,
		total,
		isLoading: q.isLoading,
		isFetchingNextPage: q.isFetchingNextPage,
		hasNextPage: q.hasNextPage,
		fetchNextPage: q.fetchNextPage,
	}
}
