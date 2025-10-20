import { followService } from '@/services/follow.service'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export const useToggleFollowUser = () => {
	const queryClient = useQueryClient()
	const { mutate: toggleFollowUser } = useMutation({
		mutationKey: ['followUser'],
		mutationFn: (followerId: string) => followService.followUser(followerId),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['isFollowing'],
			})
			queryClient.invalidateQueries({
				queryKey: ['getOnePublicVideo'],
			})
			queryClient.invalidateQueries({
				queryKey: ['getChannel'],
			})
		},
		onError: () => {
			toast.error('Something went wrong. Try later')
		},
	})

	return { toggleFollowUser }
}
