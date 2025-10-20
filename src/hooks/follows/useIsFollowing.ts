import { followService } from '@/services/follow.service'
import { useQuery } from '@tanstack/react-query'

export const useIsFollowing = (followingId: string) => {
	const { data: isFollowing } = useQuery({
		queryKey: ['isFollowing'],
		queryFn: () => followService.isFollowing(followingId),
		enabled: !!followingId,
	})

	return { isFollowing }
}
