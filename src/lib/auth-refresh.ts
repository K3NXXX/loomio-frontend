import axios from 'axios'

let refreshInFlight: Promise<void> | null = null

export function refreshAccessTokenSilently(): Promise<void> {
	const base = process.env.NEXT_PUBLIC_API_URL
	if (!base) {
		return Promise.reject(new Error('NEXT_PUBLIC_API_URL is not set'))
	}
	if (refreshInFlight) {
		return refreshInFlight
	}
	refreshInFlight = axios
		.post(`${base}/auth/refresh`, {}, { withCredentials: true })
		.then(() => undefined)
		.finally(() => {
			refreshInFlight = null
		})
	return refreshInFlight
}

export function getAccessRefreshIntervalMs(): number {
	const raw = process.env.NEXT_PUBLIC_ACCESS_REFRESH_INTERVAL_MS
	if (raw != null && raw !== '' && !Number.isNaN(Number(raw))) {
		return Math.max(10_000, Number(raw))
	}
	/** Default: every 10 minutes (override with NEXT_PUBLIC_ACCESS_REFRESH_INTERVAL_MS). */
	return 10 * 60_000
}
