import axiosInstance from '@/lib/axios'
import { THEME_COLORS } from '@/themes/themes'
import axios from 'axios'

class UserService {
	private BASE_URL = `${process.env.NEXT_PUBLIC_API_URL!}/user`

	async changeColorTheme(color: THEME_COLORS) {
		const { data } = await axiosInstance.patch(`${this.BASE_URL}/theme`, {theme: color})
		return data
	}

	async getMe() {
		const { data } = await axiosInstance.get(`${this.BASE_URL}`)
		return data
	}
}

export const userService = new UserService()
