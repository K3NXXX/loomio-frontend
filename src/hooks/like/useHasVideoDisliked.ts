import { likeService } from '@/services/like.service'
import { useQuery, useQueryClient } from '@tanstack/react-query'

export const useHasVideoDisliked = (videoId: string) => {
	const { data: isDisliked } = useQuery({
		queryKey: ['hasVideoDisliked'],
		queryFn: () => likeService.hasVideoDisliked(videoId),
	})

	return { isDisliked }
}
