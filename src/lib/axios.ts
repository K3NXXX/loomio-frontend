import axios from 'axios'

import { PAGES } from '@/constants/pages.constants'
import { authService } from '@/services/auth.service'

const axiosInstance = axios.create({
	baseURL: process.env.NEXT_PUBLIC_API_URL,
	withCredentials: true,
})

axiosInstance.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error?.config

		console.log('error', error)

		if (!error || !error.config || !error.response) {
			return Promise.reject(error)
		}

		const isAuthRefreshRequest = originalRequest.url?.includes('/auth/refresh')

		if (
			error.response.status === 401 &&
			!originalRequest._retry &&
			!isAuthRefreshRequest
		) {
			originalRequest._retry = true
			try {
				const { accessToken } = await authService.refreshToken()

				axiosInstance.defaults.headers.common['Authorization'] =
					`Bearer ${accessToken}`
				originalRequest.headers['Authorization'] = `Bearer ${accessToken}`

				return axiosInstance(originalRequest)
			} catch (refreshError) {
				window.location.href = PAGES.LOGIN
				return Promise.reject(refreshError)
			}
		}

		return Promise.reject(error)
	},
)

export default axiosInstance
