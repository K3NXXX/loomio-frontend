import axiosInstance from '@/lib/axios'

import type { ChangeThemeResponse, THEME_COLORS } from '@/types/colors.types'
import type { ISearchProjectMembersResponse } from '@/types/project.types'

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

	async searchProjectMembers(searchingData: string) {
		const { data } = await axiosInstance.get<ISearchProjectMembersResponse[]>(
			`${this.BASE_URL}/search?${searchingData}`,
		)
		return data
	}
}

export const userService = new UserService()
