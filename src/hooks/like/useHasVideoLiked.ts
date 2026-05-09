import { useGetMe } from '@/hooks/auth/useGetMe'
import { likeService } from '@/services/like.service'
import { useQuery } from '@tanstack/react-query'

export const useHasVideoLiked = (videoId: string) => {
	const { userData } = useGetMe()

	const { data: isLiked } = useQuery({
		queryKey: ['hasVideoLiked', videoId],
		queryFn: () => likeService.hasVideoLiked(videoId),
		enabled: Boolean(videoId && userData),
	})

	return { isLiked }
}
