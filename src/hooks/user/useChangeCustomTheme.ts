import { useMutation, useQueryClient } from '@tanstack/react-query'

import { userService } from '@/services/user.service'

import type { CustomThemePayload } from '@/lib/custom-theme-vars'

export const useChangeCustomTheme = () => {
	const queryClient = useQueryClient()

	const { mutateAsync: saveCustomTheme, isPending: isSavingCustomTheme } =
		useMutation({
			mutationKey: ['changeCustomTheme'],
			mutationFn: (data: CustomThemePayload) =>
				userService.changeCustomTheme(data),
			onSuccess: () => {
				void queryClient.invalidateQueries({ queryKey: ['getMe'] })
			},
		})

	return { saveCustomTheme, isSavingCustomTheme }
}
