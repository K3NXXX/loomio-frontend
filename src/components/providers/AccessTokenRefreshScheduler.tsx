'use client'

import { useGetMe } from '@/hooks/auth/useGetMe'
import {
	getAccessRefreshIntervalMs,
	refreshAccessTokenSilently,
} from '@/lib/auth-refresh'
import { useEffect } from 'react'

export function AccessTokenRefreshScheduler() {
	const { isAuthenticated, authReady } = useGetMe()

	useEffect(() => {
		if (!authReady || !isAuthenticated) {
			return
		}
		const ms = getAccessRefreshIntervalMs()
		const id = window.setInterval(() => {
			void refreshAccessTokenSilently().catch(() => {})
		}, ms)
		return () => window.clearInterval(id)
	}, [authReady, isAuthenticated])

	return null
}
