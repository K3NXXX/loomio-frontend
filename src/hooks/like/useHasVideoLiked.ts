import { likeService } from '@/services/like.service'
import { useQuery } from '@tanstack/react-query'

export const useHasVideoLiked = (videoId: string) => {
	const { data: isLiked } = useQuery({
		queryKey: ['hasVideoLiked'],
		queryFn: () => likeService.hasVideoLiked(videoId),
	})

	return { isLiked }
}
