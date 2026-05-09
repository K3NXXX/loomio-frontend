import { useGetMe } from '@/hooks/auth/useGetMe'
import { followService } from '@/services/follow.service'
import { useQuery } from '@tanstack/react-query'

export const useIsFollowing = (followingId: string) => {
	const { userData } = useGetMe()

	const { data: isFollowing } = useQuery({
		queryKey: ['isFollowing', followingId],
		queryFn: () => followService.isFollowing(followingId),
		enabled: Boolean(followingId && userData),
	})

	return { isFollowing }
}
