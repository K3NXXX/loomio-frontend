import axios, { type AxiosError } from 'axios'

import { refreshAccessTokenSilently } from '@/lib/auth-refresh'
import { shouldAttemptAuthRefresh } from '@/lib/axios-request-path'
import type { AxiosConfigWithAuth } from '@/lib/axios.types'

const axiosInstance = axios.create({
	baseURL: process.env.NEXT_PUBLIC_API_URL,
	withCredentials: true,
})

axiosInstance.interceptors.response.use(
	(response) => response,
	async (error: AxiosError) => {
		const originalRequest = error.config as AxiosConfigWithAuth | undefined

		if (!originalRequest || !error.response) {
			return Promise.reject(error)
		}

		if (error.response.status !== 401) {
			return Promise.reject(error)
		}

		if (!shouldAttemptAuthRefresh(originalRequest)) {
			return Promise.reject(error)
		}

		const url = String(originalRequest.url ?? '')
		const isRefreshCall = url.includes('/auth/refresh')
		const isAuthFailureExempt =
			url.includes('/auth/login') ||
			url.includes('/auth/register') ||
			url.includes('/auth/password-reset')

		if (originalRequest._retry || isRefreshCall || isAuthFailureExempt) {
			return Promise.reject(error)
		}

		originalRequest._retry = true
		try {
			await refreshAccessTokenSilently()
			return axiosInstance(originalRequest)
		} catch {
			return Promise.reject(error)
		}
	},
)

export default axiosInstance
