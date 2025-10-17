import { commentService } from '@/services/comment.service'
import type { IVideoCommentsResponse } from '@/types/comment.types'
import { useQuery } from '@tanstack/react-query'

export const useGetAllComments = (videoId: string) => {
	const { data: allComments } = useQuery<IVideoCommentsResponse>({
		queryKey: ['getAllComments'],
		queryFn: () => commentService.getComments(videoId),
	})

	return { allComments }
}
