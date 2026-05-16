import withPWAInit from 'next-pwa'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin()

// eslint-disable-next-line @typescript-eslint/no-require-imports
const nextPwaDefaultCache = require('next-pwa/cache') as Array<{
	handler: string
	options?: { cacheName?: string; [k: string]: unknown }
	urlPattern: RegExp | ((ctx: { url: URL }) => boolean)
}>

const runtimeCaching = nextPwaDefaultCache.map((entry) => {
	if (entry.options?.cacheName === 'static-video-assets') {
		return {
			urlPattern: /\.(?:mp4)$/i,
			handler: 'NetworkOnly' as const,
			options: {},
		}
	}
	return entry
})

const nextConfig = {
	eslint: {
		ignoreDuringBuilds: true,
	},
	typescript: {
		ignoreBuildErrors: true,
	},
	images: {
		// `domains` kept for compatibility; pathname omitted on remotePatterns so Next uses default `**` (see match-remote-pattern).
		domains: [
			'imagedelivery.net',
			'videodelivery.net',
			'res.cloudinary.com',
			'picsum.photos',
		],
		remotePatterns: [
			{ protocol: 'https', hostname: 'imagedelivery.net' },
			{ protocol: 'https', hostname: 'videodelivery.net' },
			{ protocol: 'https', hostname: 'res.cloudinary.com' },
			{ protocol: 'https', hostname: 'picsum.photos' },
		],
	},
}

const withPWA = withPWAInit({
	dest: 'public',
	disable:
		process.env.NODE_ENV === 'development' ||
		process.env.DISABLE_PWA === 'true',
	register: true,
	skipWaiting: true,
	clientsClaim: true,
	scope: '/',
	fallbacks: {
		document: '/offline',
	},
	runtimeCaching,
})

export default withNextIntl(withPWA(nextConfig))
