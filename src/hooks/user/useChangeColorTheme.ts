import { userService } from '@/services/user.service'
import { THEME_COLORS } from '@/types/colors.types'
import { useMutation } from '@tanstack/react-query'

export const useChangeColorTheme = () => {
	const {mutate: changeColorTheme} = useMutation({
		mutationKey: ['changeColorTheme'],
		mutationFn: (data: THEME_COLORS) => userService.changeColorTheme(data) 
	})

	return {changeColorTheme}
}