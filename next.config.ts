import withPWA from 'next-pwa'
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
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'imagedelivery.net',
				pathname: '/**',
			},
		],
	},
}

export default withNextIntl(
	withPWA({
		...nextConfig,
		dest: 'public',
		disable: true,
	}),
)
