import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios'

import { PAGES } from '@/constants/pages.constants'
import { refreshAccessTokenSilently } from '@/lib/auth-refresh'

type ConfigWithRetry = InternalAxiosRequestConfig & { _retry?: boolean }

function isUnauthenticatedMeProbe(config: ConfigWithRetry): boolean {
	if (config.method?.toLowerCase() !== 'get') return false
	const raw = String(config.url ?? '')
	try {
		const path = raw.includes('://') ? new URL(raw).pathname : raw.split('?')[0] ?? ''
		return /^\/user\/?$/.test(path || '/')
	} catch {
		return /^\/user\/?$/.test(raw.split('?')[0] ?? '')
	}
}

const axiosInstance = axios.create({
	baseURL: process.env.NEXT_PUBLIC_API_URL,
	withCredentials: true,
})

axiosInstance.interceptors.response.use(
	(response) => response,
	async (error: AxiosError) => {
		const originalRequest = error.config as ConfigWithRetry | undefined

		if (!originalRequest || !error.response) {
			return Promise.reject(error)
		}

		const url = String(originalRequest.url ?? '')
		const isRefreshCall = url.includes('/auth/refresh')
		const isAuthFailureExempt =
			url.includes('/auth/login') ||
			url.includes('/auth/register') ||
			url.includes('/auth/password-reset')

		if (
			error.response.status === 401 &&
			!originalRequest._retry &&
			!isRefreshCall &&
			!isAuthFailureExempt
		) {
			originalRequest._retry = true
			try {
				await refreshAccessTokenSilently()
				return axiosInstance(originalRequest)
			} catch {
				if (isUnauthenticatedMeProbe(originalRequest)) {
					return Promise.reject(error)
				}
				if (typeof window !== 'undefined') {
					window.location.href = PAGES.LOGIN
				}
				return Promise.reject(error)
			}
		}

		return Promise.reject(error)
	},
)

export default axiosInstance
