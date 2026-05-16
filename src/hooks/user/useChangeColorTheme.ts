import { useMutation, useQueryClient } from '@tanstack/react-query'

import { userService } from '@/services/user.service'

import type { THEME_COLORS } from '@/types/colors.types'

export const useChangeColorTheme = () => {
	const queryClient = useQueryClient()

	const { mutate: changeColorTheme } = useMutation({
		mutationKey: ['changeColorTheme'],
		mutationFn: (data: THEME_COLORS) => userService.changeColorTheme(data),
		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: ['getMe'] })
		},
	})

	return { changeColorTheme }
}
