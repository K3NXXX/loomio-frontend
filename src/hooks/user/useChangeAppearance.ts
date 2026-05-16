import { useMutation, useQueryClient } from '@tanstack/react-query'

import { userService } from '@/services/user.service'
import type { AppearanceApiMode } from '@/types/colors.types'

export const useChangeAppearance = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (appearance: AppearanceApiMode) =>
			userService.changeAppearance(appearance),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['getMe'] })
		},
	})
}
