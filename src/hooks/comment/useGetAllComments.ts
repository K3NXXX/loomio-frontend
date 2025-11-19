import { commentService } from '@/services/comment.service'
import type { IVideoCommentsResponse } from '@/types/comment.types'
import { useQuery } from '@tanstack/react-query'

export const useGetAllComments = (videoId: string) => {
	const { data: allComments } = useQuery<IVideoCommentsResponse>({
		queryKey: ['getAllComments', videoId],
		queryFn: () => commentService.getComments(videoId),
		refetchOnWindowFocus: false,
		refetchOnMount: true,
	})

	return { allComments }
}
