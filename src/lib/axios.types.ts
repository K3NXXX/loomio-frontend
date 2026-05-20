import type { InternalAxiosRequestConfig } from 'axios'

export type AxiosConfigWithAuth = InternalAxiosRequestConfig & {
	_retry?: boolean
	skipAuthRefresh?: boolean
}
