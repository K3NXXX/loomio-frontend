import { userService } from '@/services/user.service'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export const useDeleteAvatar = () => {
	const queryClient = useQueryClient()
	const { mutate: deleteAvatar } = useMutation({
		mutationKey: ['deleteAvatar'],
		mutationFn: () => userService.deleteAvatar(),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['getMe'] })
		},
	})

	return { deleteAvatar }
}
