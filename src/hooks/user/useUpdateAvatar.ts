import { userService } from '@/services/user.service'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export const useUpdateAvatar = () => {
	const queryClient = useQueryClient()
	const { mutate: updateAvatar, isPending: isUploadAvatarLoading } =
		useMutation({
			mutationKey: ['updateAvatar'],
			mutationFn: (data: File) => userService.updateAvatar(data),
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: ['getMe'] })
			},
		})

	return { updateAvatar, isUploadAvatarLoading }
}
