import type { InternalAxiosRequestConfig } from 'axios'

export function getRequestUrlString(
	config: InternalAxiosRequestConfig,
): string {
	const raw = String(config.url ?? '').trim().replace(/^["']|["']$/g, '')
	if (raw.includes('://')) return raw
	const base = String(config.baseURL ?? '')
		.replace(/\/$/, '')
		.replace(/^["']|["']$/g, '')
	const path = raw.startsWith('/') ? raw : `/${raw}`
	return base ? `${base}${path}` : path
}

function pathnameOf(url: string): string {
	try {
		const normalized = url.replace(/^["']|["']$/g, '')
		return new URL(
			normalized.includes('://')
				? normalized
				: `http://local${normalized.startsWith('/') ? normalized : `/${normalized}`}`,
		).pathname
	} catch {
		const q = url.split('?')[0] ?? ''
		const p = q.replace(/^["']|["']$/g, '')
		return p.startsWith('/') ? p : `/${p}`
	}
}

export function hasRefreshTokenCookie(): boolean {
	if (typeof document === 'undefined') return false
	return document.cookie
		.split(';')
		.some((c) => c.trim().startsWith('refreshToken='))
}

export function isUnauthenticatedMeProbe(
	config: InternalAxiosRequestConfig,
): boolean {
	if (config.method?.toLowerCase() !== 'get') return false
	const url = getRequestUrlString(config).toLowerCase()
	return (
		/\/user\/?(\?|$)/.test(url) ||
		url.endsWith('/user') ||
		pathnameOf(url) === '/user' ||
		pathnameOf(url) === '/user/'
	)
}

export function isGuestAccessibleApiRequest(
	config: InternalAxiosRequestConfig,
): boolean {
	if (isUnauthenticatedMeProbe(config)) return true

	const method = config.method?.toLowerCase() ?? 'get'
	const url = getRequestUrlString(config).toLowerCase()
	const path = pathnameOf(url)

	if (method === 'get') {
		if (path.startsWith('/videos/public') || url.includes('/videos/public'))
			return true
		if (
			(/^\/channel\/[^/]+/.test(path) || url.includes('/channel/')) &&
			!path.includes('/channel/me') &&
			!url.includes('/channel/me')
		) {
			return true
		}
		if (path.startsWith('/search') || url.includes('/search')) return true
		if (path.startsWith('/comments/video/') || url.includes('/comments/video/'))
			return true
	}

	if (
		method === 'post' &&
		(/^\/views\/[^/]+/.test(path) || url.includes('/views/'))
	) {
		return true
	}

	return false
}

export function shouldAttemptAuthRefresh(
	config: InternalAxiosRequestConfig,
): boolean {
	const skip = (config as { skipAuthRefresh?: boolean }).skipAuthRefresh
	if (skip) return false
	if (isGuestAccessibleApiRequest(config)) return false
	if (!hasRefreshTokenCookie()) return false
	return true
}
