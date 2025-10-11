import withPWA from 'next-pwa'

const nextConfig = withPWA({
	dest: 'public',
	disable: true,
})

export default {
	...nextConfig,
	eslint: {
		ignoreDuringBuilds: true,
	},
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'res.cloudinary.com',
			},
		],
	},
}
