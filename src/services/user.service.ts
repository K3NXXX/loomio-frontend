import axiosInstance from '@/lib/axios'

import type { IGetUserData, IUser } from '@/types/auth.types'
import type { ChangeThemeResponse, THEME_COLORS } from '@/types/colors.types'

class UserService {
	private BASE_URL = `${process.env.NEXT_PUBLIC_API_URL!}/user`

	async changeColorTheme(color: THEME_COLORS): Promise<ChangeThemeResponse> {
		const { data } = await axiosInstance.patch<ChangeThemeResponse>(
			`${this.BASE_URL}/theme`,
			{
				theme: color,
			},
		)
		return data
	}

	async getMe() {
		const { data } = await axiosInstance.get<IGetUserData>(`${this.BASE_URL}`)
		return data
	}
}

export const userService = new UserService()
