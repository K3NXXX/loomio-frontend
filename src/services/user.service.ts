import axiosInstance from '@/lib/axios'
import type { IGetUserData } from '@/types/auth.types'

import type { CustomThemePayload } from '@/lib/custom-theme-vars'
import type {
	AppearanceApiMode,
	ChangeAppearanceResponse,
	ChangeCustomThemeResponse,
	ChangeThemeResponse,
	THEME_COLORS,
} from '@/types/colors.types'
import type { IFollowedChannel } from '@/types/channel.types'
import type { IUpdateAccountRequest } from '@/types/user.types'

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

	async changeCustomTheme(
		payload: CustomThemePayload,
	): Promise<ChangeCustomThemeResponse> {
		const { data } = await axiosInstance.patch<ChangeCustomThemeResponse>(
			`${this.BASE_URL}/custom-theme`,
			payload,
		)
		return data
	}

	async changeAppearance(
		appearance: AppearanceApiMode,
	): Promise<ChangeAppearanceResponse> {
		const { data } = await axiosInstance.patch<ChangeAppearanceResponse>(
			`${this.BASE_URL}/appearance`,
			{ appearance },
		)
		return data
	}

	async getMe() {
		const { data } = await axiosInstance.get<IGetUserData>(`${this.BASE_URL}`)
		return data
	}

	async updateAvatar(file: File) {
		const formData = new FormData()
		formData.append('file', file)

		await axiosInstance.patch(`${this.BASE_URL}/update/avatar`, formData)
	}

	async deleteAvatar() {
		await axiosInstance.delete(`${this.BASE_URL}/delete/avatar`)
	}

	async updateAccount(userData: IUpdateAccountRequest) {
		const { data } = await axiosInstance.patch<IGetUserData>(
			`${this.BASE_URL}/update`,
			userData,
		)
		return data
	}

	async getFollowedChannels(): Promise<IFollowedChannel[]> {
		const { data } = await axiosInstance.get<IFollowedChannel[]>(
			`${this.BASE_URL}/following`,
		)
		return data
	}
}

export const userService = new UserService()
