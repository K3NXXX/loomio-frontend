import withPWAInit from 'next-pwa'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin()

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
		],
		remotePatterns: [
			{ protocol: 'https', hostname: 'imagedelivery.net' },
			{ protocol: 'https', hostname: 'videodelivery.net' },
			{ protocol: 'https', hostname: 'res.cloudinary.com' },
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
})

export default withNextIntl(withPWA(nextConfig))
