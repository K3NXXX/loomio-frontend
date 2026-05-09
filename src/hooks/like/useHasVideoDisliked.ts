import { useGetMe } from '@/hooks/auth/useGetMe'
import { likeService } from '@/services/like.service'
import { useQuery } from '@tanstack/react-query'

export const useHasVideoDisliked = (videoId: string) => {
	const { userData } = useGetMe()

	const { data: isDisliked } = useQuery({
		queryKey: ['hasVideoDisliked', videoId],
		queryFn: () => likeService.hasVideoDisliked(videoId),
		enabled: Boolean(videoId && userData),
	})

	return { isDisliked }
}
